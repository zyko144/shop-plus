import { createServerFn } from "@tanstack/react-start";

const webhookUrl = process.env.DISCORD_ORDERS_WEBHOOK_URL;

type OrderNotificationInput = {
  email: string;
  items: { name: string; quantity: number; price: number; subtitle?: string }[];
  total: number;
};

export const notifyDiscordOrder = createServerFn({ method: "POST" })
  .validator((data: OrderNotificationInput) => data)
  .handler(async ({ data }) => {
    if (!webhookUrl) {
      console.warn("No DISCORD_ORDERS_WEBHOOK_URL found, skipping Discord notification.");
      return { success: false, error: "No webhook configured." };
    }

    const lines = data.items.map(
      (item) => `${item.quantity}x **${item.name}**${item.subtitle ? ` (${item.subtitle})` : ""} — ${(item.price * item.quantity).toFixed(2)}€`
    );

    const embed = {
      title: "🛒 Nouvelle commande Vercell",
      color: 0xff2d2d,
      fields: [
        { name: "Client", value: data.email, inline: true },
        { name: "Total", value: `${data.total.toFixed(2)}€`, inline: true },
        { name: "Produits", value: lines.join("\n").slice(0, 1024) || "—" },
      ],
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ embeds: [embed] }),
      });
      if (!res.ok) {
        console.error("Discord webhook error:", res.status, await res.text());
        return { success: false, error: `Discord ${res.status}` };
      }
      return { success: true };
    } catch (e: any) {
      console.error("Discord webhook fetch failed:", e);
      return { success: false, error: e.message };
    }
  });
