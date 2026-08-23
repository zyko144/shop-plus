import { createServerFn } from "@tanstack/react-start";
import { renderAnnouncementCard } from "./announcementCard";

const webhookUrl = process.env.DISCORD_ORDERS_WEBHOOK_URL;
const avisWebhookUrl = process.env.DISCORD_AVIS_WEBHOOK_URL;
const annoncesWebhookUrl = process.env.DISCORD_ANNONCES_WEBHOOK_URL;

type OrderNotificationInput = {
  email: string;
  items: { name: string; quantity: number; price: number; subtitle?: string }[];
  total: number;
};

async function postWebhook(url: string | undefined, payload: unknown, label: string) {
  if (!url) {
    console.warn(`No ${label} webhook configured, skipping Discord notification.`);
    return { success: false, error: "No webhook configured." };
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error(`Discord ${label} webhook error:`, res.status, await res.text());
      return { success: false, error: `Discord ${res.status}` };
    }
    return { success: true };
  } catch (e: any) {
    console.error(`Discord ${label} webhook fetch failed:`, e);
    return { success: false, error: e.message };
  }
}

/** Meme chose que postWebhook mais avec un fichier joint (carte PNG) en
 * multipart, requis par l'API Discord pour les pieces jointes. */
async function postWebhookWithFile(url: string | undefined, payload: unknown, file: Buffer, filename: string, label: string) {
  if (!url) {
    console.warn(`No ${label} webhook configured, skipping Discord notification.`);
    return { success: false, error: "No webhook configured." };
  }
  try {
    const form = new FormData();
    form.append("payload_json", JSON.stringify(payload));
    form.append("files[0]", new Blob([file], { type: "image/png" }), filename);
    const res = await fetch(url, { method: "POST", body: form });
    if (!res.ok) {
      console.error(`Discord ${label} webhook (file) error:`, res.status, await res.text());
      return { success: false, error: `Discord ${res.status}` };
    }
    return { success: true };
  } catch (e: any) {
    console.error(`Discord ${label} webhook (file) fetch failed:`, e);
    return { success: false, error: e.message };
  }
}

export const notifyDiscordOrder = createServerFn({ method: "POST" })
  .validator((data: OrderNotificationInput) => data)
  .handler(async ({ data }) => {
    const lines = data.items.map(
      (item) => `${item.quantity}x **${item.name}**${item.subtitle ? ` (${item.subtitle})` : ""} — ${(item.price * item.quantity).toFixed(2)}€`
    );

    const embed = {
      title: "🛒 Nouvelle commande Vercell",
      color: 0xffffff,
      fields: [
        { name: "Client", value: data.email, inline: true },
        { name: "Total", value: `${data.total.toFixed(2)}€`, inline: true },
        { name: "Produits", value: lines.join("\n").slice(0, 1024) || "—" },
      ],
      timestamp: new Date().toISOString(),
    };

    return postWebhook(webhookUrl, { embeds: [embed] }, "orders");
  });

/** Reproduit la resolution de logo de ProductCard.tsx, toujours en blanc
 * pour coller au theme noir/blanc des embeds Discord. */
function resolveLogoUrl(logo?: string | null): string | undefined {
  if (!logo) return undefined;
  if (logo.startsWith("http")) return logo;
  if (logo.startsWith("/")) return `https://shop-plus-nu.vercel.app${logo}`;
  return `https://cdn.simpleicons.org/${logo}/ffffff`;
}

type ReviewNotificationInput = {
  username: string;
  avatarUrl?: string;
  productName: string;
  rating: number;
  comment: string;
  productLogo?: string | null;
  screenshotUrl?: string;
};

export const notifyDiscordReview = createServerFn({ method: "POST" })
  .validator((data: ReviewNotificationInput) => data)
  .handler(async ({ data }) => {
    const stars = "★".repeat(data.rating) + "☆".repeat(5 - data.rating);
    const logoUrl = resolveLogoUrl(data.productLogo);

    const embed = {
      title: "⭐ Nouvel avis vérifié",
      color: 0xffffff,
      author: { name: data.username, icon_url: data.avatarUrl },
      fields: [
        { name: "Produit", value: data.productName, inline: true },
        { name: "Note", value: stars, inline: true },
        { name: "Avis", value: data.comment.slice(0, 1024) || "—" },
      ],
      ...(logoUrl ? { thumbnail: { url: logoUrl } } : {}),
      ...(data.screenshotUrl ? { image: { url: data.screenshotUrl } } : {}),
      footer: { text: "Vercell — avis client vérifié (compte Discord lié)" },
      timestamp: new Date().toISOString(),
    };

    return postWebhook(avisWebhookUrl, { embeds: [embed] }, "avis");
  });

type AnnouncementBase = { name: string; category?: string; price?: number; stock?: string; logo?: string | null; imageUrl?: string | null };
type AnnouncementInput =
  | (AnnouncementBase & { type: "new_product"; price: number; category: string })
  | (AnnouncementBase & { type: "price_change"; oldPrice: number; newPrice: number })
  | (AnnouncementBase & { type: "product_removed" })
  | (AnnouncementBase & { type: "out_of_stock" })
  | (AnnouncementBase & { type: "back_in_stock" });

