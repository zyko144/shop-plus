import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { getAllProducts, Product, CATEGORY_IMAGES, SITE_LOGO_URL, resolveProductLogoUrl } from "@/lib/products";
import { notifyDiscordAnnouncement, notifyDiscordStoreEvent } from "@/lib/discord";
import { AdminProductEditor } from "@/components/AdminProductEditor";
import { AdminSupport } from "@/components/AdminSupport";
import { AdminLayout, type AdminTab } from "@/components/admin/AdminLayout";
import { OverviewTab } from "@/components/admin/OverviewTab";
import { OrdersTab } from "@/components/admin/OrdersTab";
import { StocksTab } from "@/components/admin/StocksTab";
import { ProductsTab } from "@/components/admin/ProductsTab";
import { UsersTab } from "@/components/admin/UsersTab";
import { SettingsTab } from "@/components/admin/SettingsTab";
import type { AdminOrderRow, PromoCode, StockData, PaymentMethod } from "@/components/admin/types";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Dashboard Admin — Vercell" }] }),
  component: AdminDashboardErrorBoundary,
});

// Image la plus parlante possible pour une annonce Discord : le logo/visuel
// propre AU PRODUIT, dans sa vraie couleur de marque (meme resolution que la
// card du site) plutot que la photo generique de categorie, qui ne sert que
// de tout dernier recours si le produit n'a vraiment rien.
function resolveProductImage(product?: Partial<Product> | null): string | undefined {
  if (!product) return undefined;
  const specific = product.name && product.category && product.color
    ? resolveProductLogoUrl({ name: product.name, category: product.category, color: product.color, logo: product.logo })
    : undefined;
  if (specific) return specific.startsWith("/") ? `https://shop-plus-nu.vercel.app${specific}` : specific;
  return product.image || (product.category ? CATEGORY_IMAGES[product.category] : undefined) || SITE_LOGO_URL;
}

import React from "react";
class LocalErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: any) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white p-10 font-mono">
          <h1 className="text-gray-500 text-2xl font-bold mb-4">Erreur Interne du Dashboard</h1>
          <p className="mb-4">Une erreur s'est produite lors du rendu du panel admin. Prenez une capture d'écran de ceci :</p>
          <pre className="bg-gray-900/30 p-4 rounded overflow-auto border border-gray-500/50">{this.state.error?.message}</pre>
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

