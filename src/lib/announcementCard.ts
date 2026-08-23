export type AnnouncementCardData = {
  /** Texte sans emoji : la police du bot n'a pas de glyphes emoji (rendus en carre casse), l'emoji reste dans le titre du message Discord a cote. */
  badge: string; // ex: "RUPTURE DE STOCK"
  name: string;
  category?: string;
  price?: string; // deja formate, ex "4.99€" ou "4.99€ → 3.99€"
  stock?: string;
  imageUrl?: string | null;
};

const BOT_URL = process.env.BOT_INTERNAL_URL || "https://streamin.onrender.com";
const INTERNAL_SECRET = process.env.INTERNAL_SECRET;

/** Genere la carte PNG d'annonce via le bot Discord plutot qu'en local :
 * @napi-rs/canvas (binaire natif par plateforme) ne survit pas au bundler
 * de la fonction serveur du site (teste : soit le build plante en essayant
 * de l'inliner, soit le fichier natif n'est jamais copie dans le
 * deploiement selon la config testee). Le bot fait deja tourner exactement
 * la meme librairie sans probleme (process Node classique, pas de
 * bundler), donc le site lui delegue simplement le rendu. */
export async function renderAnnouncementCard(data: AnnouncementCardData): Promise<Buffer> {
  if (!INTERNAL_SECRET) throw new Error("INTERNAL_SECRET non configuré côté site.");
  const res = await fetch(`${BOT_URL}/internal/announcement-card`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-internal-secret": INTERNAL_SECRET },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Rendu carte via le bot échoué : ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}
