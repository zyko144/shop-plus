import { Layers, Plus, Edit, Trash2 } from "lucide-react";
import type { Product } from "@/lib/products";

export function ProductsTab({
  allProducts,
  onAdd,
  onEdit,
  onDelete,
  onDeleteAllReviews,
  onInjectNewProducts,
}: {
  allProducts: Product[];
  onAdd: () => void;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
  onDeleteAllReviews: () => void;
  onInjectNewProducts: () => void;
}) {
  const byCategory = allProducts.reduce((acc, p) => {
    acc[p.category] = acc[p.category] || [];
    acc[p.category].push(p);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <div className="glass rounded-2xl p-8 border border-border/50">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h2 className="text-xl font-bold flex items-center gap-2"><Layers size={20} className="text-primary" /> Catalogue Produits</h2>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onDeleteAllReviews}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white text-sm font-bold transition-colors"
          >
            🗑️ Vider tous les avis
          </button>
          <button
            onClick={onInjectNewProducts}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white text-sm font-bold transition-colors"
          >
            🚀 Injecter Nouveaux Produits
          </button>
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-primary rounded-lg text-primary-foreground text-sm font-bold flex items-center gap-2"
          >
            <Plus size={16} /> Ajouter un produit
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(byCategory).map(([category, products]) => (
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
                    <div className="font-display font-black text-lg text-primary">{p.price}€</div>
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(p)}
                        className="p-1.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 rounded-md transition" title="Modifier"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(p.id)}
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
  );
}
