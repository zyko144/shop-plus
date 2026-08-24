import { useState } from "react";
import { Save } from "lucide-react";
import { resolveProductLogoUrl, type Product } from "@/lib/products";
import type { StockData } from "./types";

function ProductLogo({ product }: { product: Product }) {
  const [failed, setFailed] = useState(false);
  const logoUrl = !failed ? resolveProductLogoUrl(product) : undefined;

  return (
    <div
      className="w-16 h-16 shrink-0 rounded-2xl grid place-items-center overflow-hidden"
      style={{ backgroundColor: `${product.color}22`, boxShadow: `0 0 24px ${product.color}33` }}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={product.name}
          className="w-10 h-10 object-contain"
          style={{ filter: `drop-shadow(0 0 10px ${product.color}aa)` }}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="text-3xl">{product.emoji || "📦"}</span>
      )}
    </div>
  );
}

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
    <div className="space-y-10">
      {Object.entries(byCategory).map(([category, products]) => (
        <div key={category}>
          <h3 className="text-lg font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-3">
            {category}
            <span className="text-sm font-medium text-muted-foreground normal-case tracking-normal">({products.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {products.map((p) => {
              const stockInfo = stocks[p.id] || { is_unlimited: true, stock: 0 };
              return (
                <div
                  key={p.id}
                  className="glass rounded-2xl border border-border/50 p-5 flex flex-col gap-4 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <ProductLogo product={p} />
                    <div className="min-w-0">
                      <div className="font-bold text-lg text-white/90 truncate">{p.name}</div>
                      {p.subtitle && <div className="text-sm text-muted-foreground truncate">{p.subtitle}</div>}
                      <div className="text-base font-semibold text-white/70 mt-0.5">{Number(p.price).toFixed(2)}€</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm font-medium focus:border-gray-500 outline-none"
                      value={stockInfo.is_unlimited ? "unlimited" : "limited"}
                      onChange={(e) => onStockChange(p.id, { is_unlimited: e.target.value === "unlimited", stock: stockInfo.stock })}
                    >
                      <option value="unlimited">Illimité ♾️</option>
                      <option value="limited">Limité</option>
                    </select>
                    {!stockInfo.is_unlimited && (
                      <input
                        type="number"
                        min="0"
                        className="w-20 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-center focus:border-gray-500 outline-none"
                        value={stockInfo.stock}
                        onChange={(e) => onStockChange(p.id, { is_unlimited: false, stock: parseInt(e.target.value) || 0 })}
                      />
                    )}
                  </div>

                  <button
                    onClick={() => onSave(p.id, stockInfo.stock, stockInfo.is_unlimited)}
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-sm font-bold transition-colors"
                  >
                    <Save size={14} />
                    Enregistrer
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