const SHOP_LINK_FIELD = { name: "🔗 Boutique", value: "[shop-plus-nu.vercel.app](https://shop-plus-nu.vercel.app/)" };

function buildAnnouncementEmbed(data: AnnouncementInput) {
  const logoUrl = resolveLogoUrl(data.logo);
  const base = {
    color: 0xffffff,
    footer: { text: "Vercell — annonce automatique" },
    timestamp: new Date().toISOString(),
    // Grande image produit/categorie si dispo, sinon petit logo de marque en vignette.
    ...(data.imageUrl ? { image: { url: data.imageUrl } } : logoUrl ? { thumbnail: { url: logoUrl } } : {}),
  };
  // Contexte produit commun (categorie/prix/stock), affiche quand dispo pour tous les types.
  const contextFields = [
    ...(data.category ? [{ name: "Catégorie", value: data.category, inline: true }] : []),
    ...(typeof data.price === "number" ? [{ name: "Prix", value: `${data.price.toFixed(2)}€`, inline: true }] : []),
    ...(data.stock ? [{ name: "Stock", value: data.stock, inline: true }] : []),
  ];

  switch (data.type) {
    case "new_product":
      return {
        ...base,
        title: "🆕 Nouveau produit disponible !",
        description: `**${data.name}** vient d'arriver sur la boutique.`,
        fields: [
          { name: "Prix", value: `${data.price.toFixed(2)}€`, inline: true },
          { name: "Catégorie", value: data.category, inline: true },
          SHOP_LINK_FIELD,
        ],
      };
    case "price_change":
      return {
        ...base,
        title: "💰 Prix mis à jour",
        description: `**${data.name}**`,
        fields: [
          ...contextFields.filter((f) => f.name === "Catégorie"),
          { name: "Ancien prix", value: `~~${data.oldPrice.toFixed(2)}€~~`, inline: true },
          { name: "Nouveau prix", value: `${data.newPrice.toFixed(2)}€`, inline: true },
          SHOP_LINK_FIELD,
        ],
      };
    case "product_removed":
      return {
        ...base,
        title: "🗑️ Produit retiré de la boutique",
        description: `**${data.name}** n'est plus proposé à la vente.`,
        fields: contextFields,
      };
    case "out_of_stock":
      return {
        ...base,
        title: "❌ Rupture de stock",
        description: `**${data.name}** vient de partir en rupture de stock !`,
        fields: [...contextFields, SHOP_LINK_FIELD],
      };
    case "back_in_stock":
      return {
        ...base,
        title: "✅ De nouveau en stock !",
        description: `**${data.name}** est de nouveau disponible, file vite le chercher avant que ça reparte !`,
        fields: [...contextFields, SHOP_LINK_FIELD],
      };
  }
}

const ANNOUNCEMENT_TITLES: Record<AnnouncementInput["type"], string> = {
  new_product: "🆕 Nouveau produit disponible !",
  price_change: "💰 Prix mis à jour",
  product_removed: "🗑️ Produit retiré de la boutique",
  out_of_stock: "❌ Rupture de stock",
  back_in_stock: "✅ De nouveau en stock !",
};
const ANNOUNCEMENT_BADGES: Record<AnnouncementInput["type"], string> = {
  new_product: "NOUVEAU PRODUIT",
  price_change: "PRIX MIS À JOUR",
  product_removed: "PRODUIT RETIRÉ",
  out_of_stock: "RUPTURE DE STOCK",
  back_in_stock: "DE NOUVEAU EN STOCK",
};

function cardPrice(data: AnnouncementInput): string | undefined {
  if (data.type === "price_change") return `${data.oldPrice.toFixed(2)}€ → ${data.newPrice.toFixed(2)}€`;
  return typeof data.price === "number" ? `${data.price.toFixed(2)}€` : undefined;
}

export const notifyDiscordAnnouncement = createServerFn({ method: "POST" })
  .validator((data: AnnouncementInput) => data)
  .handler(async ({ data }) => {
    try {
      const png = await renderAnnouncementCard({
        badge: ANNOUNCEMENT_BADGES[data.type],
        name: data.name,
        category: data.category,
        price: cardPrice(data),
        stock: data.stock,
        imageUrl: data.imageUrl,
      });
      const embed = {
        title: ANNOUNCEMENT_TITLES[data.type],
        color: 0xffffff,
        image: { url: "attachment://annonce.png" },
        footer: { text: "Vercell — annonce automatique · shop-plus-nu.vercel.app" },
        timestamp: new Date().toISOString(),
      };
      return postWebhookWithFile(annoncesWebhookUrl, { embeds: [embed] }, png, "annonce.png", "annonces");
    } catch (e) {
      // La carte PNG est un bonus visuel : si son rendu echoue pour une raison
      // quelconque (police, image produit inaccessible...), l'annonce part
      // quand meme sous forme d'embed texte classique plutot que de ne rien envoyer.
      console.error("Rendu carte annonce echoue, repli sur embed texte:", e);
      return postWebhook(annoncesWebhookUrl, { embeds: [buildAnnouncementEmbed(data)] }, "annonces");
    }
  });
