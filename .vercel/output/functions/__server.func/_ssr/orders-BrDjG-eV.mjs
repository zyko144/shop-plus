import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-Bd3tHH6h.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useAuth } from "./auth-DTdYFO5Z.mjs";
import { _ as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as X } from "../_libs/lucide-react.mjs";
import { a as Header } from "./products-BZFJVhtu.mjs";
import { t as CartDrawer } from "./CartDrawer-DAPXMlkF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-BrDjG-eV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KEY = "zyko_reviews_v1";
function readAll() {
	if (typeof window === "undefined") return {};
	try {
		return JSON.parse(localStorage.getItem(KEY) || "{}");
	} catch {
		return {};
	}
}
function writeAll(s) {
	localStorage.setItem(KEY, JSON.stringify(s));
}
function OrderReview({ orderId, createdAt }) {
	const [all, setAll] = (0, import_react.useState)({});
	const [hover, setHover] = (0, import_react.useState)(0);
	const [comment, setComment] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		setAll(readAll());
	}, []);
	(0, import_react.useEffect)(() => {
		const t = setInterval(() => {
			const current = readAll();
			if (current[orderId]) return;
			if (Date.now() - new Date(createdAt).getTime() >= 7200 * 1e3) {
				current[orderId] = {
					rating: 5,
					comment: "",
					auto: true,
					at: Date.now()
				};
				writeAll(current);
				setAll(current);
			}
		}, 3e4);
		return () => clearInterval(t);
	}, [orderId, createdAt]);
	const existing = all[orderId];
	const submit = (rating) => {
		const next = {
			...readAll(),
			[orderId]: {
				rating,
				comment,
				at: Date.now()
			}
		};
		writeAll(next);
		setAll(next);
	};
	if (existing) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 border-t border-border pt-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: "Votre avis :"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, { value: existing.rating }),
				existing.auto && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: "(automatique)"
				})
			]
		}), existing.comment && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm mt-1 text-muted-foreground italic",
			children: [
				"« ",
				existing.comment,
				" »"
			]
		})]
	});
	const msLeft = 7200 * 1e3 - (Date.now() - new Date(createdAt).getTime());
	const hoursLeft = Math.max(0, Math.ceil(msLeft / (3600 * 1e3)));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 border-t border-border pt-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm mb-2",
				children: "Laissez votre avis :"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-1 mb-2",
				children: [
					1,
					2,
					3,
					4,
					5
				].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onMouseEnter: () => setHover(n),
					onMouseLeave: () => setHover(0),
					onClick: () => submit(n),
					className: "text-2xl transition-transform hover:scale-110",
					"aria-label": `${n} étoile${n > 1 ? "s" : ""}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: n <= hover ? "text-yellow-400" : "text-muted-foreground",
						children: "★"
					})
				}, n))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: comment,
				onChange: (e) => setComment(e.target.value),
				placeholder: "Un commentaire ? (optionnel)",
				className: "w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[11px] text-muted-foreground mt-1",
				children: [
					"Sans réponse, un avis 5★ automatique sera ajouté dans ~",
					hoursLeft,
					"h."
				]
			})
		]
	});
}
function Stars({ value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: [
		1,
		2,
		3,
		4,
		5
	].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: n <= value ? "text-yellow-400" : "text-muted-foreground/40",
		children: "★"
	}, n)) });
}
function OrdersPage() {
	const { user, loading: authLoading } = useAuth();
	const navigate = useNavigate();
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (!authLoading && !user) navigate({ to: "/auth" });
	}, [
		authLoading,
		user,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		supabase.from("orders").select("id,total,status,created_at,order_items(product_name,quantity,unit_price,category)").order("created_at", { ascending: false }).then(({ data }) => {
			setOrders(data ?? []);
			setLoading(false);
		});
	}, [user]);
	const deleteOrder = async (id) => {
		setOrders((prev) => prev.filter((o) => o.id !== id));
		await supabase.from("orders").delete().eq("id", id);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartDrawer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-4xl mx-auto px-6 py-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-4xl font-black mb-8",
						children: "Mes commandes"
					}),
					loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: "Chargement..."
					}),
					!loading && orders.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass rounded-2xl p-10 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground mb-4",
							children: "Aucune commande pour l'instant."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "inline-block px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium",
							children: "Voir la boutique"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-4",
						children: orders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "glass rounded-2xl p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-3 mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground",
										children: ["Commande #", o.id.slice(0, 8)]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm",
										children: new Date(o.created_at).toLocaleString("fr-FR")
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `px-3 py-1 rounded-full text-xs font-medium ${o.status === "pending" ? "bg-yellow-500/20 text-yellow-300" : "bg-green-500/20 text-green-300"}`,
												children: o.status === "pending" ? "En attente paiement" : o.status
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-bold text-lg text-primary",
												children: [Number(o.total).toFixed(2), "€"]
											}),
											o.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => deleteOrder(o.id),
												className: "p-1 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/30 transition-colors",
												title: "Annuler la commande",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 16 })
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-1 text-sm",
									children: o.order_items.map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex justify-between border-t border-border pt-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											it.quantity,
											"× ",
											it.product_name,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-muted-foreground text-xs",
												children: [
													"(",
													it.category,
													")"
												]
											})
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [(it.quantity * Number(it.unit_price)).toFixed(2), "€"] })]
									}, i))
								}),
								o.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: `https://paypal.me/zyko921/${Number(o.total).toFixed(2)}EUR`,
									target: "_blank",
									className: "mt-3 inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 text-black text-sm font-bold",
									children: "Payer maintenant"
								}),
								o.status !== "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderReview, {
									orderId: o.id,
									createdAt: o.created_at
								})
							]
						}, o.id))
					})
				]
			})
		]
	});
}
//#endregion
export { OrdersPage as component };
