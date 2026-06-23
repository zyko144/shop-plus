import { useState } from "react";
import { Plus, Check } from "lucide-react";
import type { Product } from "@/lib/products";
import { CATEGORY_IMAGES } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { ProductReviewsModal } from "./ProductReviews";

function hex(c: string) {
  return c.replace("#", "");
}

const RARE_SKIN_IMAGES: Record<string, string> = {
  "Black Knight": "https://fortnite-api.com/images/cosmetics/br/cid_035_athena_commando_m_medieval/icon.png",
  "Galaxy": "https://fortnite-api.com/images/cosmetics/br/cid_175_athena_commando_m_celestial/icon.png",
  "Travis Scott": "https://fortnite-api.com/images/cosmetics/br/cid_703_athena_commando_m_cyclone/icon.png",
  "The Reaper": "https://fortnite-api.com/images/cosmetics/br/cid_084_athena_commando_m_assassin/icon.png",
  "Take The L": "https://fortnite-api.com/images/cosmetics/br/eid_takethel/icon.png",
  "Minty Axe": "https://fortnite-api.com/images/cosmetics/br/pickaxe_id_294_candycane/icon.png",
  "Leviathan Axe": "https://fortnite-api.com/images/cosmetics/br/pickaxe_id_508_historianmale_6bqsw/icon.png"
};

export function ProductCard3D({ product, stockInfo = { is_unlimited: true, stock: 0 } }: { product: Product, stockInfo?: { is_unlimited: boolean, stock: number } }) {
  const { add } = useCart();
  const { profile } = useAuth();
  const [hover, setHover] = useState(false);
  const [added, setAdded] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [imgError, setImgError] = useState(false);
  const bgImg = product.image ?? CATEGORY_IMAGES[product.category];

  const hasPremiumDiscount = profile?.is_premium && (profile?.premium_orders_left || 0) > 0;
  const isDiscord = product.category?.toLowerCase().includes("discord") || product.name.toLowerCase().includes("discord");
  const displayPrice = hasPremiumDiscount && !isDiscord ? product.price * 0.7 : product.price;
  
  const skinImg = product.category === "Fortnite Rare" ? RARE_SKIN_IMAGES[product.name] : null;

  let logoUrl = skinImg || (product.logo
    ? product.logo.startsWith("http") || product.logo.startsWith("/")
      ? product.logo
      : `https://cdn.simpleicons.org/${product.logo}/${hex(product.color)}`
    : null);
    
  let displayEmoji = product.emoji;
  let finalBgImg = bgImg;

  if (product.category === "Fortnite") {
    logoUrl = `https://cdn.simpleicons.org/fortnite/${hex(product.color)}`;
    displayEmoji = undefined;
  }
  if (product.category === "V-Bucks") {
    logoUrl = `https://cdn.simpleicons.org/epicgames/${hex(product.color)}`;
    displayEmoji = undefined;
  }
  if (product.category === "Discord") {
    logoUrl = `https://cdn.simpleicons.org/discord/${hex(product.color)}`;
    displayEmoji = undefined;
    finalBgImg = undefined; // Hide the abstract background that has the star
  }

  const isOutOfStock = !stockInfo.is_unlimited && stockInfo.stock <= 0;

  function handleAdd() {
    if (isOutOfStock) return;
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`group relative rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 bg-card border border-white/5 ${isOutOfStock ? "opacity-75 grayscale" : ""}`}
      style={{
        boxShadow: hover && !isOutOfStock
          ? `0 30px 80px -20px ${product.color}80, 0 0 0 1px ${product.color}55 inset`
          : `0 10px 40px -15px #000`,
      }}
    >
      {/* Visual */}
      <div
        className="relative h-48 sm:h-56 md:h-64 overflow-hidden"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${product.color}33, #000 75%)`,
        }}
      >
        {/* subtle texture from category image */}
        {finalBgImg && (
          <img
            src={finalBgImg}
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
            opacity: hover && !isOutOfStock ? 0.9 : 0.55,
          }}
        />
        {/* logo */}
        <div className="absolute inset-0 grid place-items-center p-8 text-center">
          {logoUrl && !imgError ? (
            <img
              src={logoUrl}
              alt={product.name}
              loading="lazy"
              className={`${skinImg ? 'max-h-48 max-w-[90%]' : 'max-h-28 max-w-[75%]'} object-contain transition-transform duration-500 group-hover:scale-110`}
              style={{ filter: `drop-shadow(0 0 24px ${product.color}cc)` }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="text-4xl md:text-5xl font-black tracking-tighter transition-transform duration-500 group-hover:scale-110 px-4"
              style={{ color: product.color, textShadow: `0 0 40px ${product.color}`, wordBreak: "break-word", lineHeight: "1.1" }}
            >
              {displayEmoji || product.name}
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
        
        {/* Stock Badge */}
        {!stockInfo.is_unlimited && stockInfo.stock > 0 && stockInfo.stock <= 5 && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500 text-white shadow-lg shadow-orange-500/50">
            Plus que {stockInfo.stock} !
          </div>
        )}
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
            <div className="flex items-center gap-2">
              {hasPremiumDiscount && !isDiscord && (
                <div className="text-sm font-black text-white/40 line-through decoration-red-500/50">
                  {Number(product.price).toFixed(2)}€
                </div>
              )}
              <div className="text-2xl font-black" style={{ color: isOutOfStock ? "#666" : product.color, textShadow: isOutOfStock ? "none" : `0 0 24px ${product.color}90` }}>
                {Number(displayPrice).toFixed(2)}€
              </div>
            </div>
            {hasPremiumDiscount && !isDiscord && (
              <div className="text-[9px] font-bold text-purple-400 bg-purple-500/20 px-1.5 py-0.5 rounded-sm w-fit mt-0.5">
                👑 -30% Premium
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setShowReviews(true)}
              className="text-xs font-bold px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-1"
            >
              ⭐ Avis
            </button>
            <button
              onClick={handleAdd}
              disabled={isOutOfStock}
              className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${isOutOfStock ? "cursor-not-allowed" : "hover:scale-105 active:scale-95"}`}
              style={{ 
                background: isOutOfStock ? "#333" : product.color, 
                color: isOutOfStock ? "#888" : "#000", 
                boxShadow: isOutOfStock ? "none" : `0 8px 24px ${product.color}66` 
              }}
              aria-label="Ajouter au panier"
            >
              {isOutOfStock ? "Rupture" : added ? <><Check size={16}/> Ajouté</> : <><Plus size={16}/> Panier</>}
            </button>
          </div>
        </div>
      </div>
      
      {showReviews && (
        <ProductReviewsModal
          productId={product.id}
          productName={product.name}
          color={product.color}
          onClose={() => setShowReviews(false)}
        />
      )}
    </div>
  );
}