import { useEffect, useState } from "react";

const REVIEWS: { name: string; rating: number; text: string; product: string }[] = [
  { name: "Lucas_92", rating: 5, text: "Reçu mon Netflix en 2 min, top !", product: "Netflix" },
  { name: "Maeva.k", rating: 5, text: "Compte Spotify nickel, merci !", product: "Spotify" },
  { name: "Théo🔥", rating: 5, text: "Livraison ultra rapide, je recommande à 100%", product: "Disney+" },
  { name: "samy_off", rating: 4, text: "Tout fonctionne, support discord réactif", product: "NordVPN" },
  { name: "Camille_R", rating: 5, text: "J'avais peur au début mais franchement parfait", product: "HBO Max" },
  { name: "Yanis.b", rating: 5, text: "V-Bucks reçus directement, sérieux le vendeur 👍", product: "V-Bucks" },
  { name: "Léa🌸", rating: 5, text: "Prix imbattable, ça change des autres sites", product: "CapCut Pro" },
  { name: "kev_47", rating: 5, text: "2eme commande, toujours nickel", product: "Crunchyroll" },
  { name: "Inès.M", rating: 5, text: "Site clean, paiement PayPal simple, RAS", product: "YouTube Premium" },
  { name: "matteo_ps", rating: 4, text: "Petit délai mais le compte marche bien", product: "DAZN" },
  { name: "Nora_22", rating: 5, text: "Honnêtement le meilleur store que j'ai test", product: "Deezer" },
  { name: "Hugo.dev", rating: 5, text: "Discord répond en 1 min, parfait", product: "Steam" },
  { name: "Sarah🖤", rating: 5, text: "Reçu en moins de 5 min après paiement", product: "Paramount+" },
  { name: "Ethan_06", rating: 5, text: "Ça fait 3 mois ça marche toujours 🔥", product: "Netflix" },
  { name: "Manon.l", rating: 5, text: "Merci, mon petit frère est trop content !", product: "Fortnite" },
  { name: "rayan.exe", rating: 5, text: "Que dire... parfait du début à la fin", product: "HBO Max" },
  { name: "Chloé_p", rating: 5, text: "Le SAV est au top, problème résolu de suite", product: "IPVanish" },
  { name: "Adam🚀", rating: 5, text: "Plus jamais je paye plein tarif ailleurs", product: "Disney+" },
];

function Stars({ value }: { value: number }) {
  return (
    <span className="text-yellow-400 text-xs">
      {"★".repeat(value)}<span className="text-muted-foreground/40">{"★".repeat(5 - value)}</span>
    </span>
  );
}

export function FakeReviewsCarousel() {
  const [open, setOpen] = useState(true);
  // duplicate for seamless loop
  const loop = [...REVIEWS, ...REVIEWS];

  useEffect(() => {
    const el = document.documentElement;
    el.style.setProperty("--reviews-pad", open ? "120px" : "0px");
    return () => { el.style.removeProperty("--reviews-pad"); };
  }, [open]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-3 left-3 z-40 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur border border-border text-xs"
      >
        ⭐ Avis clients
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/85 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 py-1.5 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground flex items-center gap-2">
          <span className="text-yellow-400">★ 4.9/5</span>
          <span className="opacity-70">— +2 400 avis vérifiés</span>
        </span>
        <button onClick={() => setOpen(false)} className="hover:text-foreground" aria-label="Fermer">✕</button>
      </div>
      <div className="reviews-marquee overflow-hidden">
        <div className="reviews-track flex gap-3 py-2 px-2">
          {loop.map((r, i) => (
            <div key={i} className="shrink-0 w-72 glass rounded-xl px-3 py-2 border border-border/60">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-semibold truncate">{r.name}</span>
                <Stars value={r.rating} />
              </div>
              <p className="text-xs text-foreground/90 line-clamp-2">{r.text}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">— {r.product}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}