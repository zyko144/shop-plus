import { useState, useEffect } from "react";
import { X, Plus, Minus, Trash2, Coins } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { PAYPAL_URL } from "@/lib/products";
import { toast } from "sonner";
import { sendOrderEmail } from "@/lib/email";

export function CartDrawer() {
  const { items, open, setOpen, setQty, remove, total, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState("");
  
  // Système + Coins
  const [plusCoins, setPlusCoins] = useState(0);
  const [useCoins, setUseCoins] = useState(false);

  useEffect(() => {
    if (user && open) {
      supabase.from("profiles").select("plus_coins").eq("id", user.id).single().then(({ data }) => {
        if (data) setPlusCoins(data.plus_coins || 0);
      });
    }
  }, [user, open]);

  const finalTotal = useCoins ? (total * (1 - discount)) * 0.5 : total * (1 - discount);
  const coinsEarned = Math.floor(finalTotal * 100);

  const applyPromo = async () => {
    if (!promoInput.trim()) return;
    setLoading(true);
    setPromoError("");
    const { data, error } = await supabase.from("promo_codes").select("*").eq("code", promoInput.trim().toUpperCase()).single();
    setLoading(false);
    if (error || !data || !data.is_active || data.current_uses >= data.max_uses) {
      setPromoError("Code invalide ou expiré");
      setDiscount(0);
      setPromoApplied("");
    } else {
      setDiscount(data.discount_percentage / 100);
      setPromoApplied(data.code);
      setPromoError("");
      toast.success(`Code ${data.code} appliqué : -${data.discount_percentage}% !`);
    }
  };

  const checkout = async () => {
    if (!user) {
      toast.error("Connecte-toi pour commander");
      setOpen(false);
      navigate({ to: "/auth" });
      return;
    }
    if (items.length === 0) return;
    setLoading(true);
    try {
      const { data: order, error } = await supabase
        .from("orders")
        .insert({ user_id: user.id, total: finalTotal, status: "pending", payment_ref: "paypal:zyko921" })
        .select()
        .single();
      if (error) throw error;
      const { error: itemsErr } = await supabase.from("order_items").insert(
        items.map((i) => ({
          order_id: order.id,
          product_id: i.id,
          product_name: i.name + (i.subtitle ? ` (${i.subtitle})` : ""),
          category: i.category,
          unit_price: i.price,
          quantity: i.quantity,
        }))
      );
      if (itemsErr) throw itemsErr;

      // Envoi de l'email au client
      if (user.email) {
        sendOrderEmail({ data: { email: user.email, items, total: finalTotal } })
          .catch(e => console.error("Email send error:", e));
      }

      // Incrémenter le nombre d'utilisations du code promo si utilisé
      if (promoApplied) {
        await supabase.rpc('increment_promo_use', { promo_code: promoApplied }).catch(() => {});
      }

      // Mise à jour des + Coins du client
      let coinsDelta = coinsEarned;
      if (useCoins) coinsDelta -= 1000;
      if (coinsDelta !== 0) {
        await supabase.from("profiles").update({ plus_coins: plusCoins + coinsDelta }).eq("id", user.id);
      }

      clear();
      setOpen(false);
      toast.success(`Commande enregistrée ! Vous avez gagné ${coinsEarned} + Coins. PayPal s'ouvre — ensuite ouvre un ticket Discord.`, { duration: 8000 });
      window.open(`${PAYPAL_URL}/${finalTotal.toFixed(2)}EUR`, "_blank");
      window.open("https://discord.gg/8RBgw6ykQK", "_blank");
      navigate({ to: "/profile" });
    } catch (e: any) {
      toast.error(e.message ?? "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md glass border-l border-border flex flex-col">
        <div className="p-4 flex items-center justify-between border-b border-border">
          <h3 className="font-bold text-lg">Panier ({items.length})</h3>
          <button onClick={() => setOpen(false)} className="p-2 rounded hover:bg-muted"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 && <p className="text-muted-foreground text-center py-12">Ton panier est vide</p>}
          {items.map((i) => (
            <div key={i.id} className="flex gap-3 p-3 rounded-xl glass" style={{ borderLeft: `3px solid ${i.color}` }}>
              <div className="w-12 h-12 rounded-lg grid place-items-center text-xl" style={{ background: `${i.color}33` }}>{i.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{i.name}</div>
                {i.subtitle && <div className="text-xs text-muted-foreground">{i.subtitle}</div>}
                <div className="text-sm font-bold mt-1" style={{ color: i.color }}>{(i.price * i.quantity).toFixed(2)}€</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <button onClick={() => remove(i.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                <div className="flex items-center gap-1 bg-muted rounded">
                  <button onClick={() => setQty(i.id, i.quantity - 1)} className="p-1"><Minus size={12} /></button>
                  <span className="text-xs w-5 text-center">{i.quantity}</span>
                  <button onClick={() => setQty(i.id, i.quantity + 1)} className="p-1"><Plus size={12} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-border space-y-3">
          {items.length > 0 && (
            <>
              {/* Système + Coins */}
              {user && (
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-3 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-yellow-500 font-bold text-sm">
                      <Coins size={16} />
                      Vos + Coins : {plusCoins}
                    </div>
                    <div className="text-xs text-yellow-500/70">
                      Gagnez +{coinsEarned} Coins
                    </div>
                  </div>
                  {plusCoins >= 1000 && (
                    <button
                      onClick={() => setUseCoins(!useCoins)}
                      className={`text-xs font-bold py-1.5 px-3 rounded-lg transition border ${useCoins ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50 hover:bg-yellow-500/30'}`}
                    >
                      {useCoins ? "1000 Coins utilisés (-50%)" : "Utiliser 1000 Coins pour -50%"}
                    </button>
                  )}
                  {plusCoins < 1000 && (
                    <div className="text-xs text-white/40 italic">
                      Il vous manque {1000 - plusCoins} Coins pour avoir -50% !
                    </div>
                  )}
                </div>
              )}

              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Code promo"
                    value={promoInput}
                    onChange={e => setPromoInput(e.target.value)}
                    className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 text-sm focus:border-primary outline-none"
                    disabled={!!promoApplied}
                  />
                  {!promoApplied ? (
                    <button onClick={applyPromo} disabled={loading || !promoInput.trim()} className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition">
                      Appliquer
                    </button>
                  ) : (
                    <button onClick={() => { setDiscount(0); setPromoApplied(""); setPromoInput(""); }} className="px-3 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded-lg text-sm font-bold transition">
                      Retirer
                    </button>
                  )}
                </div>
                {promoError && <div className="text-red-400 text-xs mt-1 font-medium">{promoError}</div>}
                {promoApplied && <div className="text-green-400 text-xs mt-1 font-medium">Code {promoApplied} actif (-{(discount * 100).toFixed(0)}%)</div>}
              </div>
            </>
          )}

          <div className="flex items-center justify-between text-lg font-bold">
            <span>Total</span>
            <div className="text-right">
              {(discount > 0 || useCoins) && <div className="text-sm text-muted-foreground line-through decoration-red-500">{total.toFixed(2)}€</div>}
              <span className="text-primary">{finalTotal.toFixed(2)}€</span>
            </div>
          </div>
          <button
            onClick={checkout}
            disabled={loading || items.length === 0}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-black font-bold disabled:opacity-50 hover:scale-[1.02] transition"
          >
            {loading ? "..." : "Payer via PayPal"}
          </button>
          <a
            href="https://discord.gg/UUBFjjCp"
            target="_blank"
            rel="noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-white transition hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg,#dc2626,#991b1b)" }}
          >
            🎫 Ouvrir un ticket Discord
          </a>
          <p className="text-xs text-center text-muted-foreground">
            Paiement : paypal.me/zyko921 — Livraison via ticket Discord après paiement
          </p>
        </div>
      </aside>
    </div>
  );
}