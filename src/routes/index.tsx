import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/CartDrawer";
import { ProductCard3D } from "@/components/ProductCard3D";
import { SteamMenu } from "@/components/SteamMenu";
import { CategorySidebar, type Cat } from "@/components/CategorySidebar";
import {
  STREAMING, VPN, TWITCH, FORTNITE_CLASSIC, FORTNITE_RARE, VBUCKS, DISCORD_DECO,
  CATEGORY_IMAGES,
} from "@/lib/products";
import type { Product } from "@/lib/products";
import { Sparkles, Zap, ShieldCheck, ShoppingBag, Search } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SHOP+ — Comptes Streaming, Fortnite, Steam, VPN & Discord" },
      { name: "description", content: "SHOP+ : boutique premium 3D — YouTube, Netflix, Deezer, Crunchyroll, Fortnite, Steam, VPN, V-Bucks, décorations Discord. Paiement PayPal sécurisé." },
      { property: "og:title", content: "SHOP+ — Boutique premium" },
      { property: "og:description", content: "Comptes streaming, gaming, VPN et bonus exclusifs. Livraison instantanée, paiement PayPal." },
    ],
  }),
  component: Index,
});

type Group = { id: string; label: string; emoji: string; color: string; items: Product[]; description: string };

const GROUPS: Group[] = [
  { id: "streaming", label: "Streaming", emoji: "📺", color: "#ff0033", items: STREAMING, description: "Films, séries, musique — vos plateformes préférées dès 1€." },
  { id: "vpn", label: "VPN", emoji: "🛡", color: "#4687ff", items: VPN, description: "Navigation sécurisée, débridez tout le web." },
  { id: "twitch", label: "Twitch", emoji: "💜", color: "#9146ff", items: TWITCH, description: "Boostez votre chaîne avec de vrais followers." },
  { id: "fortnite", label: "Fortnite", emoji: "🎯", color: "#00d2ff", items: FORTNITE_CLASSIC, description: "Comptes Fortnite aléatoires avec skins inclus." },
  { id: "rare", label: "Skins Rares", emoji: "👑", color: "#ffb800", items: FORTNITE_RARE, description: "Pioches exclusives, skins légendaires, OG only." },
  { id: "vbucks", label: "V-Bucks", emoji: "💰", color: "#f0b400", items: VBUCKS, description: "Comptes chargés en V-Bucks prêts à dépenser." },
  { id: "steam", label: "Steam", emoji: "🎮", color: "#1b9cff", items: [], description: "Choisissez votre jeu Steam — 1€ chacun, ajout au panier instantané." },
  { id: "discord", label: "Discord", emoji: "✦", color: "#5865f2", items: DISCORD_DECO, description: "Décorations de profil — grille tarifaire officielle." },
];

