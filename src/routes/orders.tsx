import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/CartDrawer";
import { PAYPAL_URL } from "@/lib/products";
import { OrderReview } from "@/components/OrderReview";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "Mes commandes — ZYKO Store" }] }),
  component: OrdersPage,
});

type OrderRow = { id: string; total: number; status: string; created_at: string; order_items: { product_name: string; quantity: number; unit_price: number; category: string }[] };

function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/auth" });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.from("orders").select("id,total,status,created_at,order_items(product_name,quantity,unit_price,category)").order("created_at", { ascending: false }).then(({ data }) => {
      setOrders((data as any) ?? []);
      setLoading(false);
    });
  }, [user]);

  const deleteOrder = async (id: string) => {
    // Suppression optimiste de l'UI
    setOrders(prev => prev.filter(o => o.id !== id));
    // Suppression en base de données
    await supabase.from("orders").delete().eq("id", id);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <CartDrawer />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-black mb-8">Mes commandes</h1>
        {loading && <p className="text-muted-foreground">Chargement...</p>}
        {!loading && orders.length === 0 && (
          <div className="glass rounded-2xl p-10 text-center">
            <p className="text-muted-foreground mb-4">Aucune commande pour l'instant.</p>
            <Link to="/" className="inline-block px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium">Voir la boutique</Link>
          </div>
        )}
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="glass rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <div className="text-xs text-muted-foreground">Commande #{o.id.slice(0, 8)}</div>
                  <div className="text-sm">{new Date(o.created_at).toLocaleString("fr-FR")}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${o.status === "pending" ? "bg-yellow-500/20 text-yellow-300" : "bg-green-500/20 text-green-300"}`}>
                    {o.status === "pending" ? "En attente paiement" : o.status}
                  </span>
                  <span className="font-bold text-lg text-primary">{Number(o.total).toFixed(2)}€</span>
                  {o.status === "pending" && (
                    <button 
                      onClick={() => deleteOrder(o.id)} 
                      className="p-1 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/30 transition-colors"
                      title="Annuler la commande"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
              <ul className="space-y-1 text-sm">
                {o.order_items.map((it, i) => (
                  <li key={i} className="flex justify-between border-t border-border pt-2">
                    <span>{it.quantity}× {it.product_name} <span className="text-muted-foreground text-xs">({it.category})</span></span>
                    <span>{(it.quantity * Number(it.unit_price)).toFixed(2)}€</span>
                  </li>
                ))}
              </ul>
              {o.status === "pending" && (
              <a href={`${PAYPAL_URL}/${Number(o.total).toFixed(2)}EUR`} target="_blank" className="mt-3 inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 text-black text-sm font-bold">
                  Payer maintenant
                </a>
              )}
              {o.status !== "pending" && (
                <OrderReview orderId={o.id} createdAt={o.created_at} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}