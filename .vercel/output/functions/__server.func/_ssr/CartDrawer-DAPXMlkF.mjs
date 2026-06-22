import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-Bd3tHH6h.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useAuth } from "./auth-DTdYFO5Z.mjs";
import { n as useCart } from "./cart-1SO8M5j5.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as Plus, n as X, o as Trash2, y as Minus } from "../_libs/lucide-react.mjs";
import { o as PAYPAL_URL } from "./products-BZFJVhtu.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-BhD5rl2D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CartDrawer-DAPXMlkF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var sendOrderEmail = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("f22051109567e72214e4e36f0b3eab1f95b1b6a121a1aac116fab04d47a85846"));
function CartDrawer() {
	const { items, open, setOpen, setQty, remove, total, clear } = useCart();
	const { user } = useAuth();
	const navigate = useNavigate();
	const [loading, setLoading] = (0, import_react.useState)(false);
	const checkout = async () => {
		if (!user) {
			toast.error("Connecte-toi pour commander");
			setOpen(false);
			navigate({ to: "/auth" });
			return;
		}
		if (items.length === 0) return;
		setLoading(true);
		try {
			const { data: order, error } = await supabase.from("orders").insert({
				user_id: user.id,
				total,
				status: "pending",
				payment_ref: "paypal:zyko921"
			}).select().single();
			if (error) throw error;
			const { error: itemsErr } = await supabase.from("order_items").insert(items.map((i) => ({
				order_id: order.id,
				product_id: i.id,
				product_name: i.name + (i.subtitle ? ` (${i.subtitle})` : ""),
				category: i.category,
				unit_price: i.price,
				quantity: i.quantity
			})));
			if (itemsErr) throw itemsErr;
			if (user.email) sendOrderEmail({ data: {
				email: user.email,
				items,
				total
			} }).catch((e) => console.error("Email send error:", e));
			clear();
			setOpen(false);
			toast.success("Commande enregistrée ! Un email t'a été envoyé. PayPal s'ouvre — ensuite ouvre un ticket Discord pour ton produit.", { duration: 8e3 });
			window.open(`${PAYPAL_URL}/${total.toFixed(2)}EUR`, "_blank");
			window.open("https://discord.gg/8RBgw6ykQK", "_blank");
			navigate({ to: "/orders" });
		} catch (e) {
			toast.error(e.message ?? "Erreur");
		} finally {
			setLoading(false);
		}
	};
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[100]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 bg-black/70 backdrop-blur-sm",
			onClick: () => setOpen(false)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "absolute right-0 top-0 h-full w-full max-w-md glass border-l border-border flex flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 flex items-center justify-between border-b border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-bold text-lg",
						children: [
							"Panier (",
							items.length,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setOpen(false),
						className: "p-2 rounded hover:bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 overflow-y-auto p-4 space-y-3",
					children: [items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground text-center py-12",
						children: "Ton panier est vide"
					}), items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-3 p-3 rounded-xl glass",
						style: { borderLeft: `3px solid ${i.color}` },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-12 h-12 rounded-lg grid place-items-center text-xl",
								style: { background: `${i.color}33` },
								children: i.emoji
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium text-sm truncate",
										children: i.name
									}),
									i.subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: i.subtitle
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-sm font-bold mt-1",
										style: { color: i.color },
										children: [(i.price * i.quantity).toFixed(2), "€"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-end gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => remove(i.id),
									className: "text-muted-foreground hover:text-destructive",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 14 })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1 bg-muted rounded",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setQty(i.id, i.quantity - 1),
											className: "p-1",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { size: 12 })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs w-5 text-center",
											children: i.quantity
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setQty(i.id, i.quantity + 1),
											className: "p-1",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 12 })
										})
									]
								})]
							})
						]
					}, i.id))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 border-t border-border space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-lg font-bold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-primary",
								children: [total.toFixed(2), "€"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: checkout,
							disabled: loading || items.length === 0,
							className: "w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-black font-bold disabled:opacity-50 hover:scale-[1.02] transition",
							children: loading ? "..." : "Payer via PayPal"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "https://discord.gg/UUBFjjCp",
							target: "_blank",
							rel: "noreferrer",
							className: "w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-white transition hover:scale-[1.02]",
							style: { background: "linear-gradient(135deg,#dc2626,#991b1b)" },
							children: "🎫 Ouvrir un ticket Discord"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-center text-muted-foreground",
							children: "Paiement : paypal.me/zyko921 — Livraison via ticket Discord après paiement"
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { CartDrawer as t };