function AdminDashboard() {
  const { user, profile, loading: authLoading, profileError } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [usersList, setUsersList] = useState<any[]>([]);
  const [orders, setOrders] = useState<AdminOrderRow[]>([]);
  const [stocks, setStocks] = useState<Record<string, StockData>>({});
  const [originalStocks, setOriginalStocks] = useState<Record<string, StockData>>({});
  const [storeSettings, setStoreSettings] = useState<Record<string, string>>({});
  const [originalSettings, setOriginalSettings] = useState<Record<string, string>>({});
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [newPromo, setNewPromo] = useState({ code: "", discount: 10, max_uses: 100 });
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
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
      setOriginalSettings(map);
    }
    const { data: promoData } = await supabase.from("promo_codes").select("*").order("created_at", { ascending: false });
    if (promoData) setPromos(promoData);

    const { data: paymentMethodsData } = await supabase.from("payment_methods").select("*").order("created_at", { ascending: false });
    if (paymentMethodsData) setPaymentMethods(paymentMethodsData);

    // Charger Stocks
    const { data: stocksData } = await supabase.from("product_stock").select("*");
    if (stocksData) {
      const map: Record<string, StockData> = {};
      stocksData.forEach(s => map[s.product_id] = { product_id: s.product_id, is_unlimited: s.is_unlimited, stock: s.stock });
      setStocks(map);
      setOriginalStocks(map);
    }

    // Charger Produits Admin (tous, même inactifs)
    const { data: productsData } = await supabase.from("products").select("*").order("category", { ascending: true });
    if (productsData) setAllProducts(productsData);

    // Charger Utilisateurs
    const { data: profilesDataFetch } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (profilesDataFetch) setUsersList(profilesDataFetch);

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
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-500 mb-4">Accès Refusé</h1>
        <p className="text-muted-foreground mb-2">Vous n'avez pas les droits d'administrateur.</p>
        <div className="p-4 bg-black/50 rounded-lg text-sm font-mono mt-4 text-left">
          <p>Connecté en tant que : {user ? user.email : "Non connecté"}</p>
          <p>Rôle détecté dans la base : {profile?.role ? `"${profile.role}"` : "Aucun profil/rôle trouvé"}</p>
          {profileError && <p className="text-gray-400 mt-2">Erreur Supabase Profile : {profileError}</p>}
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
      const previous = allProducts.find(p => p.id === productData.id);
      const isNew = !previous;
      if (isNew) {
        const { error } = await supabase.from("products").insert(productData);
        if (error) throw error;
        toast.success("Produit ajouté avec succès");
        notifyDiscordAnnouncement({
          data: {
            type: "new_product",
            name: productData.name || "Nouveau produit",
            price: Number(productData.price) || 0,
            category: productData.category || "—",
            logo: productData.logo,
            imageUrl: resolveProductImage(productData),
          },
        }).catch((e) => console.error("Annonce Discord (nouveau produit) échouée:", e));
      } else {
        const { error } = await supabase.from("products").update(productData).eq("id", productData.id);
        if (error) throw error;
        toast.success("Produit mis à jour");
        if (typeof productData.price === "number" && productData.price !== previous.price) {
          notifyDiscordAnnouncement({
            data: {
              type: "price_change",
              name: productData.name || previous.name,
              oldPrice: previous.price,
              newPrice: productData.price,
              logo: productData.logo ?? previous.logo,
              imageUrl: resolveProductImage({ ...previous, ...productData }),
            },
          }).catch((e) => console.error("Annonce Discord (prix) échouée:", e));
        }
      }
      setEditingProduct(null);
      loadData(); // refresh products
    } catch (e: any) {
      toast.error("Erreur lors de la sauvegarde : " + e.message);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm("Supprimer ce produit définitivement ?")) return;
    const product = allProducts.find(p => p.id === id);
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast.error("Erreur: " + error.message);
    } else {
      toast.success("Produit supprimé");
      setAllProducts(prev => prev.filter(p => p.id !== id));
      if (product) {
        notifyDiscordAnnouncement({
          data: {
            type: "product_removed",
            name: product.name,
            category: product.category,
            price: product.price,
            logo: product.logo,
            imageUrl: resolveProductImage(product),
          },
        }).catch((e) => console.error("Annonce Discord (suppression) échouée:", e));
      }
    }
  };

  const grantPremium = async (userId: string) => {
    if (!window.confirm("Accorder le statut Premium (-30%) pour 10 commandes à cet utilisateur ?")) return;
    try {
      const { error } = await supabase.from("profiles").update({
        is_premium: true,
        premium_orders_left: 10
      }).eq("id", userId);
      if (error) throw error;

      setUsersList(prev => prev.map(u => u.id === userId ? { ...u, is_premium: true, premium_orders_left: 10 } : u));
      toast.success("Statut Premium accordé avec succès !");
    } catch (e: any) {
      toast.error("Erreur : " + e.message);
    }
  };

  const injectNewProducts = async () => {
    if (!window.confirm("Injecter les nouveaux produits (Robux, Valorant, Epic Games) ?")) return;
    const newProducts = [
      { id: 'robux-1000', name: 'Robux 1000-2500', category: 'Robux', price: 7.50, logo: 'roblox', color: '#ffffff', is_active: true },
      { id: 'robux-2500', name: 'Robux 2500-5000', category: 'Robux', price: 12.50, logo: 'roblox', color: '#ffffff', is_active: true },
      { id: 'robux-5000', name: 'Robux 5000-10.000', category: 'Robux', price: 20.00, logo: 'roblox', color: '#ffffff', is_active: true },
      { id: 'robux-10000', name: 'Robux 10.000-15.000', category: 'Robux', price: 31.25, logo: 'roblox', color: '#ffffff', is_active: true },
      { id: 'robux-50000', name: 'Robux 50.000+', category: 'Robux', price: 75.00, logo: 'roblox', color: '#ffffff', is_active: true },
      { id: 'val-1000', name: 'Valorant EU [1000-3000VP Inventory]', category: 'Valorant EU', price: 30.00, logo: 'valorant', color: '#ffffff', is_active: true },
      { id: 'val-3000', name: 'Valorant EU [3000-5000VP Inventory]', category: 'Valorant EU', price: 42.50, logo: 'valorant', color: '#ffffff', is_active: true },
      { id: 'val-5000', name: 'Valorant EU [5000-7000VP Inventory]', category: 'Valorant EU', price: 62.50, logo: 'valorant', color: '#ffffff', is_active: true },
      { id: 'val-7000', name: 'Valorant EU [7000-12.000VP Inventory]', category: 'Valorant EU', price: 87.50, logo: 'valorant', color: '#ffffff', is_active: true },
      { id: 'val-15000', name: 'Valorant EU [15.000-25.000VP Inventory]', category: 'Valorant EU', price: 105.00, logo: 'valorant', color: '#ffffff', is_active: true },
      { id: 'epic-50', name: 'Epic Games [50-100 Games] FA', category: 'Epic Games', price: 0.75, logo: 'epicgames', color: '#ffffff', is_active: true },
      { id: 'epic-100', name: 'Epic Games [100-200 Games] FA', category: 'Epic Games', price: 2.50, logo: 'epicgames', color: '#ffffff', is_active: true },
      { id: 'epic-200', name: 'Epic Games [200-350 Games] FA', category: 'Epic Games', price: 5.00, logo: 'epicgames', color: '#ffffff', is_active: true },
      { id: 'epic-350', name: 'Epic Games [350+ Games] FA', category: 'Epic Games', price: 12.50, logo: 'epicgames', color: '#ffffff', is_active: true }
    ];
    try {
      const { error } = await supabase.from('products').insert(newProducts);
      if (error) throw error;
      toast.success("Produits ajoutés avec succès !");
      loadData();
    } catch (e: any) {
      toast.error("Erreur d'injection: " + e.message);
    }
  };

  const deleteAllReviews = async () => {
    if (!window.confirm("SUPPRIMER TOUS LES AVIS ? Cette action est irréversible.")) return;
    try {
      const { error } = await supabase.from('reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) throw error;
      toast.success("Tous les avis ont été supprimés !");
    } catch (e: any) {
      toast.error("Erreur: " + e.message);
    }
  };

  const saveStock = async (productId: string, newStock: number, isUnlimited: boolean) => {
    // Compare contre l'instantane charge au demarrage (originalStocks), jamais contre
    // `stocks` qui est deja mute en direct par les onChange du formulaire avant meme
    // le clic sur Enregistrer -- sinon on compare toujours la nouvelle valeur a elle-meme.
    const previous = originalStocks[productId];
    const wasAvailable = previous ? previous.is_unlimited || previous.stock > 0 : true;
    const isAvailable = isUnlimited || newStock > 0;

    const { error } = await supabase.from("product_stock").upsert({
      product_id: productId,
      stock: newStock,
      is_unlimited: isUnlimited
    }, { onConflict: "product_id" });

    if (!error) {
      const updated = { product_id: productId, stock: newStock, is_unlimited: isUnlimited };
      setStocks(prev => ({ ...prev, [productId]: updated }));
      setOriginalStocks(prev => ({ ...prev, [productId]: updated }));
      toast.success("Stock mis à jour pour " + productId);
      if (wasAvailable !== isAvailable) {
        const product = allProducts.find(p => p.id === productId);
        notifyDiscordAnnouncement({
          data: {
            type: isAvailable ? "back_in_stock" : "out_of_stock",
            name: product?.name || productId,
            category: product?.category,
            price: product?.price,
            stock: isUnlimited ? "Illimité ♾️" : `${newStock} en stock`,
            logo: product?.logo,
            imageUrl: resolveProductImage(product),
          },
        }).catch((e) => console.error("Annonce Discord (stock) échouée:", e));
      }
    } else {
      toast.error("Erreur: " + error.message);
    }
  };

  const saveSettings = async () => {
    // Compare contre originalSettings (fige au chargement), jamais contre
    // storeSettings deja mute en direct par les champs du formulaire -- meme
    // piege que pour le stock : sinon on compare toujours la nouvelle valeur a elle-meme.
    const maintenanceChanged = originalSettings.maintenance_mode !== storeSettings.maintenance_mode;
    const enteringMaintenance = storeSettings.maintenance_mode === "true";

    const entries = Object.entries(storeSettings).map(([key, value]) => ({ key, value }));
    const { error } = await supabase.from("store_settings").upsert(entries);
    if (error) {
      toast.error("Erreur de sauvegarde: " + error.message);
    } else {
      toast.success("Paramètres enregistrés avec succès !");
      setOriginalSettings(storeSettings);
      if (maintenanceChanged) {
        notifyDiscordStoreEvent({ data: { type: enteringMaintenance ? "maintenance_on" : "maintenance_off" } })
          .catch((e) => console.error("Annonce Discord (maintenance) échouée:", e));
      }
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
      notifyDiscordStoreEvent({
        data: { type: "promo_created", code: newPromo.code.trim().toUpperCase(), discount: newPromo.discount, maxUses: newPromo.max_uses },
      }).catch((e) => console.error("Annonce Discord (promo) échouée:", e));
      setNewPromo({ code: "", discount: 10, max_uses: 100 });
      loadData();
    }
  };

  const createPaymentMethod = async (name: string, details: string, icon: string) => {
    const { error } = await supabase.from("payment_methods").insert({ name, details: details || null, icon: icon || null });
    if (error) {
      toast.error("Erreur moyen de paiement: " + error.message);
    } else {
      toast.success("Moyen de paiement ajouté !");
      notifyDiscordStoreEvent({ data: { type: "payment_method_added", name, details: details || undefined, icon: icon || undefined } })
        .catch((e) => console.error("Annonce Discord (paiement) échouée:", e));
      loadData();
    }
  };

  const deletePaymentMethod = async (id: string) => {
    const { error } = await supabase.from("payment_methods").delete().eq("id", id);
    if (error) {
      toast.error("Erreur: " + error.message);
    } else {
      toast.success("Moyen de paiement supprimé");
      setPaymentMethods(prev => prev.filter(m => m.id !== id));
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
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "support" && <AdminSupport />}
      {activeTab === "overview" && (
        <OverviewTab totalRevenue={totalRevenue} orderCount={orders.length} pendingCount={pendingCount} salesByDay={salesByDay} topProducts={topProducts} />
      )}
      {activeTab === "orders" && (
        <OrdersTab orders={orders} onUpdateStatus={updateStatus} onDelete={deleteOrder} />
      )}
      {activeTab === "products" && (
        <ProductsTab
          allProducts={allProducts}
          onAdd={() => setEditingProduct({})}
          onEdit={(p) => setEditingProduct(p)}
          onDelete={deleteProduct}
          onDeleteAllReviews={deleteAllReviews}
          onInjectNewProducts={injectNewProducts}
        />
      )}
      {editingProduct && (
        <AdminProductEditor
          initialProduct={editingProduct}
          onSave={saveProduct}
          onCancel={() => setEditingProduct(null)}
        />
      )}
      {activeTab === "stocks" && (
        <StocksTab
          allProducts={allProducts}
          stocks={stocks}
          onStockChange={(id, patch) => setStocks(prev => ({ ...prev, [id]: { product_id: id, is_unlimited: prev[id]?.is_unlimited ?? true, stock: prev[id]?.stock ?? 0, ...patch } }))}
          onSave={saveStock}
        />
      )}
      {activeTab === "users" && (
        <UsersTab usersList={usersList} onGrantPremium={grantPremium} />
      )}
      {activeTab === "settings" && (
        <SettingsTab
          storeSettings={storeSettings}
          onSettingsChange={(patch) => setStoreSettings(prev => ({ ...prev, ...patch }))}
          onSaveSettings={saveSettings}
          promos={promos}
          newPromo={newPromo}
          onNewPromoChange={(patch) => setNewPromo(prev => ({ ...prev, ...patch }))}
          onCreatePromo={createPromo}
          onDeletePromo={deletePromo}
          paymentMethods={paymentMethods}
          onCreatePaymentMethod={createPaymentMethod}
          onDeletePaymentMethod={deletePaymentMethod}
        />
      )}
    </AdminLayout>
  );
}