function Index() {
  const [active, setActive] = useState("streaming");
  const [query, setQuery] = useState("");
  const [stocks, setStocks] = useState<Record<string, { is_unlimited: boolean, stock: number }>>({});

  useEffect(() => {
    const fetchStocks = async () => {
      const { data } = await supabase.from("product_stock").select("*");
      if (data) {
        const map: Record<string, { is_unlimited: boolean, stock: number }> = {};
        data.forEach((s) => map[s.product_id] = { is_unlimited: s.is_unlimited, stock: s.stock });
        setStocks(map);
      }
    };
    fetchStocks();
  }, []);

  const cats: Cat[] = useMemo(
    () => GROUPS.map((g) => ({ id: g.id, label: g.label, emoji: g.emoji, color: g.color, count: g.items.length || 4 })),
    []
  );

  const group = GROUPS.find((g) => g.id === active)!;
  const filtered = useMemo(() => {
    if (!query.trim()) return group.items;
    const q = query.toLowerCase();
    return group.items.filter((p) => p.name.toLowerCase().includes(q));
  }, [group, query]);

  function handleSelect(id: string) {
    setActive(id);
    setQuery("");
    window.scrollTo({ top: 380, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen">
      <Header />
      <CartDrawer />

      {/* HERO */}
      <section className="relative overflow-hidden grid-bg border-b border-border">
        <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60 animate-hero-zoom" />
        <div className="absolute inset-0 hero-red-pulse pointer-events-none" />
        <div className="absolute inset-0 hero-red-sweep pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-background" />
        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium">
              <Sparkles size={14} className="text-primary" /> Boutique premium — Livraison instantanée
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95]">
              <div className="flex items-center gap-3 mb-4">
                <div className="shrink-0 w-16 h-16 md:w-20 md:h-20 bg-black rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.4)] border border-red-600/30 overflow-hidden p-1.5 flex items-center justify-center">
                  <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <span className="text-foreground">SHOP</span>
                  <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(220,38,38,0.8)]">+</span>
                </div>
              </div>
              <span className="text-2xl md:text-3xl font-bold text-muted-foreground block">Tout ce que vous voulez. À prix imbattable.</span>
            </h1>
            <div className="flex flex-wrap gap-5 pt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Zap size={16} className="text-primary" /> Livraison rapide</div>
              <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-accent" /> Comptes garantis</div>
              <div className="flex items-center gap-2"><ShoppingBag size={16} className="text-primary" /> PayPal sécurisé</div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN LAYOUT */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-10 grid lg:grid-cols-[260px_minmax(0,1fr)] gap-6">
        <CategorySidebar cats={cats} active={active} onSelect={handleSelect} />

        <section className="min-w-0 space-y-6">
          {/* Category header */}
          <div
            className="relative overflow-hidden rounded-3xl border border-white/5 p-6 md:p-8"
            style={{
              background: `linear-gradient(135deg, ${group.color}22, transparent 70%), var(--color-card)`,
            }}
          >
            <img
              src={CATEGORY_IMAGES[group.label] ?? heroBg}
              alt=""
              loading="lazy"
              className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-30 [mask-image:linear-gradient(to_left,black,transparent)]"
            />
            <div className="relative flex flex-wrap items-end justify-between gap-4">
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-[0.3em] font-bold" style={{ color: group.color }}>
                  {group.emoji} {group.label}
                </div>
                <h2 className="mt-2 text-3xl md:text-4xl font-black tracking-tight">{group.description}</h2>
              </div>
              <div className="relative w-full md:w-72">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher dans la catégorie…"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-background/60 border border-border text-sm focus:outline-none focus:ring-2"
                  style={{ ["--tw-ring-color" as never]: group.color }}
                />
              </div>
            </div>
          </div>

          {/* Grid */}
          {group.id === "steam" ? (
            <SteamMenu />
          ) : group.id === "fortnite" ? (
            <div className="space-y-10">
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((p) => <ProductCard3D key={p.id} product={p} stockInfo={stocks[p.id]} />)}
              </div>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((p) => <ProductCard3D key={p.id} product={p} stockInfo={stocks[p.id]} />)}
              </div>
              {filtered.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">Aucun produit ne correspond à "{query}"</div>
              )}
            </>
          )}
        </section>
      </main>

      <footer className="border-t border-border py-10 px-6 text-center text-sm text-muted-foreground mt-10">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-black rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)] border border-red-600/30 overflow-hidden p-1 flex items-center justify-center">
            <img src="/logo.png" alt="SHOP+" className="w-full h-full object-contain" />
          </div>
        </div>
        <p className="font-black text-foreground mb-2 text-lg flex justify-center items-center gap-1">SHOP<span className="text-primary">+</span></p>
        <p>Paiement sécurisé via PayPal — <a href="https://paypal.me/zyko921" target="_blank" rel="noreferrer" className="text-primary hover:underline">paypal.me/zyko921</a></p>
        <p className="mt-2 text-xs">© {new Date().getFullYear()} SHOP+. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
