import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/CartDrawer";
import { ProductCard3D } from "@/components/ProductCard3D";
import { SteamMenu } from "@/components/SteamMenu";
import { CategorySidebar, type Cat } from "@/components/CategorySidebar";
import { CATEGORY_IMAGES, getAllProducts } from "@/lib/products";
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

const GROUP_META: Record<string, Omit<Group, "items">> = {
  "Streaming": { id: "streaming", label: "Streaming", emoji: "📺", color: "#ff0033", description: "Films, séries, musique — vos plateformes préférées dès 1€." },
  "VPN": { id: "vpn", label: "VPN", emoji: "🛡", color: "#4687ff", description: "Navigation sécurisée, débridez tout le web." },
  "Twitch": { id: "twitch", label: "Twitch", emoji: "💜", color: "#9146ff", description: "Boostez votre chaîne avec de vrais followers." },
  "Fortnite": { id: "fortnite", label: "Fortnite", emoji: "🎯", color: "#00d2ff", description: "Comptes Fortnite aléatoires avec skins inclus." },
  "Fortnite Rare": { id: "rare", label: "Skins Rares", emoji: "👑", color: "#ffb800", description: "Pioches exclusives, skins légendaires, OG only." },
  "V-Bucks": { id: "vbucks", label: "V-Bucks", emoji: "💰", color: "#f0b400", description: "Comptes chargés en V-Bucks prêts à dépenser." },
  "Steam": { id: "steam", label: "Steam", emoji: "🎮", color: "#1b9cff", description: "Choisissez votre jeu Steam — 1€ chacun, ajout au panier instantané." },
  "Discord": { id: "discord", label: "Discord", emoji: "✦", color: "#5865f2", description: "Décorations de profil — grille tarifaire officielle." },
};

function Index() {
  const [active, setActive] = useState("streaming");
  const [query, setQuery] = useState("");
  const [stocks, setStocks] = useState<Record<string, { is_unlimited: boolean, stock: number }>>({});
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [stocksData, productsData] = await Promise.all([
        supabase.from("product_stock").select("*"),
        getAllProducts()
      ]);
      
      if (stocksData.data) {
        const map: Record<string, { is_unlimited: boolean, stock: number }> = {};
        stocksData.data.forEach((s) => map[s.product_id] = { is_unlimited: s.is_unlimited, stock: s.stock });
        setStocks(map);
      }
      
      if (productsData) {
        setAllProducts(productsData);
      }
      setLoadingProducts(false);
    };
    fetchData();
  }, []);

  const GROUPS = useMemo(() => {
    const STREAMING_ORDER = ["netflix", "disney", "spotify", "crunchyroll", "amazon", "youtube", "deezer"];
    const groups: Group[] = [];
    Object.keys(GROUP_META).forEach(catName => {
      const meta = GROUP_META[catName];
      const items = allProducts.filter(p => p.category === catName);
      if (catName === "Streaming") {
        items.sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          const scoreA = STREAMING_ORDER.findIndex(k => nameA.includes(k));
          const scoreB = STREAMING_ORDER.findIndex(k => nameB.includes(k));
          const finalA = scoreA === -1 ? 999 : scoreA;
          const finalB = scoreB === -1 ? 999 : scoreB;
          return finalA - finalB;
        });
      }
      groups.push({ ...meta, items });
    });
    return groups;
  }, [allProducts]);

  const cats: Cat[] = useMemo(
    () => GROUPS.map((g) => ({ id: g.id, label: g.label, emoji: g.emoji, color: g.color, count: g.items.length || (g.id === "steam" ? 40 : 0) })),
    [GROUPS]
  );

  const group = GROUPS.find((g) => g.id === active) || GROUPS[0];
  const filtered = useMemo(() => {
    if (!group) return [];
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
      <section className="relative overflow-hidden bg-transparent border-b border-border/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/10 via-black to-black pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
        
        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/5 text-xs font-medium mb-8 text-muted-foreground backdrop-blur-sm shadow-xl">
             <Sparkles size={14} className="text-primary" /> Boutique premium — Livraison instantanée
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6">
            L'excellence numérique.<br/>
            <span className="bg-gradient-to-r from-red-500 via-red-400 to-red-600 bg-clip-text text-transparent drop-shadow-sm">Sans compromis.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 font-medium">
            Comptes streaming, gaming et VPN de la plus haute qualité. <br className="hidden md:block"/>
            Accédez à vos plateformes préférées instantanément et au meilleur prix.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-sm text-muted-foreground font-semibold">
            <div className="flex items-center gap-2.5"><Zap size={18} className="text-primary" /> Livraison immédiate</div>
            <div className="flex items-center gap-2.5"><ShieldCheck size={18} className="text-primary" /> Comptes garantis</div>
            <div className="flex items-center gap-2.5"><ShoppingBag size={18} className="text-primary" /> Paiement sécurisé</div>
          </div>
        </div>
      </section>

      {/* CATEGORY BAR */}
      <CategorySidebar cats={cats} active={active} onSelect={handleSelect} />

      {/* MAIN LAYOUT */}
      <main className="max-w-[1600px] mx-auto px-4 md:px-6 py-10">
        <section className="space-y-8">
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
              <div className="relative w-full md:w-80">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher dans la catégorie…"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-sm focus:outline-none focus:ring-2 backdrop-blur-sm transition-all"
                  style={{ ["--tw-ring-color" as never]: group.color }}
                />
              </div>
            </div>
          </div>
          
          {["Fortnite", "Skins Rares", "Steam", "Streaming"].includes(group.label) && (
            <div className="bg-orange-500/20 border border-orange-500/50 rounded-2xl p-4 flex items-center justify-center gap-3 text-orange-400 font-bold text-center shadow-[0_0_20px_rgba(249,115,22,0.2)] mb-4">
              <Zap size={24} className="text-orange-400 animate-pulse" />
              <span>Dépêchez-vous ! Les prix de cette catégorie augmenteront demain à 12h00. Profitez-en maintenant !</span>
            </div>
          )}
          
          {group.label === "Fortnite" && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-center gap-3 text-red-500 font-bold text-center shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <span>Si vous voulez d'autres comptes spécifiques, n'hésitez pas à faire une demande sur notre discord !</span>
              <a href="https://discord.gg/UUBFjjCp" className="px-4 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors" target="_blank" rel="noreferrer">
                Rejoindre le Discord
              </a>
            </div>
          )}

          {/* Grid */}
          {group.id === "steam" ? (
            <SteamMenu />
          ) : group.id === "fortnite" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {filtered.map((p) => <ProductCard3D key={p.id} product={p} stockInfo={stocks[p.id]} />)}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {filtered.map((p) => <ProductCard3D key={p.id} product={p} stockInfo={stocks[p.id]} />)}
              </div>
              {filtered.length === 0 && (
                <div className="text-center py-24 text-muted-foreground bg-white/5 rounded-3xl border border-white/5">
                  <span className="text-4xl block mb-2">😕</span>
                  Aucun produit ne correspond à "{query}"
                </div>
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
