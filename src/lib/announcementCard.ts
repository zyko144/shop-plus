import type { Image } from "@napi-rs/canvas";
import poppinsRegularUrl from "@/assets/fonts/Poppins-Regular.ttf?url";
import poppinsMediumUrl from "@/assets/fonts/Poppins-Medium.ttf?url";
import poppinsSemiBoldUrl from "@/assets/fonts/Poppins-SemiBold.ttf?url";
import poppinsBoldUrl from "@/assets/fonts/Poppins-Bold.ttf?url";

const SITE_ORIGIN = "https://shop-plus-nu.vercel.app";
const absolute = (url: string) => (url.startsWith("http") ? url : `${SITE_ORIGIN}${url}`);

// Import dynamique + @vite-ignore : @napi-rs/canvas embarque un binaire natif
// par plateforme que le bundler ne doit jamais essayer d'analyser/inliner
// statiquement (ça casse le build). Charge a l'execution, comme un require()
// Node normal.
let canvasLibPromise: Promise<typeof import("@napi-rs/canvas")> | null = null;
function loadCanvasLib() {
  if (!canvasLibPromise) canvasLibPromise = import(/* @vite-ignore */ "@napi-rs/canvas");
  return canvasLibPromise;
}

let fontsReady: Promise<void> | null = null;
/** Les .ttf sont servis comme assets statiques (memes URLs que sur le site) et
 * enregistres via un fetch + Buffer plutot qu'un chemin disque : c'est le seul
 * moyen fiable de garantir leur presence quel que soit l'environnement serverless
 * qui execute la fonction (pas d'hypothese sur le systeme de fichiers du bundle). */
function ensureFonts() {
  if (!fontsReady) {
    fontsReady = (async () => {
      const { GlobalFonts } = await loadCanvasLib();
      const entries: [string, string][] = [
        [poppinsRegularUrl, "Poppins"],
        [poppinsMediumUrl, "Poppins Medium"],
        [poppinsSemiBoldUrl, "Poppins SemiBold"],
        [poppinsBoldUrl, "Poppins Bold"],
      ];
      await Promise.all(
        entries.map(async ([url, alias]) => {
          const res = await fetch(absolute(url));
          const buf = Buffer.from(await res.arrayBuffer());
          GlobalFonts.register(buf, alias);
        })
      );
    })();
  }
  return fontsReady;
}

function roundRect(ctx: any, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

async function safeLoadImage(url?: string | null): Promise<Image | null> {
  if (!url) return null;
  try {
    const { loadImage } = await loadCanvasLib();
    return await loadImage(absolute(url));
  } catch {
    return null;
  }
}

export type AnnouncementCardData = {
  /** Texte sans emoji : la police embarquee n'a pas de glyphes emoji (rendus en carre casse), l'emoji reste dans le titre du message Discord a cote. */
  badge: string; // ex: "RUPTURE DE STOCK"
  name: string;
  category?: string;
  price?: string; // deja formate, ex "4.99€" ou "~~4.99€~~ -> 3.99€"
  stock?: string;
  imageUrl?: string | null;
};

const W = 1200;
const H = 700;

export async function renderAnnouncementCard(data: AnnouncementCardData): Promise<Buffer> {
  const { createCanvas } = await loadCanvasLib();
  await ensureFonts();
  const logo = await safeLoadImage(data.imageUrl);

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  // Fond degrade noir -> gris, meme identite que les cartes du bot Discord.
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#050505");
  bg.addColorStop(0.55, "#151515");
  bg.addColorStop(1, "#333333");
  ctx.fillStyle = bg;
  roundRect(ctx, 0, 0, W, H, 36);
  ctx.fill();

  const glow = ctx.createRadialGradient(W * 0.82, H * 0.12, 10, W * 0.82, H * 0.12, W * 0.55);
  glow.addColorStop(0, "rgba(255,255,255,0.18)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 3;
  roundRect(ctx, 6, 6, W - 12, H - 12, 32);
  ctx.stroke();
  ctx.restore();

  // Badge type d'annonce
  ctx.font = '700 30px "Poppins Bold"';
  const badgeW = ctx.measureText(data.badge).width + 56;
  ctx.fillStyle = "rgba(255,255,255,0.1)";
  roundRect(ctx, 48, 44, badgeW, 60, 30);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(data.badge, 48 + 28, 44 + 30);
  ctx.textBaseline = "alphabetic";

  // Logo produit, grand, centre, avec halo
  const logoSize = 280;
  const logoY = 140;
  const logoCx = W / 2;
  if (logo) {
    ctx.save();
    ctx.shadowColor = "rgba(255,255,255,0.55)";
    ctx.shadowBlur = 60;
    const ratio = Math.min(logoSize / logo.width, logoSize / logo.height);
    const dw = logo.width * ratio;
    const dh = logo.height * ratio;
    ctx.drawImage(logo, logoCx - dw / 2, logoY + (logoSize - dh) / 2, dw, dh);
    ctx.restore();
  }

  // Nom du produit
  ctx.font = '700 52px "Poppins Bold"';
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  let displayName = data.name;
  while (ctx.measureText(displayName).width > W - 120 && displayName.length > 4) {
    displayName = displayName.slice(0, -1);
  }
  if (displayName !== data.name) displayName = displayName.trimEnd() + "…";
  ctx.fillText(displayName, logoCx, logoY + logoSize + 70);

  // Pills categorie / prix / stock
  const pills = [
    data.category ? { label: data.category } : null,
    data.price ? { label: data.price } : null,
    data.stock ? { label: data.stock } : null,
  ].filter(Boolean) as { label: string }[];

  if (pills.length) {
    ctx.font = '600 24px "Poppins SemiBold"';
    const gap = 20;
    const widths = pills.map((p) => ctx.measureText(p.label).width + 48);
    const totalW = widths.reduce((a, b) => a + b, 0) + gap * (pills.length - 1);
    let x = logoCx - totalW / 2;
    const pillY = logoY + logoSize + 110;
    pills.forEach((p, i) => {
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      roundRect(ctx, x, pillY, widths[i], 52, 26);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 1.5;
      roundRect(ctx, x, pillY, widths[i], 52, 26);
      ctx.stroke();
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(p.label, x + widths[i] / 2, pillY + 27);
      ctx.textBaseline = "alphabetic";
      x += widths[i] + gap;
    });
  }

  ctx.font = '400 22px "Poppins"';
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.textAlign = "center";
  ctx.fillText("Vercell — annonce automatique · shop-plus-nu.vercel.app", W / 2, H - 34);

  return canvas.encode("png");
}
