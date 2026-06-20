import { useState } from "react";
import { X, Plus, Minus, Trash2 } from "lucide-react";
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
        .insert({ user_id: user.id, total, status: "pending", payment_ref: "paypal:zyko921" })
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
        sendOrderEmail({ data: { email: user.email, items, total } })
          .catch(e => console.error("Email send error:", e));
      }

      clear();
      setOpen(false);
      toast.success("Commande enregistrée ! Un email t'a été envoyé. PayPal s'ouvre — ensuite ouvre un ticket Discord pour ton produit.", { duration: 8000 });
      window.open(`${PAYPAL_URL}/${total.toFixed(2)}EUR`, "_blank");
      window.open("https://discord.gg/8RBgw6ykQK", "_blank");
      navigate({ to: "/orders" });
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
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">{total.toFixed(2)}€</span>
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