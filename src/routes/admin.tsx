import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Header } from "@/components/Header";
import { Package, DollarSign, Clock, CheckCircle, XCircle, Trash2 } from "lucide-react";

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

function AdminDashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<AdminOrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Security check: only admin can access
  // Instead of redirecting instantly, we show an error to debug
  if (!authLoading && (!user || profile?.role !== "admin")) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Accès Refusé</h1>
        <p className="text-muted-foreground mb-2">Vous n'avez pas les droits d'administrateur.</p>
        <div className="p-4 bg-black/50 rounded-lg text-sm font-mono mt-4">
          <p>Connecté en tant que : {user ? user.email : "Non connecté"}</p>
          <p>Rôle détecté dans la base : {profile?.role ? `"${profile.role}"` : "Aucun profil/rôle trouvé"}</p>
        </div>
        <button onClick={() => window.location.reload()} className="mt-6 px-4 py-2 bg-primary rounded-lg text-primary-foreground">
          Rafraîchir la page
        </button>
      </div>
    );
  }

  const loadOrders = async () => {
    setLoading(true);
    // Fetch all orders with user emails from profiles
    const { data, error } = await supabase
      .from("orders")
      .select("id,total,status,created_at,payment_ref,profiles(email,username),order_items(product_name,quantity,unit_price)")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data as any);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (profile?.role === "admin") {
      loadOrders();
    }
  }, [profile]);

  const updateStatus = async (id: string, status: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    await supabase.from("orders").update({ status }).eq("id", id);
  };

  const deleteOrder = async (id: string) => {
    if (!window.confirm("Supprimer cette commande définitivement ?")) return;
    setOrders(prev => prev.filter(o => o.id !== id));
    await supabase.from("orders").delete().eq("id", id);
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

        {/* Orders Table */}
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
                      <div className="font-medium">{new Date(o.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                      <div className="text-xs text-muted-foreground mt-1">#{o.id.slice(0, 8)}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white/90">{o.profiles?.email || 'Email introuvable'}</div>
                      <div className="text-xs text-muted-foreground">{o.profiles?.username || 'Anonyme'}</div>
                    </td>
                    <td className="p-4">
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {o.order_items.map((it, idx) => (
                          <li key={idx}><span className="text-white/70">{it.quantity}x</span> {it.product_name}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-4 font-bold text-primary">
                      {Number(o.total).toFixed(2)}€
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
      </div>
    </div>
  );
}
