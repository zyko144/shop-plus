import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Header } from "@/components/Header";
import { Package, DollarSign, Clock, CheckCircle, XCircle, Trash2, Layers, Save, Settings, ShoppingCart, BarChart3, Plus, Edit, LogOut } from "lucide-react";
import { getAllProducts, Product } from "@/lib/products";
import { AdminProductEditor } from "@/components/AdminProductEditor";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Dashboard Admin — SHOP+" }] }),
  component: AdminDashboardErrorBoundary,
});

import React from "react";
class LocalErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: any) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white p-10 font-mono">
          <h1 className="text-red-500 text-2xl font-bold mb-4">Erreur Interne du Dashboard</h1>
          <p className="mb-4">Une erreur s'est produite lors du rendu du panel admin. Prenez une capture d'écran de ceci :</p>
          <pre className="bg-red-900/30 p-4 rounded overflow-auto border border-red-500/50">{this.state.error?.message}</pre>
          <pre className="bg-white/5 p-4 rounded overflow-auto border border-white/10 mt-4 text-xs text-white/50">{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function AdminDashboardErrorBoundary() {
  return <LocalErrorBoundary><AdminDashboard /></LocalErrorBoundary>;
}

type AdminOrderRow = {
  id: string;
  user_id: string;
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a238ff', '#f47521'];

function AdminDashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "stocks" | "products" | "settings">("overview");
  const [orders, setOrders] = useState<AdminOrderRow[]>([]);
  const [stocks, setStocks] = useState<Record<string, StockData>>({});
  const [storeSettings, setStoreSettings] = useState<Record<string, string>>({});
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [newPromo, setNewPromo] = useState({ code: "", discount: 10, max_uses: 100 });
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  const loadData = async () => {
    setLoading(true);
    
    // Charger Paramètres et Promos
    const { data: storeData } = await supabase.from("store_settings").select("*");
    if (storeData) {
      const map: Record<string, string> = {};
      storeData.forEach(s => map[s.key] = s.value);
      setStoreSettings(map);
    }
    const { data: promoData } = await supabase.from("promo_codes").select("*").order("created_at", { ascending: false });
    if (promoData) setPromos(promoData);

    // Charger Stocks
    const { data: stocksData } = await supabase.from("product_stock").select("*");
    if (stocksData) {
      const map: Record<string, StockData> = {};
      stocksData.forEach(s => map[s.product_id] = { product_id: s.product_id, is_unlimited: s.is_unlimited, stock: s.stock });
      setStocks(map);
    }

    // Charger Produits Admin (tous, même inactifs)
    const { data: productsData } = await supabase.from("products").select("*").order("category", { ascending: true });
    if (productsData) setAllProducts(productsData);
    
    // Charger Commandes avec jointure manuelle (pas de FK direct entre orders et profiles)
    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select("id,user_id,total,status,created_at,payment_ref,order_items(product_name,quantity,unit_price)")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!ordersError && ordersData) {
      const userIds = [...new Set(ordersData.map(o => o.user_id))];
      if (userIds.length > 0) {
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
        
        setOrders(mergedOrders as AdminOrderRow[]);
      } else {
        setOrders(ordersData as AdminOrderRow[]);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    if (profile && profile.role === "admin") {
      loadData();
    } else if (profile && profile.role !== "admin") {
      setLoading(false);
    }
  }, [profile]);

  // Data for charts (MUST BE BEFORE EARLY RETURNS)
  const salesByDay = useMemo(() => {
    const days: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days[d.toLocaleDateString('fr-FR', { weekday: 'short' })] = 0;
    }
    
    orders.forEach(o => {
      if (!o.created_at) return;
      const d = new Date(o.created_at).toLocaleDateString('fr-FR', { weekday: 'short' });
      if (days[d] !== undefined) {
        days[d] += Number(o.total || 0);
      }
    });
    
    return Object.entries(days).map(([name, total]) => ({ name, total }));
  }, [orders]);

  const topProducts = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach(o => {
      if (!o.order_items) return;
      o.order_items.forEach(item => {
        if (!map[item.product_name]) map[item.product_name] = 0;
        map[item.product_name] += item.quantity;
      });
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [orders]);

  // Security check: only admin can access
  if (!authLoading && (!user || profile?.role !== "admin")) {
    // @ts-ignore
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

    // Valider les récompenses si la commande est marquée comme "Livré"
    if (status === "completed") {
      const order = orders.find(o => o.id === id);
      if (order) {
        // Récupérer le profil actuel pour ajouter les coins
        const { data: profileData } = await supabase.from("profiles").select("plus_coins").eq("id", order.user_id).single();
        const currentCoins = profileData?.plus_coins || 0;
        const coinsEarned = Math.floor(Number(order.total) * 100);
        
        const updatePayload: any = { plus_coins: currentCoins + coinsEarned };

        const hasPremium = order.order_items && order.order_items.some(
          item => item.product_name.toLowerCase().includes("premium") || 
                  (item as any).category?.toLowerCase().includes("premium")
        );
        
        if (hasPremium) {
          updatePayload.is_premium = true;
          updatePayload.premium_orders_left = 10;
        }

        await supabase.from("profiles").update(updatePayload).eq("id", order.user_id);
        toast.success(`Commande livrée : le client a reçu ses ${coinsEarned} Coins ! ${hasPremium ? "(Premium activé 👑)" : ""}`);
      }
    }
  };

  const deleteOrder = async (id: string) => {
    if (!window.confirm("Supprimer cette commande définitivement ?")) return;
    setOrders(prev => prev.filter(o => o.id !== id));
    await supabase.from("orders").delete().eq("id", id);
  };

  const saveProduct = async (productData: Partial<Product>) => {
    try {
      const isNew = !allProducts.find(p => p.id === productData.id);
      if (isNew) {
        const { error } = await supabase.from("products").insert(productData);
        if (error) throw error;
        toast.success("Produit ajouté avec succès");
      } else {
        const { error } = await supabase.from("products").update(productData).eq("id", productData.id);
        if (error) throw error;
        toast.success("Produit mis à jour");
      }
      setEditingProduct(null);
      loadData(); // refresh products
    } catch (e: any) {
      toast.error("Erreur lors de la sauvegarde : " + e.message);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm("Supprimer ce produit définitivement ?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast.error("Erreur: " + error.message);
    } else {
      toast.success("Produit supprimé");
      setAllProducts(prev => prev.filter(p => p.id !== id));
    }
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
      loadData();
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

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
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
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <button 
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === "overview" ? "bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]" : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"}`}
          >
            <BarChart3 size={20} />
            Vue d'ensemble
          </button>
          <button 
            onClick={() => setActiveTab("products")}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === "products" ? "bg-orange-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.4)]" : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"}`}
          >
            <ShoppingCart size={20} />
            Produits
          </button>
          <button 
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === "orders" ? "bg-yellow-600 text-white shadow-[0_0_20px_rgba(202,138,4,0.4)]" : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"}`}
          >
            <Package size={20} />
            Commandes
          </button>
          <button 
            onClick={() => setActiveTab("stocks")}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === "stocks" ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]" : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"}`}
          >
            <Layers size={20} />
            Stocks
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === "settings" ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)]" : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"}`}
          >
            <Settings size={20} />
            Paramètres
          </button>
        </div>

        {/* Main Content Area */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass rounded-2xl p-6 border border-border/50">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <BarChart3 size={18} className="text-red-500" />
                  Ventes des 7 derniers jours
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesByDay}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}€`} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#000000dd', border: '1px solid #333', borderRadius: '8px' }}
                        itemStyle={{ color: '#ff0033' }}
                      />
                      <Line type="monotone" dataKey="total" stroke="#ff0033" strokeWidth={3} dot={{ fill: '#ff0033', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 border border-border/50">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Package size={18} className="text-orange-500" />
                  Top 5 Produits Vendus
                </h3>
                <div className="h-[300px] w-full flex items-center justify-center">
                  {topProducts.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={topProducts}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {topProducts.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          contentStyle={{ backgroundColor: '#000000dd', border: '1px solid #333', borderRadius: '8px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-muted-foreground text-sm">Pas assez de données pour le moment.</p>
                  )}
                </div>
                {topProducts.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-3 mt-2">
                    {topProducts.map((entry, index) => (
                      <div key={entry.name} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        {entry.name} ({entry.value})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
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
        )}

        {activeTab === "products" && (
          <div className="glass rounded-2xl p-8 border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2"><Layers size={20} className="text-primary" /> Catalogue Produits</h2>
              <button 
                onClick={() => setEditingProduct({})}
                className="px-4 py-2 bg-primary rounded-lg text-primary-foreground text-sm font-bold flex items-center gap-2"
              >
                <Plus size={16} /> Ajouter un produit
              </button>
            </div>
            
            <div className="space-y-8">
              {Object.entries(
                allProducts.reduce((acc, p) => {
                  acc[p.category] = acc[p.category] || [];
                  acc[p.category].push(p);
                  return acc;
                }, {} as Record<string, Product[]>)
              ).map(([category, products]) => (
                <div key={category}>
                  <h3 className="text-lg font-bold text-white/70 mb-4 pb-2 border-b border-white/10 uppercase tracking-widest">
                    {category} <span className="text-sm font-normal text-white/40 ml-2">({products.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {products.map(p => (
                      <div key={p.id} className="p-4 rounded-xl border bg-black/40 border-white/10 hover:border-orange-500/50 transition-colors group relative overflow-hidden">
                        {/* Color strip */}
                        <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: p.color || '#fff' }}></div>
                        
                        <div className="flex justify-between items-start mb-3 pl-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-lg">
                              {p.emoji || (p.logo && !p.logo.includes('.') ? <i className={`si si-${p.logo}`}></i> : '📦')}
                            </div>
                            <div>
                              <div className="font-bold text-sm truncate w-32" title={p.name}>{p.name}</div>
                              <div className="text-xs text-muted-foreground">{p.category}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-end justify-between mt-4 pl-3">
                          <div className="font-black text-lg text-primary">{p.price}€</div>
                          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => setEditingProduct(p)}
                              className="p-1.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 rounded-md transition" title="Modifier"
                            >
                              <Edit size={14} />
                            </button>
                            <button 
                              onClick={() => deleteProduct(p.id)}
                              className="p-1.5 bg-red-500/20 text-red-500 hover:bg-red-500/40 rounded-md transition" title="Supprimer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        {!p.is_active && (
                          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-500">Inactif</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal d'édition */}
        {editingProduct && (
          <AdminProductEditor
            initialProduct={editingProduct}
            onSave={saveProduct}
            onCancel={() => setEditingProduct(null)}
          />
        )}

        {activeTab === "stocks" && (
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
                  {Object.entries(
                    allProducts.reduce((acc, p) => {
                      acc[p.category] = acc[p.category] || [];
                      acc[p.category].push(p);
                      return acc;
                    }, {} as Record<string, Product[]>)
                  ).flatMap(([category, products]) => [
                    <tr key={`cat-${category}`} className="bg-black/60 border-t border-b border-border/50">
                      <td colSpan={6} className="p-3 text-sm font-bold text-primary uppercase tracking-widest pl-4">
                        {category} <span className="text-muted-foreground ml-2">({products.length})</span>
                      </td>
                    </tr>,
                    ...products.map((p) => {
                      const stockInfo = stocks[p.id] || { is_unlimited: true, stock: 0 };
                      return (
                        <tr key={p.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-sm" style={{ backgroundColor: p.color }}>
                                {p.emoji || (p.logo && !p.logo.includes('.') ? <i className={`si si-${p.logo}`}></i> : '📦')}
                              </div>
                              <div>
                                <div className="font-bold text-white/90">{p.name}</div>
                                {p.subtitle && <div className="text-xs text-muted-foreground">{p.subtitle}</div>}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-muted-foreground text-sm">{p.category}</td>
                          <td className="p-4 font-medium text-white/80">{Number(p.price).toFixed(2)}€</td>
                          
                          <td className="p-4 text-center">
                            <select 
                              className="bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm font-medium focus:border-blue-500 outline-none"
                              value={stockInfo.is_unlimited ? "unlimited" : "limited"}
                              onChange={(e) => {
                                const isUnlim = e.target.value === "unlimited";
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
                    })
                  ])}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
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
        )}
      </div>
    </div>
  );
}
