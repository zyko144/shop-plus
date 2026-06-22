import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Header } from "@/components/Header";
import { Package, DollarSign, Clock, CheckCircle, XCircle, Trash2, Layers, Save, Settings } from "lucide-react";
import { getAllProducts } from "@/lib/products";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Dashboard Admin — SHOP+" }] }),
  component: AdminDashboard,
});

type AdminOrderRow = {
  id: string;
  total: number;
  status: string;
  created_at: string;
  payment_ref: string;
  profiles: { email: string; username: string } | null;
  order_items: { product_name: string; quantity: number; unit_price: number }[];
};

type PromoCode = {
  code: string;
  discount_percentage: number;
  max_uses: number;
  current_uses: number;
  is_active: boolean;
};

type StockData = {
  product_id: string;
  stock: number;
  is_unlimited: boolean;
};

function AdminDashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"orders" | "stocks" | "settings">("orders");
  const [orders, setOrders] = useState<AdminOrderRow[]>([]);
  const [stocks, setStocks] = useState<Record<string, StockData>>({});
  const [storeSettings, setStoreSettings] = useState<Record<string, string>>({});
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [newPromo, setNewPromo] = useState({ code: "", discount: 10, max_uses: 100 });
  const [loading, setLoading] = useState(true);
  
  const allProducts = getAllProducts();

  // Security check: only admin can access
  const loadOrders = async () => {
    setLoading(true);
    // Fetch all orders with user emails
    // Since there is no direct FK between orders and profiles, we fetch auth.users indirectly or fetch profiles manually.
    // Actually, orders.user_id references auth.users(id), and profiles.id references auth.users(id). 
    // To fix the join error, we fetch orders, then fetch profiles for those orders.
    const { data: ordersData, error } = await supabase
      .from("orders")
      .select("id,user_id,total,status,created_at,payment_ref,order_items(product_name,quantity,unit_price)")
      .order("created_at", { ascending: false });

    if (!error && ordersData) {
      // Fetch profiles manually to join them
      const userIds = [...new Set(ordersData.map(o => o.user_id))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id,email,username")
        .in("id", userIds);
        
      const profilesMap = (profilesData || []).reduce((acc: any, p) => {
        acc[p.id] = p;
        return acc;
      }, {});

      const mergedOrders = ordersData.map(o => ({
        ...o,
        profiles: profilesMap[o.user_id] || null
      }));
      
      setOrders(mergedOrders as any);
    }
    setLoading(false);
  };

  const loadStocks = async () => {
    const { data } = await supabase.from("product_stock").select("*");
    if (data) {
      const map: Record<string, StockData> = {};
      data.forEach(s => map[s.product_id] = s);
      setStocks(map);
    }
  };

  const loadSettings = async () => {
    const { data } = await supabase.from("store_settings").select("*");
    if (data) {
      const map: Record<string, string> = {};
      data.forEach(s => map[s.key] = s.value);
      setStoreSettings(map);
    }
    const { data: promoData } = await supabase.from("promo_codes").select("*").order("created_at", { ascending: false });
    if (promoData) setPromos(promoData);
  };

  useEffect(() => {
    if (profile?.role === "admin") {
      loadOrders();
      loadStocks();
      loadSettings();
    }
  }, [profile]);

  // Security check: only admin can access
  // Placed AFTER all hooks to respect React Rules of Hooks!
  if (!authLoading && (!user || profile?.role !== "admin")) {
    // @ts-ignore - profileError might not be in types if I didn't update them, but we exported it
    const err = (useAuth() as any).profileError;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Accès Refusé</h1>
        <p className="text-muted-foreground mb-2">Vous n'avez pas les droits d'administrateur.</p>
        <div className="p-4 bg-black/50 rounded-lg text-sm font-mono mt-4 text-left">
          <p>Connecté en tant que : {user ? user.email : "Non connecté"}</p>
          <p>Rôle détecté dans la base : {profile?.role ? `"${profile.role}"` : "Aucun profil/rôle trouvé"}</p>
          {err && <p className="text-red-400 mt-2">Erreur Supabase Profile : {err}</p>}
        </div>
        <button onClick={() => window.location.reload()} className="mt-6 px-4 py-2 bg-primary rounded-lg text-primary-foreground">
          Rafraîchir la page
        </button>
      </div>
    );
  }

  const updateStatus = async (id: string, status: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    await supabase.from("orders").update({ status }).eq("id", id);
  };

  const deleteOrder = async (id: string) => {
    if (!window.confirm("Supprimer cette commande définitivement ?")) return;
    setOrders(prev => prev.filter(o => o.id !== id));
    await supabase.from("orders").delete().eq("id", id);
  };

  const saveStock = async (productId: string, newStock: number, isUnlimited: boolean) => {
    const { error } = await supabase.from("product_stock").upsert({
      product_id: productId,
      stock: newStock,
      is_unlimited: isUnlimited
    }, { onConflict: "product_id" });
    
    if (!error) {
      setStocks(prev => ({ ...prev, [productId]: { product_id: productId, stock: newStock, is_unlimited: isUnlimited } }));
      toast.success("Stock mis à jour pour " + productId);
    } else {
      toast.error("Erreur: " + error.message);
    }
  };

  const saveSettings = async () => {
    const entries = Object.entries(storeSettings).map(([key, value]) => ({ key, value }));
    const { error } = await supabase.from("store_settings").upsert(entries);
    if (error) {
      toast.error("Erreur de sauvegarde: " + error.message);
    } else {
      toast.success("Paramètres enregistrés avec succès !");
    }
  };

  const createPromo = async () => {
    if (!newPromo.code.trim()) return;
    const { error } = await supabase.from("promo_codes").insert({
      code: newPromo.code.trim().toUpperCase(),
      discount_percentage: newPromo.discount,
      max_uses: newPromo.max_uses,
    });
    if (error) {
      toast.error("Erreur promo: " + error.message);
    } else {
      toast.success("Code promo créé !");
      setNewPromo({ code: "", discount: 10, max_uses: 100 });
      loadSettings();
    }
  };

  const deletePromo = async (code: string) => {
    await supabase.from("promo_codes").delete().eq("code", code);
    toast.success("Code promo supprimé");
    setPromos(prev => prev.filter(p => p.code !== code));
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
  const pendingCount = orders.filter(o => o.status === "pending").length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
            Panel Administrateur
          </h1>
          <div className="px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-sm">
            Mode Super Admin
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === "orders" ? "bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]" : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"}`}
          >
            <Package size={20} />
            Commandes
          </button>
          <button 
            onClick={() => setActiveTab("stocks")}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === "stocks" ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]" : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"}`}
          >
            <Layers size={20} />
            Gestion des Stocks
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === "settings" ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)]" : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"}`}
          >
            <Settings size={20} />
            Paramètres
          </button>
        </div>

        {activeTab === "orders" && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="glass rounded-2xl p-6 border-t-4 border-red-500 flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground font-medium mb-1">Chiffre d'affaires</p>
                  <h2 className="text-3xl font-black">{totalRevenue.toFixed(2)}€</h2>
                </div>
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                  <DollarSign size={24} />
                </div>
              </div>
              <div className="glass rounded-2xl p-6 border-t-4 border-orange-500 flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground font-medium mb-1">Commandes totales</p>
                  <h2 className="text-3xl font-black">{orders.length}</h2>
                </div>
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <Package size={24} />
                </div>
              </div>
              <div className="glass rounded-2xl p-6 border-t-4 border-yellow-500 flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground font-medium mb-1">En attente</p>
                  <h2 className="text-3xl font-black">{pendingCount}</h2>
                </div>
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                  <Clock size={24} />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Main Content Area */}
        {activeTab === "orders" ? (
          <div className="glass rounded-2xl overflow-hidden border border-border/50">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/40 text-muted-foreground text-sm uppercase tracking-wider">
                    <th className="p-4 font-semibold">Date & ID</th>
                    <th className="p-4 font-semibold">Client (E-mail)</th>
                    <th className="p-4 font-semibold">Produits</th>
                    <th className="p-4 font-semibold">Total</th>
                    <th className="p-4 font-semibold">Statut</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">Aucune commande trouvée.</td>
                    </tr>
                  ) : orders.map((o) => (
                    <tr key={o.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4">
                        <div className="font-medium">{o.created_at ? new Date(o.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Date inconnue'}</div>
                        <div className="text-xs text-muted-foreground mt-1">#{o.id ? o.id.slice(0, 8) : 'N/A'}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white/90">{o.profiles?.email || 'Email introuvable'}</div>
                        <div className="text-xs text-muted-foreground">{o.profiles?.username || 'Anonyme'}</div>
                      </td>
                      <td className="p-4">
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {o.order_items && Array.isArray(o.order_items) ? o.order_items.map((it, idx) => (
                            <li key={idx}><span className="text-white/70">{it.quantity}x</span> {it.product_name}</li>
                          )) : <li className="text-red-400">Erreur produits</li>}
                        </ul>
                      </td>
                      <td className="p-4 font-bold text-primary">
                        {Number(o.total || 0).toFixed(2)}€
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          o.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                          o.status === 'completed' ? 'bg-green-500/20 text-green-400' : 
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {o.status === 'pending' && 'En attente'}
                          {o.status === 'completed' && 'Livré'}
                          {o.status === 'cancelled' && 'Annulé'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {o.status === 'pending' && (
                            <button onClick={() => updateStatus(o.id, 'completed')} title="Marquer comme livré" className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/40 transition">
                              <CheckCircle size={16} />
                            </button>
                          )}
                          {o.status !== 'cancelled' && (
                            <button onClick={() => updateStatus(o.id, 'cancelled')} title="Annuler la commande" className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400 hover:bg-orange-500/40 transition">
                              <XCircle size={16} />
                            </button>
                          )}
                          <button onClick={() => deleteOrder(o.id)} title="Supprimer définitivement" className="p-1.5 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/40 transition">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="glass rounded-2xl overflow-hidden border border-border/50">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/40 text-muted-foreground text-sm uppercase tracking-wider">
                    <th className="p-4 font-semibold">Produit</th>
                    <th className="p-4 font-semibold">Catégorie</th>
                    <th className="p-4 font-semibold">Prix</th>
                    <th className="p-4 font-semibold text-center">Type de Stock</th>
                    <th className="p-4 font-semibold text-center">Quantité</th>
                    <th className="p-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {allProducts.map((p) => {
                    // Si on a pas de donnée, on assume illimité (par défaut jusqu'à maintenant)
                    const stockInfo = stocks[p.id] || { is_unlimited: true, stock: 0 };
                    return (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-sm" style={{ backgroundColor: p.color }}>
                              {p.emoji}
                            </div>
                            <div>
                              <div className="font-bold text-white/90">{p.name}</div>
                              {p.subtitle && <div className="text-xs text-muted-foreground">{p.subtitle}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground text-sm">{p.category}</td>
                        <td className="p-4 font-medium text-white/80">{p.price.toFixed(2)}€</td>
                        
                        <td className="p-4 text-center">
                          <select 
                            className="bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm font-medium focus:border-blue-500 outline-none"
                            value={stockInfo.is_unlimited ? "unlimited" : "limited"}
                            onChange={(e) => {
                              const isUnlim = e.target.value === "unlimited";
                              // Mise à jour immédiate locale, on cliquera sur Save pour envoyer
                              setStocks(prev => ({ ...prev, [p.id]: { product_id: p.id, is_unlimited: isUnlim, stock: stockInfo.stock }}));
                            }}
                          >
                            <option value="unlimited">Illimité ♾️</option>
                            <option value="limited">Limité (Chiffre)</option>
                          </select>
                        </td>
                        
                        <td className="p-4 text-center">
                          {!stockInfo.is_unlimited ? (
                            <input 
                              type="number" 
                              min="0"
                              className="w-20 bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-center focus:border-blue-500 outline-none"
                              value={stockInfo.stock}
                              onChange={(e) => {
                                setStocks(prev => ({ ...prev, [p.id]: { product_id: p.id, is_unlimited: false, stock: parseInt(e.target.value) || 0 }}));
                              }}
                            />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => saveStock(p.id, stockInfo.stock, stockInfo.is_unlimited)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-colors"
                          >
                            <Save size={14} />
                            Enregistrer
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === "settings" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Paramètres globaux */}
            <div className="glass rounded-2xl p-8 border border-border/50">
              <h2 className="text-2xl font-bold mb-6">Paramètres de la Boutique</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Lien du Serveur Discord (Bouton Support)
                  </label>
                  <input
                    type="text"
                    value={storeSettings.discord_link || ""}
                    onChange={e => setStoreSettings({ ...storeSettings, discord_link: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 focus:border-red-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Bandeau d'Annonce (laisser vide pour cacher)
                  </label>
                  <input
                    type="text"
                    value={storeSettings.banner_text || ""}
                    onChange={e => setStoreSettings({ ...storeSettings, banner_text: e.target.value })}
                    placeholder="EX: SOLDES EXCEPTIONNELLES : -20%..."
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 focus:border-red-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Mode Maintenance
                  </label>
                  <select
                    value={storeSettings.maintenance_mode || "false"}
                    onChange={e => setStoreSettings({ ...storeSettings, maintenance_mode: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 focus:border-red-500 outline-none transition-colors"
                  >
                    <option value="false">Désactivé (Boutique ouverte)</option>
                    <option value="true">Activé (Boutique fermée)</option>
                  </select>
                  {storeSettings.maintenance_mode === "true" && (
                    <p className="text-red-400 text-xs mt-2 font-medium">⚠️ Attention : le site sera complètement inaccessible pour les clients !</p>
                  )}
                </div>

                <button
                  onClick={saveSettings}
                  className="mt-8 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all flex items-center gap-2 w-full justify-center shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]"
                >
                  <Save size={18} />
                  Enregistrer les Paramètres
                </button>
              </div>
            </div>

            {/* Codes Promo */}
            <div className="glass rounded-2xl p-8 border border-border/50">
              <h2 className="text-2xl font-bold mb-6">Codes Promo</h2>
              
              {/* Formulaire Création Promo */}
              <div className="flex flex-wrap items-end gap-4 mb-8 bg-black/30 p-4 rounded-xl border border-white/5">
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Code Promo</label>
                  <input
                    type="text"
                    value={newPromo.code}
                    onChange={e => setNewPromo({ ...newPromo, code: e.target.value })}
                    placeholder="ex: SOLDES20"
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-red-500 outline-none uppercase"
                  />
                </div>
                <div className="w-24 shrink-0">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Réduc (%)</label>
                  <input
                    type="number"
                    min="1" max="100"
                    value={newPromo.discount}
                    onChange={e => setNewPromo({ ...newPromo, discount: parseInt(e.target.value) || 0 })}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-red-500 outline-none"
                  />
                </div>
                <div className="w-24 shrink-0">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Util. max</label>
                  <input
                    type="number"
                    min="1"
                    value={newPromo.max_uses}
                    onChange={e => setNewPromo({ ...newPromo, max_uses: parseInt(e.target.value) || 0 })}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-red-500 outline-none"
                  />
                </div>
                <button
                  onClick={createPromo}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold text-sm h-[38px] transition"
                >
                  Créer
                </button>
              </div>

              {/* Liste des codes */}
              <div className="space-y-3">
                {promos.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Aucun code promo actif.</p>
                ) : promos.map(promo => (
                  <div key={promo.code} className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/10">
                    <div>
                      <div className="font-bold text-lg text-primary">{promo.code} <span className="text-sm text-white/50 bg-white/10 px-2 py-0.5 rounded ml-2">-{promo.discount_percentage}%</span></div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Utilisations : {promo.current_uses} / {promo.max_uses}
                      </div>
                    </div>
                    <button
                      onClick={() => deletePromo(promo.code)}
                      className="p-2 bg-red-500/20 text-red-500 hover:bg-red-500/40 rounded-lg transition"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
