import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-Bd3tHH6h.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useAuth } from "./auth-DTdYFO5Z.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as CircleCheckBig, E as CircleX, S as Layers, T as Clock, m as Save, o as Trash2, v as Package, w as DollarSign } from "../_libs/lucide-react.mjs";
import { a as Header, f as getAllProducts } from "./products-BZFJVhtu.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-NqrtGpzw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminDashboard() {
	const { user, profile, loading: authLoading } = useAuth();
	useNavigate();
	const [activeTab, setActiveTab] = (0, import_react.useState)("orders");
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [stocks, setStocks] = (0, import_react.useState)({});
	const [loading, setLoading] = (0, import_react.useState)(true);
	const allProducts = getAllProducts();
	const loadOrders = async () => {
		setLoading(true);
		const { data: ordersData, error } = await supabase.from("orders").select("id,user_id,total,status,created_at,payment_ref,order_items(product_name,quantity,unit_price)").order("created_at", { ascending: false });
		if (!error && ordersData) {
			const userIds = [...new Set(ordersData.map((o) => o.user_id))];
			const { data: profilesData } = await supabase.from("profiles").select("id,email,username").in("id", userIds);
			const profilesMap = (profilesData || []).reduce((acc, p) => {
				acc[p.id] = p;
				return acc;
			}, {});
			setOrders(ordersData.map((o) => ({
				...o,
				profiles: profilesMap[o.user_id] || null
			})));
		}
		setLoading(false);
	};
	const loadStocks = async () => {
		const { data } = await supabase.from("product_stock").select("*");
		if (data) {
			const map = {};
			data.forEach((s) => map[s.product_id] = s);
			setStocks(map);
		}
	};
	(0, import_react.useEffect)(() => {
		if (profile?.role === "admin") {
			loadOrders();
			loadStocks();
		}
	}, [profile]);
	if (!authLoading && (!user || profile?.role !== "admin")) {
		const err = useAuth().profileError;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-screen flex flex-col items-center justify-center p-6 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-red-500 mb-4",
					children: "Accès Refusé"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground mb-2",
					children: "Vous n'avez pas les droits d'administrateur."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 bg-black/50 rounded-lg text-sm font-mono mt-4 text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Connecté en tant que : ", user ? user.email : "Non connecté"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Rôle détecté dans la base : ", profile?.role ? `"${profile.role}"` : "Aucun profil/rôle trouvé"] }),
						err && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-red-400 mt-2",
							children: ["Erreur Supabase Profile : ", err]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => window.location.reload(),
					className: "mt-6 px-4 py-2 bg-primary rounded-lg text-primary-foreground",
					children: "Rafraîchir la page"
				})
			]
		});
	}
	const updateStatus = async (id, status) => {
		setOrders((prev) => prev.map((o) => o.id === id ? {
			...o,
			status
		} : o));
		await supabase.from("orders").update({ status }).eq("id", id);
	};
	const deleteOrder = async (id) => {
		if (!window.confirm("Supprimer cette commande définitivement ?")) return;
		setOrders((prev) => prev.filter((o) => o.id !== id));
		await supabase.from("orders").delete().eq("id", id);
	};
	const saveStock = async (productId, newStock, isUnlimited) => {
		const { error } = await supabase.from("product_stock").upsert({
			product_id: productId,
			stock: newStock,
			is_unlimited: isUnlimited
		}, { onConflict: "product_id" });
		if (!error) {
			setStocks((prev) => ({
				...prev,
				[productId]: {
					product_id: productId,
					stock: newStock,
					is_unlimited: isUnlimited
				}
			}));
			toast.success("Stock mis à jour pour " + productId);
		} else toast.error("Erreur: " + error.message);
	};
	if (authLoading || loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center",
		children: "Chargement..."
	});
	const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
	const pendingCount = orders.filter((o) => o.status === "pending").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-7xl mx-auto px-6 py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400",
						children: "Panel Administrateur"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-sm",
						children: "Mode Super Admin"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4 mb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab("orders"),
						className: `px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === "orders" ? "bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]" : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { size: 20 }), "Commandes"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab("stocks"),
						className: `px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === "stocks" ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]" : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { size: 20 }), "Gestion des Stocks"]
					})]
				}),
				activeTab === "orders" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "glass rounded-2xl p-6 border-t-4 border-red-500 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground font-medium mb-1",
								children: "Chiffre d'affaires"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-3xl font-black",
								children: [totalRevenue.toFixed(2), "€"]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { size: 24 })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "glass rounded-2xl p-6 border-t-4 border-orange-500 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground font-medium mb-1",
								children: "Commandes totales"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl font-black",
								children: orders.length
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { size: 24 })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "glass rounded-2xl p-6 border-t-4 border-yellow-500 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground font-medium mb-1",
								children: "En attente"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl font-black",
								children: pendingCount
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { size: 24 })
							})]
						})
					]
				}) }),
				activeTab === "orders" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "glass rounded-2xl overflow-hidden border border-border/50",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-left border-collapse",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "bg-black/40 text-muted-foreground text-sm uppercase tracking-wider",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-4 font-semibold",
										children: "Date & ID"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-4 font-semibold",
										children: "Client (E-mail)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-4 font-semibold",
										children: "Produits"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-4 font-semibold",
										children: "Total"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-4 font-semibold",
										children: "Statut"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-4 font-semibold text-right",
										children: "Actions"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-border/50",
								children: orders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 6,
									className: "p-8 text-center text-muted-foreground",
									children: "Aucune commande trouvée."
								}) }) : orders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-white/5 transition-colors group",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "p-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium",
												children: o.created_at ? new Date(o.created_at).toLocaleDateString("fr-FR", {
													day: "2-digit",
													month: "short",
													hour: "2-digit",
													minute: "2-digit"
												}) : "Date inconnue"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs text-muted-foreground mt-1",
												children: ["#", o.id ? o.id.slice(0, 8) : "N/A"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "p-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-bold text-white/90",
												children: o.profiles?.email || "Email introuvable"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground",
												children: o.profiles?.username || "Anonyme"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
												className: "space-y-1 text-sm text-muted-foreground",
												children: o.order_items && Array.isArray(o.order_items) ? o.order_items.map((it, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-white/70",
														children: [it.quantity, "x"]
													}),
													" ",
													it.product_name
												] }, idx)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
													className: "text-red-400",
													children: "Erreur produits"
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "p-4 font-bold text-primary",
											children: [Number(o.total || 0).toFixed(2), "€"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${o.status === "pending" ? "bg-yellow-500/20 text-yellow-400" : o.status === "completed" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`,
												children: [
													o.status === "pending" && "En attente",
													o.status === "completed" && "Livré",
													o.status === "cancelled" && "Annulé"
												]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-4 text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity",
												children: [
													o.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => updateStatus(o.id, "completed"),
														title: "Marquer comme livré",
														className: "p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/40 transition",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { size: 16 })
													}),
													o.status !== "cancelled" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => updateStatus(o.id, "cancelled"),
														title: "Annuler la commande",
														className: "p-1.5 rounded-lg bg-orange-500/20 text-orange-400 hover:bg-orange-500/40 transition",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { size: 16 })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => deleteOrder(o.id),
														title: "Supprimer définitivement",
														className: "p-1.5 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/40 transition",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 16 })
													})
												]
											})
										})
									]
								}, o.id))
							})]
						})
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "glass rounded-2xl overflow-hidden border border-border/50",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-left border-collapse",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "bg-black/40 text-muted-foreground text-sm uppercase tracking-wider",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-4 font-semibold",
										children: "Produit"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-4 font-semibold",
										children: "Catégorie"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-4 font-semibold",
										children: "Prix"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-4 font-semibold text-center",
										children: "Type de Stock"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-4 font-semibold text-center",
										children: "Quantité"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-4 font-semibold text-right",
										children: "Action"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-border/50",
								children: allProducts.map((p) => {
									const stockInfo = stocks[p.id] || {
										is_unlimited: true,
										stock: 0
									};
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "hover:bg-white/5 transition-colors",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-4",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-sm",
														style: { backgroundColor: p.color },
														children: p.emoji
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-bold text-white/90",
														children: p.name
													}), p.subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-xs text-muted-foreground",
														children: p.subtitle
													})] })]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-4 text-muted-foreground text-sm",
												children: p.category
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "p-4 font-medium text-white/80",
												children: [p.price.toFixed(2), "€"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-4 text-center",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													className: "bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm font-medium focus:border-blue-500 outline-none",
													value: stockInfo.is_unlimited ? "unlimited" : "limited",
													onChange: (e) => {
														const isUnlim = e.target.value === "unlimited";
														setStocks((prev) => ({
															...prev,
															[p.id]: {
																product_id: p.id,
																is_unlimited: isUnlim,
																stock: stockInfo.stock
															}
														}));
													},
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "unlimited",
														children: "Illimité ♾️"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "limited",
														children: "Limité (Chiffre)"
													})]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-4 text-center",
												children: !stockInfo.is_unlimited ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													min: "0",
													className: "w-20 bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-center focus:border-blue-500 outline-none",
													value: stockInfo.stock,
													onChange: (e) => {
														setStocks((prev) => ({
															...prev,
															[p.id]: {
																product_id: p.id,
																is_unlimited: false,
																stock: parseInt(e.target.value) || 0
															}
														}));
													}
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: "-"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-4 text-right",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													onClick: () => saveStock(p.id, stockInfo.stock, stockInfo.is_unlimited),
													className: "inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-colors",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { size: 14 }), "Enregistrer"]
												})
											})
										]
									}, p.id);
								})
							})]
						})
					})
				})
			]
		})]
	});
}
//#endregion
export { AdminDashboard as component };
