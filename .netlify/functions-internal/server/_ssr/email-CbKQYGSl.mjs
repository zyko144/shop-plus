import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as Resend } from "../_libs/resend+standardwebhooks.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/email-CbKQYGSl.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var resendApiKey = process.env.RESEND_API_KEY;
var sendOrderEmail_createServerFn_handler = createServerRpc({
	id: "f22051109567e72214e4e36f0b3eab1f95b1b6a121a1aac116fab04d47a85846",
	name: "sendOrderEmail",
	filename: "src/lib/email.ts"
}, (opts) => sendOrderEmail.__executeServer(opts));
var sendOrderEmail = createServerFn({ method: "POST" }).validator((data) => data).handler(sendOrderEmail_createServerFn_handler, async ({ data }) => {
	if (!resendApiKey) {
		console.warn("No RESEND_API_KEY found, skipping email send.");
		return {
			success: false,
			error: "No API key configured."
		};
	}
	const resend = new Resend(resendApiKey);
	const itemsHtml = data.items.map((item) => `<li><strong>${item.quantity}x ${item.name}</strong> ${item.subtitle ? `(${item.subtitle})` : ""} - ${(item.price * item.quantity).toFixed(2)}€</li>`).join("");
	const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h1 style="color: #ff0033;">Merci pour votre commande ! 🎉</h1>
        <p>Bonjour,</p>
        <p>Nous avons bien reçu votre commande sur <strong>SHOP+</strong> pour un montant total de <strong>${data.total.toFixed(2)}€</strong>.</p>
        
        <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3>Récapitulatif de vos achats :</h3>
          <ul>
            ${itemsHtml}
          </ul>
        </div>

        <div style="border-left: 4px solid #5865f2; padding-left: 15px; margin: 30px 0;">
          <h2 style="color: #5865f2; margin-top: 0;">Comment récupérer votre commande ?</h2>
          <p>Pour recevoir vos accès ou votre produit, veuillez ouvrir un ticket sur notre serveur Discord en cliquant sur le lien ci-dessous :</p>
          <a href="https://discord.gg/8RBgw6ykQK" style="display: inline-block; background-color: #5865f2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">
            Ouvrir un ticket Discord
          </a>
        </div>

        <p>À très vite,<br>L'équipe SHOP+</p>
      </div>
    `;
	try {
		const { data: responseData, error } = await resend.emails.send({
			from: "SHOP+ <commandes@resend.dev>",
			to: data.email,
			subject: "Votre commande SHOP+ - Récupérez votre produit !",
			html: htmlBody
		});
		if (error) {
			console.error("Resend API Error:", error);
			return {
				success: false,
				error: error.message
			};
		}
		return {
			success: true,
			data: responseData
		};
	} catch (e) {
		console.error("Failed to send email:", e);
		return {
			success: false,
			error: e.message
		};
	}
});
//#endregion
export { sendOrderEmail_createServerFn_handler };
