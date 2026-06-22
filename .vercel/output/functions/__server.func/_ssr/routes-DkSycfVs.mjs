import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-Bd3tHH6h.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useCart } from "./cart-1SO8M5j5.mjs";
import { O as Check, c as Sparkles, f as ShieldCheck, h as Plus, p as Search, t as Zap, u as ShoppingBag } from "../_libs/lucide-react.mjs";
import { a as Header, c as STREAMING, d as VPN, i as FORTNITE_RARE, l as TWITCH, n as DISCORD_DECO, r as FORTNITE_CLASSIC, s as STEAM_CATEGORIES, t as CATEGORY_IMAGES, u as VBUCKS } from "./products-BZFJVhtu.mjs";
import { t as CartDrawer } from "./CartDrawer-DAPXMlkF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DkSycfVs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function hex(c) {
	return c.replace("#", "");
}
function ProductCard3D({ product, stockInfo = {
	is_unlimited: true,
	stock: 0
} }) {
	const { add } = useCart();
	const [hover, setHover] = (0, import_react.useState)(false);
	const [added, setAdded] = (0, import_react.useState)(false);
	const bgImg = product.image ?? CATEGORY_IMAGES[product.category];
	const logoUrl = product.logo ? product.logo.startsWith("http") ? product.logo : `https://cdn.simpleicons.org/${product.logo}/${hex(product.color)}` : null;
	const isOutOfStock = !stockInfo.is_unlimited && stockInfo.stock <= 0;
	function handleAdd() {
		if (isOutOfStock) return;
		add(product);
		setAdded(true);
		setTimeout(() => setAdded(false), 1200);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		onMouseEnter: () => setHover(true),
		onMouseLeave: () => setHover(false),
		className: `group relative rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 bg-card border border-white/5 ${isOutOfStock ? "opacity-75 grayscale" : ""}`,
		style: { boxShadow: hover && !isOutOfStock ? `0 30px 80px -20px ${product.color}80, 0 0 0 1px ${product.color}55 inset` : `0 10px 40px -15px #000` },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative h-64 overflow-hidden",
			style: { background: `radial-gradient(circle at 50% 50%, ${product.color}33, #000 75%)` },
			children: [
				bgImg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: bgImg,
					alt: "",
					loading: "lazy",
					className: "absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-screen"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 transition-opacity duration-500",
					style: {
						background: `radial-gradient(circle at 50% 55%, ${product.color}66, transparent 60%)`,
						opacity: hover && !isOutOfStock ? .9 : .55
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 grid place-items-center p-8",
					children: logoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: logoUrl,
						alt: product.name,
						loading: "lazy",
						className: "max-h-28 max-w-[60%] object-contain transition-transform duration-500 group-hover:scale-110",
						style: { filter: `drop-shadow(0 0 24px ${product.color}cc)` },
						onError: (e) => {
							e.currentTarget.style.display = "none";
						}
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-7xl font-black tracking-tighter transition-transform duration-500 group-hover:scale-110",
						style: {
							color: product.color,
							textShadow: `0 0 40px ${product.color}`
						},
						children: product.emoji
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-card to-transparent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md border",
					style: {
						background: `${product.color}22`,
						color: product.color,
						borderColor: `${product.color}55`
					},
					children: product.category
				}),
				!stockInfo.is_unlimited && stockInfo.stock > 0 && stockInfo.stock <= 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500 text-white shadow-lg shadow-orange-500/50",
					children: [
						"Plus que ",
						stockInfo.stock,
						" !"
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-5 space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-bold text-lg leading-tight",
				children: product.name
			}), product.subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground mt-1",
				children: product.subtitle
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] uppercase tracking-wider text-muted-foreground",
					children: "À partir de"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-2xl font-black",
					style: {
						color: isOutOfStock ? "#666" : product.color,
						textShadow: isOutOfStock ? "none" : `0 0 24px ${product.color}90`
					},
					children: [product.price.toFixed(2), "€"]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: handleAdd,
					disabled: isOutOfStock,
					className: `shrink-0 px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${isOutOfStock ? "cursor-not-allowed" : "hover:scale-105 active:scale-95"}`,
					style: {
						background: isOutOfStock ? "#333" : product.color,
						color: isOutOfStock ? "#888" : "#000",
						boxShadow: isOutOfStock ? "none" : `0 8px 24px ${product.color}66`
					},
					"aria-label": "Ajouter au panier",
					children: isOutOfStock ? "Rupture" : added ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 16 }), " Ajouté"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 16 }), " Panier"] })
				})]
			})]
		})]
	});
}
function slug(s) {
	return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function GameCard({ game, color, emoji, category }) {
	const { add } = useCart();
	const [added, setAdded] = (0, import_react.useState)(false);
	const product = {
		id: `steam-${slug(game)}`,
		name: `Compte Steam — ${game}`,
		subtitle: category,
		price: 1,
		category: "Steam",
		color,
		emoji
	};
	function handleAdd() {
		add(product);
		setAdded(true);
		setTimeout(() => setAdded(false), 1200);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group glass rounded-2xl p-4 transition-all hover:-translate-y-1",
		style: {
			borderLeft: `3px solid ${color}`,
			boxShadow: `0 4px 20px ${color}22`
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3 mb-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-[10px] uppercase tracking-wider font-semibold",
					style: { color },
					children: [emoji, " Jeu Steam"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-bold text-base leading-tight mt-1 truncate",
					children: game
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-3xl shrink-0 transition-transform group-hover:scale-110",
				style: { filter: `drop-shadow(0 0 12px ${color})` },
				children: emoji
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px] uppercase tracking-wider text-muted-foreground",
				children: "Prix"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xl font-black",
				style: {
					color,
					textShadow: `0 0 16px ${color}90`
				},
				children: "1,00€"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: handleAdd,
				className: "shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5",
				style: {
					background: color,
					color: "#000",
					boxShadow: `0 6px 18px ${color}66`
				},
				"aria-label": `Ajouter ${game} au panier`,
				children: added ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 14 }), " Ajouté"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 14 }), " Panier"] })
			})]
		})]
	});
}
function SteamMenu() {
	const [active, setActive] = (0, import_react.useState)(0);
	const [query, setQuery] = (0, import_react.useState)("");
	const cat = STEAM_CATEGORIES[active];
	const filtered = (0, import_react.useMemo)(() => {
		if (!query.trim()) return cat.games;
		const q = query.toLowerCase();
		return cat.games.filter((g) => g.toLowerCase().includes(q));
	}, [cat, query]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative overflow-hidden rounded-2xl p-5 border border-white/5",
				style: { background: `linear-gradient(135deg, ${cat.color}22, transparent 70%), var(--color-card)` },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-3xl",
						style: { filter: `drop-shadow(0 0 16px ${cat.color})` },
						children: "🎮"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-wider font-bold",
						style: { color: cat.color },
						children: "Comptes Steam"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-bold",
						children: [
							"Tous les jeux à ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								style: { color: cat.color },
								children: "1€"
							}),
							" — choisissez et ajoutez au panier"
						]
					})] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: STEAM_CATEGORIES.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						setActive(i);
						setQuery("");
					},
					className: `px-4 py-2 rounded-xl text-sm font-medium transition-all ${active === i ? "scale-105" : "opacity-60 hover:opacity-100"}`,
					style: {
						background: active === i ? c.color : `${c.color}22`,
						color: active === i ? "#000" : c.color,
						boxShadow: active === i ? `0 8px 24px ${c.color}66` : "none"
					},
					children: [
						c.emoji,
						" ",
						c.name
					]
				}, c.name))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
					size: 16,
					className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: `Rechercher dans ${cat.name}…`,
					className: "w-full pl-9 pr-3 py-2.5 rounded-xl bg-background/60 border border-border text-sm focus:outline-none focus:ring-2",
					style: { ["--tw-ring-color"]: cat.color }
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4",
				children: filtered.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameCard, {
					game: g,
					color: cat.color,
					emoji: cat.emoji,
					category: cat.name
				}, g))
			}),
			filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center py-12 text-muted-foreground",
				children: [
					"Aucun jeu trouvé pour \"",
					query,
					"\""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground text-center",
				children: "⚠ Les comptes fournis possèdent souvent d'AUTRES JEUX bonus déjà inclus. Pour une commande sur mesure (Epic, Valorant…) contactez via ticket."
			})
		]
	});
}
function CategorySidebar({ cats, active, onSelect }) {
	const [stuck, setStuck] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const onScroll = () => setStuck(window.scrollY > 100);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "lg:sticky lg:top-20 lg:self-start",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass rounded-2xl p-3 lg:p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-2 pb-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-bold",
				children: "Catégories"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible no-scrollbar",
				children: cats.map((c) => {
					const isActive = c.id === active;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => onSelect(c.id),
						className: `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap lg:w-full ${isActive ? "text-white" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`,
						style: isActive ? {
							background: `linear-gradient(90deg, ${c.color}22, transparent)`,
							boxShadow: `inset 0 0 0 1px ${c.color}55`
						} : void 0,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid place-items-center w-8 h-8 rounded-lg text-base shrink-0",
								style: {
									background: isActive ? c.color : `${c.color}1a`,
									color: isActive ? "#000" : c.color,
									boxShadow: isActive ? `0 0 16px ${c.color}80` : void 0
								},
								children: c.emoji
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex-1 text-left",
								children: c.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] opacity-60 tabular-nums",
								children: c.count
							})
						]
					}, c.id);
				})
			})]
		}), stuck && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hidden lg:block mt-3 text-[10px] text-muted-foreground px-2",
			children: "⚡ Paiement PayPal sécurisé"
		})]
	});
}
var hero_bg_default = "/assets/hero-bg-mj13ePX0.jpg";
var GROUPS = [
	{
		id: "streaming",
		label: "Streaming",
		emoji: "📺",
		color: "#ff0033",
		items: STREAMING,
		description: "Films, séries, musique — vos plateformes préférées dès 1€."
	},
	{
		id: "vpn",
		label: "VPN",
		emoji: "🛡",
		color: "#4687ff",
		items: VPN,
		description: "Navigation sécurisée, débridez tout le web."
	},
	{
		id: "twitch",
		label: "Twitch",
		emoji: "💜",
		color: "#9146ff",
		items: TWITCH,
		description: "Boostez votre chaîne avec de vrais followers."
	},
	{
		id: "fortnite",
		label: "Fortnite",
		emoji: "🎯",
		color: "#00d2ff",
		items: FORTNITE_CLASSIC,
		description: "Comptes Fortnite aléatoires avec skins inclus."
	},
	{
		id: "rare",
		label: "Skins Rares",
		emoji: "👑",
		color: "#ffb800",
		items: FORTNITE_RARE,
		description: "Pioches exclusives, skins légendaires, OG only."
	},
	{
		id: "vbucks",
		label: "V-Bucks",
		emoji: "💰",
		color: "#f0b400",
		items: VBUCKS,
		description: "Comptes chargés en V-Bucks prêts à dépenser."
	},
	{
		id: "steam",
		label: "Steam",
		emoji: "🎮",
		color: "#1b9cff",
		items: [],
		description: "Choisissez votre jeu Steam — 1€ chacun, ajout au panier instantané."
	},
	{
		id: "discord",
		label: "Discord",
		emoji: "✦",
		color: "#5865f2",
		items: DISCORD_DECO,
		description: "Décorations de profil — grille tarifaire officielle."
	}
];
function Index() {
	const [active, setActive] = (0, import_react.useState)("streaming");
	const [query, setQuery] = (0, import_react.useState)("");
	const [stocks, setStocks] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		const fetchStocks = async () => {
			const { data } = await supabase.from("product_stock").select("*");
			if (data) {
				const map = {};
				data.forEach((s) => map[s.product_id] = {
					is_unlimited: s.is_unlimited,
					stock: s.stock
				});
				setStocks(map);
			}
		};
		fetchStocks();
	}, []);
	const cats = (0, import_react.useMemo)(() => GROUPS.map((g) => ({
		id: g.id,
		label: g.label,
		emoji: g.emoji,
		color: g.color,
		count: g.items.length || 4
	})), []);
	const group = GROUPS.find((g) => g.id === active);
	const filtered = (0, import_react.useMemo)(() => {
		if (!query.trim()) return group.items;
		const q = query.toLowerCase();
		return group.items.filter((p) => p.name.toLowerCase().includes(q));
	}, [group, query]);
	function handleSelect(id) {
		setActive(id);
		setQuery("");
		window.scrollTo({
			top: 380,
			behavior: "smooth"
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartDrawer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative overflow-hidden grid-bg border-b border-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: hero_bg_default,
						alt: "",
						className: "absolute inset-0 w-full h-full object-cover opacity-60 animate-hero-zoom"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 hero-red-pulse pointer-events-none" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 hero-red-sweep pointer-events-none" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-background" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative max-w-7xl mx-auto px-6 py-16 md:py-24",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-w-3xl space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
										size: 14,
										className: "text-primary"
									}), " Boutique premium — Livraison instantanée"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "text-5xl md:text-7xl font-black tracking-tight leading-[0.95]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3 mb-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "shrink-0 w-16 h-16 md:w-20 md:h-20 bg-black rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.4)] border border-red-600/30 overflow-hidden p-1.5 flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: "/logo.png",
												alt: "Logo",
												className: "w-full h-full object-contain"
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground",
											children: "SHOP"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(220,38,38,0.8)]",
											children: "+"
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-2xl md:text-3xl font-bold text-muted-foreground block",
										children: "Tout ce que vous voulez. À prix imbattable."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-5 pt-3 text-sm text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, {
												size: 16,
												className: "text-primary"
											}), " Livraison rapide"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
												size: 16,
												className: "text-accent"
											}), " Comptes garantis"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, {
												size: 16,
												className: "text-primary"
											}), " PayPal sécurisé"]
										})
									]
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "max-w-7xl mx-auto px-4 md:px-6 py-10 grid lg:grid-cols-[260px_minmax(0,1fr)] gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategorySidebar, {
					cats,
					active,
					onSelect: handleSelect
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "min-w-0 space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative overflow-hidden rounded-3xl border border-white/5 p-6 md:p-8",
						style: { background: `linear-gradient(135deg, ${group.color}22, transparent 70%), var(--color-card)` },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: CATEGORY_IMAGES[group.label] ?? "/assets/hero-bg-mj13ePX0.jpg",
							alt: "",
							loading: "lazy",
							className: "absolute right-0 top-0 h-full w-1/2 object-cover opacity-30 [mask-image:linear-gradient(to_left,black,transparent)]"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex flex-wrap items-end justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs uppercase tracking-[0.3em] font-bold",
									style: { color: group.color },
									children: [
										group.emoji,
										" ",
										group.label
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-2 text-3xl md:text-4xl font-black tracking-tight",
									children: group.description
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative w-full md:w-72",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
									size: 16,
									className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: query,
									onChange: (e) => setQuery(e.target.value),
									placeholder: "Rechercher dans la catégorie…",
									className: "w-full pl-9 pr-3 py-2.5 rounded-xl bg-background/60 border border-border text-sm focus:outline-none focus:ring-2",
									style: { ["--tw-ring-color"]: group.color }
								})]
							})]
						})]
					}), group.id === "steam" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SteamMenu, {}) : group.id === "fortnite" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid sm:grid-cols-2 xl:grid-cols-3 gap-5",
							children: filtered.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard3D, {
								product: p,
								stockInfo: stocks[p.id]
							}, p.id))
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid sm:grid-cols-2 xl:grid-cols-3 gap-5",
						children: filtered.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard3D, {
							product: p,
							stockInfo: stocks[p.id]
						}, p.id))
					}), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center py-20 text-muted-foreground",
						children: [
							"Aucun produit ne correspond à \"",
							query,
							"\""
						]
					})] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "border-t border-border py-10 px-6 text-center text-sm text-muted-foreground mt-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-center mb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-12 h-12 bg-black rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)] border border-red-600/30 overflow-hidden p-1 flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/logo.png",
								alt: "SHOP+",
								className: "w-full h-full object-contain"
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-black text-foreground mb-2 text-lg flex justify-center items-center gap-1",
						children: ["SHOP", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-primary",
							children: "+"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Paiement sécurisé via PayPal — ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "https://paypal.me/zyko921",
						target: "_blank",
						rel: "noreferrer",
						className: "text-primary hover:underline",
						children: "paypal.me/zyko921"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs",
						children: [
							"© ",
							(/* @__PURE__ */ new Date()).getFullYear(),
							" SHOP+. Tous droits réservés."
						]
					})
				]
			})
		]
	});
}
//#endregion
export { Index as component };
