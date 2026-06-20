import { useState } from "react";
import { Plus, Check } from "lucide-react";
import type { Product } from "@/lib/products";
import { CATEGORY_IMAGES } from "@/lib/products";
import { useCart } from "@/lib/cart";

function hex(c: string) {
  return c.replace("#", "");
}

export function ProductCard3D({ product }: { product: Product }) {
  const { add } = useCart();
  const [hover, setHover] = useState(false);
  const [added, setAdded] = useState(false);
  const bgImg = product.image ?? CATEGORY_IMAGES[product.category];
  const logoUrl = product.logo
    ? product.logo.startsWith("http")
      ? product.logo
      : `https://cdn.simpleicons.org/${product.logo}/${hex(product.color)}`
    : null;

  function handleAdd() {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 bg-card border border-white/5"
      style={{
        boxShadow: hover
          ? `0 30px 80px -20px ${product.color}80, 0 0 0 1px ${product.color}55 inset`
          : `0 10px 40px -15px #000`,
      }}
    >
      {/* Visual */}
      <div
        className="relative h-64 overflow-hidden"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${product.color}33, #000 75%)`,
        }}
      >
        {/* subtle texture from category image */}
        {bgImg && (
          <img
            src={bgImg}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-screen"
          />
        )}
        {/* glow halo */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 50% 55%, ${product.color}66, transparent 60%)`,
            opacity: hover ? 0.9 : 0.55,
          }}
        />
        {/* logo */}
        <div className="absolute inset-0 grid place-items-center p-8">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={product.name}
              loading="lazy"
              className="max-h-28 max-w-[60%] object-contain transition-transform duration-500 group-hover:scale-110"
              style={{ filter: `drop-shadow(0 0 24px ${product.color}cc)` }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div
              className="text-7xl font-black tracking-tighter transition-transform duration-500 group-hover:scale-110"
              style={{ color: product.color, textShadow: `0 0 40px ${product.color}` }}
            >
              {product.emoji}
            </div>
          )}
        </div>
        {/* bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-card to-transparent" />
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md border"
          style={{ background: `${product.color}22`, color: product.color, borderColor: `${product.color}55` }}
        >
          {product.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <div className="font-bold text-lg leading-tight">{product.name}</div>
          {product.subtitle && <div className="text-xs text-muted-foreground mt-1">{product.subtitle}</div>}
        </div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">À partir de</div>
            <div className="text-2xl font-black" style={{ color: product.color, textShadow: `0 0 24px ${product.color}90` }}>
              {product.price.toFixed(2)}€
            </div>
          </div>
          <button
            onClick={handleAdd}
            className="shrink-0 px-4 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
            style={{ background: product.color, color: "#000", boxShadow: `0 8px 24px ${product.color}66` }}
            aria-label="Ajouter au panier"
          >
            {added ? <><Check size={16}/> Ajouté</> : <><Plus size={16}/> Panier</>}
          </button>
        </div>
      </div>
    </div>
  );
}