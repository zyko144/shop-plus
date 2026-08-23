import { useState, useEffect } from "react";
import { X, Plus, Minus, Trash2, Coins, Crown, AlertTriangle, Copy, Check } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { PAYPAL_URL } from "@/lib/products";
import { toast } from "sonner";
import { sendOrderEmail } from "@/lib/email";
import { notifyDiscordOrder } from "@/lib/discord";
import { getCryptoRates } from "@/lib/crypto";
import type { PaymentMethod } from "./admin/types";

const CRYPTO_DECIMALS: Record<string, number> = { LTC: 4, ETH: 5, SOL: 3 };

export function CartDrawer() {
  const { items, open, setOpen, setQty, remove, total, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState("");
  
  // Système + Coins & Premium
  const [plusCoins, setPlusCoins] = useState(0);
  const [useCoins, setUseCoins] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [premiumOrdersLeft, setPremiumOrdersLeft] = useState(0);

  // Moyens de paiement (PayPal + cryptos ajoutées depuis l'admin)
  const [cryptoMethods, setCryptoMethods] = useState<PaymentMethod[]>([]);
  const [cryptoRates, setCryptoRates] = useState<Record<string, number>>({});
  const [selectedMethod, setSelectedMethod] = useState<"paypal" | string>("paypal"); // "paypal" ou l'id du payment_method
  const [copied, setCopied] = useState(false);
  const [cryptoOrderPlaced, setCryptoOrderPlaced] = useState(false);

  useEffect(() => {
    if (user && open) {
      supabase.from("profiles").select("plus_coins, is_premium, premium_orders_left").eq("id", user.id).single().then(({ data }) => {
        if (data) {
          setPlusCoins(data.plus_coins || 0);
          setIsPremium(data.is_premium || false);
          setPremiumOrdersLeft(data.premium_orders_left || 0);
        }
      });
    }
  }, [user, open]);

  useEffect(() => {
    if (!open) {
      setCryptoOrderPlaced(false);
      setSelectedMethod("paypal");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    supabase.from("payment_methods").select("*").eq("is_active", true).not("ticker", "is", null).then(({ data }) => {
      if (data) setCryptoMethods(data);
    });
    getCryptoRates().then(setCryptoRates).catch(() => {});
  }, [open]);

  const selectedCrypto = selectedMethod !== "paypal" ? cryptoMethods.find((m) => m.id === selectedMethod) : undefined;
  const cryptoRate = selectedCrypto?.ticker ? cryptoRates[selectedCrypto.ticker] : undefined;

  const hasPremiumDiscount = isPremium && premiumOrdersLeft > 0;
  
  // Calcul du total avec réduction Premium (sauf sur la catégorie Discord)
  const calculatePremiumTotal = () => {
    if (!hasPremiumDiscount) return total;
    return items.reduce((acc, item) => {
      const isDiscord = item.category?.toLowerCase().includes("discord") || item.name.toLowerCase().includes("discord");
      const itemTotal = item.price * item.quantity;
      return acc + (isDiscord ? itemTotal : itemTotal * 0.7);
    }, 0);
  };

  const totalAfterPremium = calculatePremiumTotal();
  const baseDiscounted = totalAfterPremium * (1 - discount);
  const finalTotal = useCoins ? baseDiscounted * 0.5 : baseDiscounted;
  
  const coinsEarned = Math.floor(finalTotal * 100);

  const cryptoAmount = cryptoRate ? finalTotal / cryptoRate : undefined;

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

    const isCrypto = Boolean(selectedCrypto && cryptoAmount);
    const paymentRef = isCrypto ? `crypto:${selectedCrypto!.ticker}:${cryptoAmount!.toFixed(CRYPTO_DECIMALS[selectedCrypto!.ticker!] ?? 6)}` : "paypal:steamapp";
    const paymentMethodLabel = isCrypto
      ? `${selectedCrypto!.name} — ${cryptoAmount!.toFixed(CRYPTO_DECIMALS[selectedCrypto!.ticker!] ?? 6)} ${selectedCrypto!.ticker}`
      : "PayPal";

    setLoading(true);
    try {
      const { data: order, error } = await supabase
        .from("orders")
        .insert({ user_id: user.id, total: finalTotal, status: "pending", payment_ref: paymentRef })
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

      // Envoi de l'email + notif Discord. On attend qu'ils soient partis (sans
      // bloquer si l'un échoue) car window.location.href juste après annule
      // toute requête encore en vol au moment de la navigation.
      if (user.email) {
        await Promise.allSettled([
          sendOrderEmail({ data: { email: user.email, items, total: finalTotal } }),
          notifyDiscordOrder({ data: { email: user.email, items, total: finalTotal, paymentMethod: paymentMethodLabel } }),
        ]);
      }

      if (promoApplied) {
        await supabase.rpc('increment_promo_use', { promo_code: promoApplied }).catch(() => {});
      }

      // On déduit seulement si on utilise les coins ou le premium.
      // Le gain de coins se fera uniquement quand l'admin validera la commande !
      const updatePayload: any = {};
      if (useCoins) updatePayload.plus_coins = plusCoins - 1000;
      if (hasPremiumDiscount) updatePayload.premium_orders_left = premiumOrdersLeft - 1;

      if (Object.keys(updatePayload).length > 0) {
        await supabase.from("profiles").update(updatePayload).eq("id", user.id);
      }

      if (isCrypto) {
        // Pas de redirection externe possible pour la crypto : le client a déjà
        // l'adresse + le montant affichés dans le panier, on le garde sur cet
        // écran avec les prochaines étapes plutôt que de fermer le panier.
        clear();
        setCryptoOrderPlaced(true);
        toast.success("Commande enregistrée ! Envoie le paiement puis ouvre un ticket avec ta preuve.", { duration: 6000 });
      } else {
        clear();
        setOpen(false);
        toast.success(`Commande enregistrée ! Redirection vers PayPal...`, { duration: 5000 });
        // Redirection directe sur la même page (100% fiable, aucun bloqueur de popups)
        window.location.href = `${PAYPAL_URL}/${finalTotal.toFixed(2)}EUR`;
      }

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
          <h3 className="font-display font-bold text-lg flex items-center gap-2">
            Panier <span className="bg-white/10 px-2 py-0.5 rounded-full text-sm">{items.length}</span>
          </h3>
          <button onClick={() => setOpen(false)} className="p-2 rounded hover:bg-white/10 transition-colors"><X size={18} /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cryptoOrderPlaced ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-2">
              <div className="text-4xl">✅</div>
              <p className="font-bold text-lg">Commande enregistrée !</p>
              <p className="text-sm text-white/60">
                Envoie le montant exact à l'adresse indiquée juste avant, puis ouvre un ticket Discord avec une preuve de la transaction (capture d'écran ou lien de l'explorateur blockchain). Le staff valide manuellement, comme pour PayPal.
              </p>
              <a
                href="https://discord.gg/UUBFjjCp"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold bg-white/10 hover:bg-white/20 border border-white/10 transition"
              >
                🎫 Ouvrir un ticket Discord
              </a>
              <button onClick={() => setCryptoOrderPlaced(false)} className="text-xs text-white/40 hover:text-white/60 underline">
                Passer une nouvelle commande
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-50 space-y-4">
              <div className="text-4xl">🛒</div>
              <p className="font-medium text-lg">Ton panier est vide</p>
            </div>
          ) : null}
          {items.map((i) => (
            <div key={i.id} className="flex gap-3 p-3 rounded-xl glass relative overflow-hidden" style={{ borderLeft: `3px solid ${i.color}` }}>
              <div className="absolute top-0 right-0 w-16 h-16 blur-2xl opacity-20" style={{ background: i.color }}></div>
              <div className="w-12 h-12 rounded-lg grid place-items-center text-xl relative z-10 bg-black/40 border border-white/5 shadow-inner">
                {i.emoji}
              </div>
              <div className="flex-1 min-w-0 relative z-10">
                <div className="font-bold text-sm truncate">{i.name}</div>
                {i.subtitle && <div className="text-xs text-white/50">{i.subtitle}</div>}
                <div className="text-sm font-black mt-1" style={{ color: i.color }}>{(i.price * i.quantity).toFixed(2)}€</div>
              </div>
              <div className="flex flex-col items-end gap-2 relative z-10">
                <button onClick={() => remove(i.id)} className="text-white/40 hover:text-gray-500 transition-colors"><Trash2 size={14} /></button>
                <div className="flex items-center gap-1 bg-black/50 border border-white/10 rounded-md">
                  <button onClick={() => setQty(i.id, i.quantity - 1)} className="p-1.5 hover:bg-white/10 transition-colors rounded-l-md"><Minus size={10} /></button>
                  <span className="text-xs w-4 text-center font-bold">{i.quantity}</span>
                  <button onClick={() => setQty(i.id, i.quantity + 1)} className="p-1.5 hover:bg-white/10 transition-colors rounded-r-md"><Plus size={10} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!cryptoOrderPlaced && (
        <div className="p-5 border-t border-white/10 space-y-4 bg-black/40">
          {items.length > 0 && (
            <>
              {/* Premium Status Banner */}
              {hasPremiumDiscount && (
                <div className="bg-gradient-to-r from-gray-600/20 to-gray-600/20 border border-gray-500/30 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400 font-bold text-sm">
                    <Crown size={16} /> Premium (-30%)
                  </div>
                  <div className="text-xs font-bold text-gray-400/80 bg-gray-500/20 px-2 py-1 rounded-md">
                    {premiumOrdersLeft} restantes
                  </div>
                </div>
              )}

              {/* Coins System */}
              {user && (
                <div className="bg-gradient-to-r from-gray-500/10 to-gray-500/10 border border-gray-500/20 rounded-xl p-3 flex flex-col gap-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gray-500/20 blur-[50px] rounded-full"></div>
                  <div className="flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
                      <Coins size={16} />
                      Vos + Coins : {plusCoins}
                    </div>
                    <div className="text-xs font-bold text-gray-500/90">
                      Gagnez +{coinsEarned} Coins
                    </div>
                  </div>
                  {plusCoins >= 1000 && (
                    <button
                      onClick={() => setUseCoins(!useCoins)}
                      className={`relative z-10 text-xs font-bold py-2 px-3 rounded-lg transition-all border shadow-lg ${useCoins ? 'bg-gray-500 text-black border-gray-500 shadow-gray-500/50' : 'bg-black/50 text-gray-500 border-gray-500/50 hover:bg-gray-500/20'}`}
                    >
                      {useCoins ? "🔥 1000 Coins utilisés (-50%)" : "Utiliser 1000 Coins pour -50%"}
                    </button>
                  )}
                  {plusCoins < 1000 && (
                    <div className="relative z-10 text-xs font-medium text-white/50 bg-black/30 p-2 rounded-lg text-center">
                      Encore <strong className="text-gray-500">{1000 - plusCoins} Coins</strong> pour débloquer -50% !
                    </div>
                  )}
                </div>
              )}

              {/* Promo Code */}
              <div className="mb-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Code promotionnel"
                    value={promoInput}
                    onChange={e => setPromoInput(e.target.value)}
                    className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 text-sm font-medium focus:border-gray-500 outline-none uppercase placeholder:normal-case transition-colors"
                    disabled={!!promoApplied}
                  />
                  {!promoApplied ? (
                    <button onClick={applyPromo} disabled={loading || !promoInput.trim()} className="px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                      Appliquer
                    </button>
                  ) : (
                    <button onClick={() => { setDiscount(0); setPromoApplied(""); setPromoInput(""); }} className="px-4 py-2.5 bg-gray-500/20 text-gray-400 hover:bg-gray-500/40 rounded-xl text-sm font-bold transition-all">
                      Retirer
                    </button>
                  )}
                </div>
                {promoError && <div className="text-gray-400 text-xs mt-2 font-medium flex items-center gap-1"><AlertTriangle size={12}/> {promoError}</div>}
                {promoApplied && <div className="text-gray-400 text-xs mt-2 font-medium flex items-center gap-1">✓ Code {promoApplied} actif (-{(discount * 100).toFixed(0)}%)</div>}
              </div>
            </>
          )}

          <div className="flex items-center justify-between text-lg font-black bg-white/5 p-4 rounded-xl border border-white/10">
            <span>Total</span>
            <div className="text-right flex flex-col items-end">
              {(discount > 0 || useCoins || hasPremiumDiscount) && (
                <div className="text-xs text-white/40 font-bold line-through decoration-gray-500 mb-0.5">{total.toFixed(2)}€</div>
              )}
              <span className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-400">{finalTotal.toFixed(2)}€</span>
            </div>
          </div>

          {items.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Moyen de paiement</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedMethod("paypal")}
                  className={`px-3 py-2 rounded-lg text-xs font-bold border transition ${selectedMethod === "paypal" ? "bg-white text-black border-white" : "bg-black/40 text-white/60 border-white/10 hover:border-white/30"}`}
                >
                  PayPal
                </button>
                {cryptoMethods.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMethod(m.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition ${selectedMethod === m.id ? "bg-white text-black border-white" : "bg-black/40 text-white/60 border-white/10 hover:border-white/30"}`}
                  >
                    {m.icon && <img src={`https://cdn.simpleicons.org/${m.icon}/${selectedMethod === m.id ? "000000" : "ffffff"}`} alt="" className="w-3.5 h-3.5" />}
                    {m.ticker || m.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedCrypto && (
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Montant à envoyer</span>
                <span className="font-black text-lg">
                  {cryptoAmount ? `${cryptoAmount.toFixed(CRYPTO_DECIMALS[selectedCrypto.ticker!] ?? 6)} ${selectedCrypto.ticker}` : "Cours indisponible..."}
                </span>
              </div>
              {selectedCrypto.details && (
                <>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-[11px] bg-black/50 border border-white/10 rounded-lg px-3 py-2 break-all">{selectedCrypto.details}</code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedCrypto.details!);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="p-2.5 bg-white/10 hover:bg-white/20 rounded-lg transition shrink-0"
                      title="Copier l'adresse"
                    >
                      {copied ? <Check size={14} className="text-gray-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&bgcolor=ffffff&color=000000&data=${encodeURIComponent(selectedCrypto.details)}`}
                    alt="QR code adresse"
                    className="mx-auto rounded-lg"
                    width={140}
                    height={140}
                  />
                </>
              )}
              <p className="text-[11px] text-white/40 text-center">
                Envoie exactement ce montant à cette adresse, puis ouvre un ticket Discord avec ta preuve (capture ou lien de transaction) pour validation.
              </p>
            </div>
          )}

          {items.length > 0 && !selectedCrypto && (
            <div className="p-3 bg-gray-500/10 border border-gray-500/30 rounded-xl flex items-start gap-2 text-gray-500 animate-pulse">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <p className="text-xs font-bold leading-tight">
                ⚠️ ATTENTION : Le paiement Paypal doit OBLIGATOIREMENT être effectué en <span className="underline">"Amis et Famille" (Entre Proches)</span>. Sinon la commande ne sera ni validée, ni remboursée !
              </p>
            </div>
          )}

          <button
            onClick={checkout}
            disabled={loading || items.length === 0 || (Boolean(selectedCrypto) && !cryptoAmount)}
            className={`w-full py-4 rounded-xl text-white font-black text-lg disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition-all ${
              selectedCrypto
                ? "bg-gradient-to-r from-gray-700 to-gray-500 shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]"
                : "bg-gradient-to-r from-[#003087] to-[#0070ba] shadow-[0_0_30px_-5px_rgba(0,112,186,0.6)]"
            }`}
          >
            {loading ? "Chargement..." : selectedCrypto ? `Valider ma commande (${selectedCrypto.ticker})` : "Payer via PayPal"}
          </button>
          <a
            href="https://discord.gg/UUBFjjCp"
            target="_blank"
            rel="noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition hover:bg-white/5 border border-white/10"
          >
            🎫 Ticket Discord Support
          </a>
        </div>
        )}
      </aside>
    </div>
  );
}