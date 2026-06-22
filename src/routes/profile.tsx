import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { X, Coins, Package, Settings, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/CartDrawer";
import { PAYPAL_URL } from "@/lib/products";
import { OrderReview } from "@/components/OrderReview";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Mon Compte — ZYKO Store" }] }),
  component: ProfilePage,
});

type OrderRow = { id: string; total: number; status: string; created_at: string; order_items: { product_name: string; quantity: number; unit_price: number; category: string }[] };

function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [plusCoins, setPlusCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"coins" | "orders" | "settings">("coins");

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/auth" });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    
    // Charger les coins
    supabase.from("profiles").select("plus_coins").eq("id", user.id).single().then(({ data }) => {
        if (data) setPlusCoins(data.plus_coins || 0);
    });

    // Charger les commandes
    supabase.from("orders").select("id,total,status,created_at,order_items(product_name,quantity,unit_price,category)").order("created_at", { ascending: false }).then(({ data }) => {
      setOrders((data as any) ?? []);
      setLoading(false);
    });
  }, [user]);

  const deleteOrder = async (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
    await supabase.from("orders").delete().eq("id", id);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  const progressPercent = Math.min((plusCoins / 1000) * 100, 100);

  if (!user) return null;

  return (
    <div className="min-h-screen pb-20">
      <Header />
      <CartDrawer />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-red-600 to-orange-500 p-1">
            <div className="w-full h-full bg-black rounded-full grid place-items-center text-4xl font-black">
              {user.email?.[0].toUpperCase()}
            </div>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black">Espace Client</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {/* Onglets */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          <button 
            onClick={() => setActiveTab("coins")}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap ${activeTab === "coins" ? "bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.3)]" : "bg-white/5 text-white/60 hover:bg-white/10"}`}
          >
            <Coins size={18} /> Ma Tirelire
          </button>
          <button 
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap ${activeTab === "orders" ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]" : "bg-white/5 text-white/60 hover:bg-white/10"}`}
          >
            <Package size={18} /> Mes Abonnements
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap ${activeTab === "settings" ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]" : "bg-white/5 text-white/60 hover:bg-white/10"}`}
          >
            <Settings size={18} /> Paramètres
          </button>
        </div>

        {/* Contenu des onglets */}
        <div className="space-y-6">
          
          {/* TIRELIRE */}
          {activeTab === "coins" && (
            <div className="glass rounded-3xl p-8 border border-yellow-500/30 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4">
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 blur-[100px] rounded-full"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-yellow-500">
                    <Coins size={24} /> Solde de + Coins
                  </h2>
                  <p className="text-white/60 max-w-sm mb-6">
                    Gagnez 100 + Coins pour chaque euro dépensé. Atteignez 1000 + Coins pour débloquer -50% de réduction sur une commande complète !
                  </p>
                  
                  <div className="w-full bg-black/50 h-4 rounded-full overflow-hidden border border-white/10 relative">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-1000 relative"
                      style={{ width: `${progressPercent}%` }}
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" style={{ backgroundSize: "200% 100%" }}></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-white/40 mt-2">
                    <span>0</span>
                    <span>1000 (-50%)</span>
                  </div>
                </div>
                
                <div className="shrink-0 w-48 h-48 rounded-full border-8 border-yellow-500/20 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(234,179,8,0.2)]">
                  <span className="text-5xl font-black text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                    {plusCoins}
                  </span>
                  <span className="text-sm font-bold text-yellow-500/70 uppercase tracking-widest mt-1">Coins</span>
                </div>
              </div>
            </div>
          )}

          {/* COMMANDES */}
          {activeTab === "orders" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              {loading && <p className="text-muted-foreground text-center py-10">Chargement de vos abonnements...</p>}
              {!loading && orders.length === 0 && (
                <div className="glass rounded-3xl p-10 text-center border border-white/5">
                  <Package size={48} className="mx-auto text-white/20 mb-4" />
                  <p className="text-white/60 mb-6 text-lg">Vous n'avez pas encore d'abonnement actif.</p>
                  <Link to="/" className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-black font-bold hover:scale-105 transition-transform">Voir la boutique</Link>
                </div>
              )}
              {orders.map((o) => (
                <div key={o.id} className="glass rounded-3xl p-6 border border-white/5 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div>
                        <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1">Commande #{o.id.slice(0, 8)}</div>
                        <div className="text-sm text-white/80">{new Date(o.created_at).toLocaleString("fr-FR")}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${o.status === "pending" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" : "bg-green-500/20 text-green-400 border border-green-500/30"}`}>
                          {o.status === "pending" ? "En attente de paiement" : o.status}
                        </span>
                        <span className="font-black text-xl text-white">{Number(o.total).toFixed(2)}€</span>
                        {o.status === "pending" && (
                          <button 
                            onClick={() => deleteOrder(o.id)} 
                            className="p-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/30 transition-colors"
                            title="Annuler la commande"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                    <ul className="space-y-1 text-sm bg-black/40 p-4 rounded-2xl mb-4 border border-white/5">
                      {o.order_items.map((it, i) => (
                        <li key={i} className="flex justify-between border-b border-white/5 last:border-0 pb-2 last:pb-0 pt-2 first:pt-0">
                          <span className="font-medium text-white/90">{it.quantity}× {it.product_name} <span className="text-white/40 text-xs ml-1">({it.category})</span></span>
                          <span className="font-bold text-white/70">{(it.quantity * Number(it.unit_price)).toFixed(2)}€</span>
                        </li>
                      ))}
                    </ul>
                    {o.status === "pending" && (
                    <a href={`${PAYPAL_URL}/${Number(o.total).toFixed(2)}EUR`} target="_blank" className="inline-block w-full text-center py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-black font-bold shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:scale-[1.02] transition-transform">
                        Payer maintenant (PayPal)
                      </a>
                    )}
                    {o.status !== "pending" && (
                      <OrderReview orderId={o.id} createdAt={o.created_at} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PARAMETRES */}
          {activeTab === "settings" && (
            <div className="glass rounded-3xl p-8 border border-white/5 space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Settings size={20}/> Informations du compte</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Adresse Email</label>
                    <div className="px-5 py-4 bg-black/50 border border-white/10 rounded-2xl font-medium text-white/90">{user.email}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">ID Secret (Support)</label>
                    <div className="px-5 py-4 bg-black/50 border border-white/10 rounded-2xl text-sm font-mono text-white/40">{user.id}</div>
                  </div>
                </div>
              </div>
              
              <div className="pt-8 border-t border-white/10">
                <button 
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 font-bold transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                >
                  <LogOut size={20} /> Se déconnecter de tous les appareils
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
