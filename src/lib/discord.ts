import { createServerFn } from "@tanstack/react-start";

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

type AnnouncementInput =
  | { type: "new_product"; name: string; price: number; category: string; logo?: string | null }
  | { type: "price_change"; name: string; oldPrice: number; newPrice: number; logo?: string | null }
  | { type: "product_removed"; name: string; logo?: string | null }
  | { type: "out_of_stock"; name: string; logo?: string | null }
  | { type: "back_in_stock"; name: string; logo?: string | null };

function buildAnnouncementEmbed(data: AnnouncementInput) {
  const logoUrl = resolveLogoUrl(data.logo);
  const base = {
    color: 0xffffff,
    footer: { text: "Vercell — https://shop-plus-nu.vercel.app/" },
    timestamp: new Date().toISOString(),
    ...(logoUrl ? { thumbnail: { url: logoUrl } } : {}),
  };

  switch (data.type) {
    case "new_product":
      return {
        ...base,
        title: "🆕 Nouveau produit disponible",
        description: `**${data.name}**`,
        fields: [
          { name: "Prix", value: `${data.price.toFixed(2)}€`, inline: true },
          { name: "Catégorie", value: data.category, inline: true },
        ],
      };
    case "price_change":
      return {
        ...base,
        title: "💰 Prix mis à jour",
        description: `**${data.name}**`,
        fields: [
          { name: "Ancien prix", value: `~~${data.oldPrice.toFixed(2)}€~~`, inline: true },
          { name: "Nouveau prix", value: `${data.newPrice.toFixed(2)}€`, inline: true },
        ],
      };
    case "product_removed":
      return { ...base, title: "🗑️ Produit retiré de la boutique", description: `**${data.name}** n'est plus proposé à la vente.` };
    case "out_of_stock":
      return { ...base, title: "❌ Rupture de stock", description: `**${data.name}** n'est plus disponible pour le moment.` };
    case "back_in_stock":
      return { ...base, title: "✅ De nouveau en stock", description: `**${data.name}** est de nouveau disponible !` };
  }
}

export const notifyDiscordAnnouncement = createServerFn({ method: "POST" })
  .validator((data: AnnouncementInput) => data)
  .handler(async ({ data }) => {
    return postWebhook(annoncesWebhookUrl, { embeds: [buildAnnouncementEmbed(data)] }, "annonces");
  });
