import { CheckCircle, XCircle, Trash2 } from "lucide-react";
import type { AdminOrderRow } from "./types";

export function OrdersTab({
  orders,
  onUpdateStatus,
  onDelete,
}: {
  orders: AdminOrderRow[];
  onUpdateStatus: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
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
                    )) : <li className="text-gray-400">Erreur produits</li>}
                  </ul>
                </td>
                <td className="p-4 font-bold text-primary">
                  {Number(o.total || 0).toFixed(2)}€
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                    o.status === 'pending' ? 'bg-gray-500/20 text-gray-400' :
                    o.status === 'completed' ? 'bg-gray-500/20 text-gray-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {o.status === 'pending' && 'En attente'}
                    {o.status === 'completed' && 'Livré'}
                    {o.status === 'cancelled' && 'Annulé'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {o.status === 'pending' && (
                      <button onClick={() => onUpdateStatus(o.id, 'completed')} title="Marquer comme livré" className="p-1.5 rounded-lg bg-gray-500/20 text-gray-400 hover:bg-gray-500/40 transition">
                        <CheckCircle size={16} />
                      </button>
                    )}
                    {o.status !== 'cancelled' && (
                      <button onClick={() => onUpdateStatus(o.id, 'cancelled')} title="Annuler la commande" className="p-1.5 rounded-lg bg-gray-500/20 text-gray-400 hover:bg-gray-500/40 transition">
                        <XCircle size={16} />
                      </button>
                    )}
                    <button onClick={() => onDelete(o.id)} title="Supprimer définitivement" className="p-1.5 rounded-lg bg-gray-500/20 text-gray-500 hover:bg-gray-500/40 transition">
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
  );
}
