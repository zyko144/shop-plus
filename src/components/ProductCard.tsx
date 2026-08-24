import { useRef, useState } from "react";
import { Plus, Check, X } from "lucide-react";
import type { Product } from "@/lib/products";
import { CATEGORY_IMAGES, resolveProductLogoUrl } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ProductReviewsModal } from "./ProductReviews";

export function ProductCard({ product, stockInfo = { is_unlimited: true, stock: 0 } }: { product: Product, stockInfo?: { is_unlimited: boolean, stock: number } }) {
  const { add } = useCart();
  const { profile } = useAuth();
  const [hover, setHover] = useState(false);
  const [added, setAdded] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [imgRetries, setImgRetries] = useState(0);
  const MAX_IMG_RETRIES = 2;
  const cardRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<{ x: (value: number) => void; y: (value: number) => void } | null>(null);
  const bgImg = product.image ?? CATEGORY_IMAGES[product.category];

  const hasPremiumDiscount = profile?.is_premium && (profile?.premium_orders_left || 0) > 0;
  const isDiscord = product.category?.toLowerCase().includes("discord") || product.name.toLowerCase().includes("discord");
  const displayPrice = hasPremiumDiscount && !isDiscord ? product.price * 0.7 : product.price;

  const logoUrl = resolveProductLogoUrl(product) ?? null;

  let displayEmoji = product.emoji;
  let finalBgImg = bgImg;

  if (["Fortnite", "V-Bucks"].includes(product.category)) {
    displayEmoji = undefined;
  }
  if (product.category === "Discord") {
    displayEmoji = undefined;
    finalBgImg = undefined; // Hide the abstract background that has the star
  }

  const isOutOfStock = !stockInfo.is_unlimited && stockInfo.stock <= 0;

  useGSAP(() => {
    if (!cardRef.current) return;
    tiltRef.current = {
      x: gsap.quickTo(cardRef.current, "rotationY", { duration: 0.5, ease: "power3.out" }),
      y: gsap.quickTo(cardRef.current, "rotationX", { duration: 0.5, ease: "power3.out" }),
    };
    gsap.set(cardRef.current, { transformPerspective: 800, transformStyle: "preserve3d" });
  }, { scope: cardRef });

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (isOutOfStock || !cardRef.current || !tiltRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    tiltRef.current.x(px * 10);
    tiltRef.current.y(py * -10);
  }

  function handlePointerLeave() {
    setHover(false);
    tiltRef.current?.x(0);
    tiltRef.current?.y(0);
  }

  function handleAdd() {
    if (isOutOfStock) return;
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      className={`group relative rounded-3xl overflow-hidden bg-card border border-white/5 will-change-transform ${isOutOfStock ? "opacity-75 grayscale" : ""}`}
      style={{
        boxShadow: hover && !isOutOfStock
          ? `0 30px 80px -20px ${product.color}80, 0 0 0 1px ${product.color}55 inset`
          : `0 10px 40px -15px #000`,
        transition: "box-shadow 400ms ease",
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
        {/* sweep shimmer on hover */}
        <div
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] ease-out pointer-events-none"
          style={{ background: `linear-gradient(115deg, transparent 40%, ${product.color}30 50%, transparent 60%)` }}
        />
        {/* logo */}
        <div className="absolute inset-0 grid place-items-center p-8 text-center">
          {logoUrl && imgRetries <= MAX_IMG_RETRIES ? (
            <img
              key={imgRetries}
              src={logoUrl}
              alt={product.name}
              loading="lazy"
              className={`${product.category === "Fortnite Rare" ? 'max-h-48 max-w-[90%]' : 'max-h-28 max-w-[75%]'} object-contain transition-transform duration-500 group-hover:scale-110`}
              style={{ filter: `drop-shadow(0 0 24px ${product.color}cc)` }}
              onError={() => setImgRetries((n) => n + 1)}
            />
          ) : (
            <div
              className="font-display text-4xl md:text-5xl font-black tracking-tighter transition-transform duration-500 group-hover:scale-110 px-4"
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
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-500 text-white shadow-lg shadow-gray-500/50">
            Plus que {stockInfo.stock} !
          </div>
        )}

        {/* Rupture de stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-black/50">
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-red-600 grid place-items-center shadow-lg shadow-red-600/50 ring-4 ring-red-600/30">
                <X size={28} strokeWidth={3.5} className="text-white" />
              </div>
              <span className="text-red-400 font-black text-xs uppercase tracking-widest bg-black/70 px-3 py-1 rounded-full">Rupture de stock</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <div className="font-display font-bold text-lg leading-tight">{product.name}</div>
          {product.subtitle && <div className="text-xs text-muted-foreground mt-1">{product.subtitle}</div>}
        </div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">À partir de</div>
            <div className="flex items-center gap-2">
              {hasPremiumDiscount && !isDiscord && (
                <div className="text-sm font-black text-white/40 line-through decoration-gray-500/50">
                  {Number(product.price).toFixed(2)}€
                </div>
              )}
              <div className="font-display text-2xl font-black" style={{ color: isOutOfStock ? "#666" : product.color, textShadow: isOutOfStock ? "none" : `0 0 24px ${product.color}90` }}>
                {Number(displayPrice).toFixed(2)}€
              </div>
            </div>
            {hasPremiumDiscount && !isDiscord && (
              <div className="text-[9px] font-bold text-gray-400 bg-gray-500/20 px-1.5 py-0.5 rounded-sm w-fit mt-0.5">
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
          logo={product.logo}
          onClose={() => setShowReviews(false)}
        />
      )}
    </div>
  );
}
