import { useMemo, useState } from "react";
import { Plus, Check, Search } from "lucide-react";
import { STEAM_CATEGORIES } from "@/lib/products";
import type { Product } from "@/lib/products";
import { useCart } from "@/lib/cart";

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function GameCard({ game, color, emoji, category }: { game: string; color: string; emoji: string; category: string }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const product: Product = {
    id: `steam-${slug(game)}`,
    name: `Compte Steam — ${game}`,
    subtitle: category,
    price: 1,
    category: "Steam",
    color,
    emoji,
  };

  function handleAdd() {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div
      className="group glass rounded-2xl p-4 transition-all hover:-translate-y-1"
      style={{
        borderLeft: `3px solid ${color}`,
        boxShadow: `0 4px 20px ${color}22`,
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color }}>
            {emoji} Jeu Steam
          </div>
          <div className="font-bold text-base leading-tight mt-1 truncate">{game}</div>
        </div>
        <div
          className="text-3xl shrink-0 transition-transform group-hover:scale-110"
          style={{ filter: `drop-shadow(0 0 12px ${color})` }}
        >
          {emoji}
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Prix</div>
          <div className="text-xl font-black" style={{ color, textShadow: `0 0 16px ${color}90` }}>
            1,00€
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
          style={{ background: color, color: "#000", boxShadow: `0 6px 18px ${color}66` }}
          aria-label={`Ajouter ${game} au panier`}
        >
          {added ? <><Check size={14}/> Ajouté</> : <><Plus size={14}/> Panier</>}
        </button>
      </div>
    </div>
  );
}

export function SteamMenu() {
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState("");
  const cat = STEAM_CATEGORIES[active];

  const filtered = useMemo(() => {
    if (!query.trim()) return cat.games;
    const q = query.toLowerCase();
    return cat.games.filter((g) => g.toLowerCase().includes(q));
  }, [cat, query]);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div
        className="relative overflow-hidden rounded-2xl p-5 border border-white/5"
        style={{
          background: `linear-gradient(135deg, ${cat.color}22, transparent 70%), var(--color-card)`,
        }}
      >
        <div className="flex items-center gap-3">
          <div className="text-3xl" style={{ filter: `drop-shadow(0 0 16px ${cat.color})` }}>🎮</div>
          <div>
            <div className="text-xs uppercase tracking-wider font-bold" style={{ color: cat.color }}>
              Comptes Steam
            </div>
            <div className="font-bold">Tous les jeux à <span style={{ color: cat.color }}>1€</span> — choisissez et ajoutez au panier</div>
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {STEAM_CATEGORIES.map((c, i) => (
          <button
            key={c.name}
            onClick={() => { setActive(i); setQuery(""); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${active === i ? "scale-105" : "opacity-60 hover:opacity-100"}`}
            style={{
              background: active === i ? c.color : `${c.color}22`,
              color: active === i ? "#000" : c.color,
              boxShadow: active === i ? `0 8px 24px ${c.color}66` : "none",
            }}
          >
            {c.emoji} {c.name}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Rechercher dans ${cat.name}…`}
          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-background/60 border border-border text-sm focus:outline-none focus:ring-2"
          style={{ ["--tw-ring-color" as never]: cat.color }}
        />
      </div>

      {/* Games grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((g) => (
          <GameCard key={g} game={g} color={cat.color} emoji={cat.emoji} category={cat.name} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">Aucun jeu trouvé pour "{query}"</div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        ⚠ Les comptes fournis possèdent souvent d'AUTRES JEUX bonus déjà inclus. Pour une commande sur mesure (Epic, Valorant…) contactez via ticket.
      </p>
    </div>
  );
}
