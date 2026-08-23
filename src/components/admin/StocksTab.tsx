import { Save } from "lucide-react";
import type { Product } from "@/lib/products";
import type { StockData } from "./types";

export function StocksTab({
  allProducts,
  stocks,
  onStockChange,
  onSave,
}: {
  allProducts: Product[];
  stocks: Record<string, StockData>;
  onStockChange: (productId: string, patch: Partial<StockData>) => void;
  onSave: (productId: string, stock: number, isUnlimited: boolean) => void;
}) {
  const byCategory = allProducts.reduce((acc, p) => {
    acc[p.category] = acc[p.category] || [];
    acc[p.category].push(p);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
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
            {Object.entries(byCategory).flatMap(([category, products]) => [
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
                        className="bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm font-medium focus:border-gray-500 outline-none"
                        value={stockInfo.is_unlimited ? "unlimited" : "limited"}
                        onChange={(e) => onStockChange(p.id, { is_unlimited: e.target.value === "unlimited", stock: stockInfo.stock })}
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
                          className="w-20 bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-center focus:border-gray-500 outline-none"
                          value={stockInfo.stock}
                          onChange={(e) => onStockChange(p.id, { is_unlimited: false, stock: parseInt(e.target.value) || 0 })}
                        />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => onSave(p.id, stockInfo.stock, stockInfo.is_unlimited)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-sm font-bold transition-colors"
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
  );
}
