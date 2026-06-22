import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { t as AuthProvider } from "./auth-DTdYFO5Z.mjs";
import { t as CartProvider } from "./cart-1SO8M5j5.mjs";
import { c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as ExternalLink, _ as Pause, b as MessageCircle, g as Play, i as Volume2, n as X, r as VolumeX, s as Ticket } from "../_libs/lucide-react.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-NxDKSLnD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-XYze8g1r.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function AudioPlayer() {
	const [isPlaying, setIsPlaying] = (0, import_react.useState)(false);
	const [sliderVolume, setSliderVolume] = (0, import_react.useState)(.3);
	const audioRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (audioRef.current) audioRef.current.volume = Math.pow(sliderVolume, 3);
	}, [sliderVolume]);
	(0, import_react.useEffect)(() => {
		const playAudio = async () => {
			if (!audioRef.current) return;
			try {
				await audioRef.current.play();
				setIsPlaying(true);
			} catch (err) {
				const onInteract = async () => {
					if (audioRef.current && !isPlaying) try {
						await audioRef.current.play();
						setIsPlaying(true);
					} catch (e) {
						console.error("Interaction play blocked", e);
					}
					document.removeEventListener("click", onInteract);
					document.removeEventListener("keydown", onInteract);
				};
				document.addEventListener("click", onInteract);
				document.addEventListener("keydown", onInteract);
			}
		};
		const timer = setTimeout(() => {
			playAudio();
		}, 500);
		return () => clearTimeout(timer);
	}, []);
	const togglePlay = () => {
		if (audioRef.current) {
			if (isPlaying) audioRef.current.pause();
			else audioRef.current.play().catch((e) => console.error("Play blocked:", e));
			setIsPlaying(!isPlaying);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed bottom-4 right-4 z-[100] bg-black/60 backdrop-blur-xl rounded-full px-4 py-2.5 flex items-center gap-3 border border-white/10 shadow-[0_0_20px_rgba(220,38,38,0.2)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: togglePlay,
				className: "w-8 h-8 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-colors shrink-0 shadow-lg shadow-red-600/30",
				children: isPlaying ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {
					size: 16,
					fill: "currentColor"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
					size: 16,
					fill: "currentColor",
					className: "ml-1"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] font-bold text-red-500 uppercase tracking-wider mb-0.5",
					children: "En cours"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-medium text-white/90 truncate w-32 md:w-40 scroll-text",
					children: "SKIMA BENZ"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-px bg-white/10 mx-1" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setSliderVolume(sliderVolume === 0 ? .3 : 0),
					className: "text-white/60 hover:text-white transition-colors",
					children: sliderVolume === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { size: 16 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { size: 16 })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: "0",
					max: "1",
					step: "0.01",
					value: sliderVolume,
					onChange: (e) => setSliderVolume(parseFloat(e.target.value)),
					className: "w-16 md:w-20 h-1.5 rounded-full bg-white/10 appearance-none cursor-pointer accent-red-600"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
				ref: audioRef,
				src: "/music.mp4",
				loop: true,
				autoPlay: true
			})
		]
	});
}
function DiscordSupport() {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick: () => setOpen((v) => !v),
		className: "fixed bottom-5 right-5 z-[90] h-14 w-14 rounded-full grid place-items-center text-white shadow-[0_10px_40px_rgba(220,38,38,.55)] hover:scale-110 active:scale-95 transition-all",
		style: { background: "linear-gradient(135deg,#dc2626,#991b1b)" },
		"aria-label": "Support Discord",
		children: [open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 22 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { size: 22 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 ring-2 ring-black animate-pulse" })]
	}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed bottom-24 right-5 z-[90] w-[min(92vw,340px)] rounded-2xl glass border border-white/10 p-5 shadow-2xl animate-fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-11 w-11 rounded-xl grid place-items-center shrink-0",
					style: { background: "linear-gradient(135deg,#dc2626,#991b1b)" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticket, {
						size: 20,
						className: "text-white"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-bold leading-tight",
						children: "Support & livraison"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-1",
						children: "Après ton paiement PayPal, ouvre un ticket Discord pour recevoir ton produit instantanément."
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "mt-4 space-y-2 text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground font-bold",
							children: "1."
						}), " Rejoins le serveur Discord"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground font-bold",
								children: "2."
							}),
							" Va dans ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground",
								children: "#créer-un-ticket"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground font-bold",
							children: "3."
						}), " Envoie ta preuve PayPal + le produit acheté"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground font-bold",
							children: "4."
						}), " Livraison sous quelques minutes 🚀"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: "https://discord.gg/UUBFjjCp",
				target: "_blank",
				rel: "noreferrer",
				className: "mt-4 w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition hover:scale-[1.02]",
				style: {
					background: "linear-gradient(135deg,#dc2626,#991b1b)",
					boxShadow: "0 8px 24px rgba(220,38,38,.45)"
				},
				children: ["Ouvrir un ticket Discord ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { size: 14 })]
			})
		]
	})] });
}
var REVIEWS = [
	{
		name: "Lucas_92",
		rating: 5,
		text: "Reçu mon Netflix en 2 min, top !",
		product: "Netflix"
	},
	{
		name: "Maeva.k",
		rating: 5,
		text: "Compte Spotify nickel, merci !",
		product: "Spotify"
	},
	{
		name: "Théo🔥",
		rating: 5,
		text: "Livraison ultra rapide, je recommande à 100%",
		product: "Disney+"
	},
	{
		name: "samy_off",
		rating: 4,
		text: "Tout fonctionne, support discord réactif",
		product: "NordVPN"
	},
	{
		name: "Camille_R",
		rating: 5,
		text: "J'avais peur au début mais franchement parfait",
		product: "HBO Max"
	},
	{
		name: "Yanis.b",
		rating: 5,
		text: "V-Bucks reçus directement, sérieux le vendeur 👍",
		product: "V-Bucks"
	},
	{
		name: "Léa🌸",
		rating: 5,
		text: "Prix imbattable, ça change des autres sites",
		product: "CapCut Pro"
	},
	{
		name: "kev_47",
		rating: 5,
		text: "2eme commande, toujours nickel",
		product: "Crunchyroll"
	},
	{
		name: "Inès.M",
		rating: 5,
		text: "Site clean, paiement PayPal simple, RAS",
		product: "YouTube Premium"
	},
	{
		name: "matteo_ps",
		rating: 4,
		text: "Petit délai mais le compte marche bien",
		product: "DAZN"
	},
	{
		name: "Nora_22",
		rating: 5,
		text: "Honnêtement le meilleur store que j'ai test",
		product: "Deezer"
	},
	{
		name: "Hugo.dev",
		rating: 5,
		text: "Discord répond en 1 min, parfait",
		product: "Steam"
	},
	{
		name: "Sarah🖤",
		rating: 5,
		text: "Reçu en moins de 5 min après paiement",
		product: "Paramount+"
	},
	{
		name: "Ethan_06",
		rating: 5,
		text: "Ça fait 3 mois ça marche toujours 🔥",
		product: "Netflix"
	},
	{
		name: "Manon.l",
		rating: 5,
		text: "Merci, mon petit frère est trop content !",
		product: "Fortnite"
	},
	{
		name: "rayan.exe",
		rating: 5,
		text: "Que dire... parfait du début à la fin",
		product: "HBO Max"
	},
	{
		name: "Chloé_p",
		rating: 5,
		text: "Le SAV est au top, problème résolu de suite",
		product: "IPVanish"
	},
	{
		name: "Adam🚀",
		rating: 5,
		text: "Plus jamais je paye plein tarif ailleurs",
		product: "Disney+"
	}
];
function Stars({ value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "text-yellow-400 text-xs",
		children: ["★".repeat(value), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground/40",
			children: "★".repeat(5 - value)
		})]
	});
}
function FakeReviewsCarousel() {
	const [open, setOpen] = (0, import_react.useState)(true);
	const loop = [...REVIEWS, ...REVIEWS];
	(0, import_react.useEffect)(() => {
		const el = document.documentElement;
		el.style.setProperty("--reviews-pad", open ? "120px" : "0px");
		return () => {
			el.style.removeProperty("--reviews-pad");
		};
	}, [open]);
	if (!open) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick: () => setOpen(true),
		className: "fixed bottom-3 left-3 z-40 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur border border-border text-xs",
		children: "⭐ Avis clients"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/85 backdrop-blur-xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between px-4 py-1.5 text-xs text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-semibold text-foreground flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-yellow-400",
					children: "★ 4.9/5"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "opacity-70",
					children: "— +2 400 avis vérifiés"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setOpen(false),
				className: "hover:text-foreground",
				"aria-label": "Fermer",
				children: "✕"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "reviews-marquee overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "reviews-track flex gap-3 py-2 px-2",
				children: loop.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "shrink-0 w-72 glass rounded-xl px-3 py-2 border border-border/60",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold truncate",
								children: r.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, { value: r.rating })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-foreground/90 line-clamp-2",
							children: r.text
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[10px] text-muted-foreground mt-0.5",
							children: ["— ", r.product]
						})
					]
				}, i))
			})
		})]
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$4 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "SHOP+ — Boutique premium" },
			{
				name: "description",
				content: "Comptes streaming, gaming, VPN et bonus exclusifs. Livraison instantanée, paiement PayPal."
			},
			{
				name: "theme-color",
				content: "#dc2626"
			},
			{
				property: "og:title",
				content: "SHOP+ — Boutique premium"
			},
			{
				property: "og:description",
				content: "Comptes streaming, gaming, VPN et bonus exclusifs. Livraison instantanée, paiement PayPal."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:image",
				content: "https://shop-pluss.netlify.app/banner.png?v=2"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:image",
				content: "https://shop-pluss.netlify.app/banner.png?v=2"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "fr",
		className: "dark",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$4.useRouteContext();
	const [showReviews, setShowReviews] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CartProvider, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiscordSupport, {}),
			showReviews ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FakeReviewsCarousel, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-center py-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setShowReviews(true),
					className: "px-6 py-2 rounded-full border border-border bg-background/50 hover:bg-muted text-sm font-medium transition-colors",
					children: "Afficher les avis clients"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AudioPlayer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				position: "top-right",
				richColors: true
			})
		] }) })
	});
}
var $$splitComponentImporter$3 = () => import("./orders-BrDjG-eV.mjs");
var Route$3 = createFileRoute("/orders")({
	head: () => ({ meta: [{ title: "Mes commandes — ZYKO Store" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./auth-Rb-ZqGW0.mjs");
var Route$2 = createFileRoute("/auth")({
	head: () => ({ meta: [{ title: "Connexion — ZYKO Store" }, {
		name: "description",
		content: "Connectez-vous ou créez un compte pour commander sur ZYKO Store."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./admin-NqrtGpzw.mjs");
var Route$1 = createFileRoute("/admin")({
	head: () => ({ meta: [{ title: "Dashboard Admin — SHOP+" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./routes-DkSycfVs.mjs");
var Route = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "SHOP+ — Comptes Streaming, Fortnite, Steam, VPN & Discord" },
		{
			name: "description",
			content: "SHOP+ : boutique premium 3D — YouTube, Netflix, Deezer, Crunchyroll, Fortnite, Steam, VPN, V-Bucks, décorations Discord. Paiement PayPal sécurisé."
		},
		{
			property: "og:title",
			content: "SHOP+ — Boutique premium"
		},
		{
			property: "og:description",
			content: "Comptes streaming, gaming, VPN et bonus exclusifs. Livraison instantanée, paiement PayPal."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var OrdersRoute = Route$3.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => Route$4
});
var AuthRoute = Route$2.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$4
});
var AdminRoute = Route$1.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$4
});
var rootRouteChildren = {
	IndexRoute: Route.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$4
	}),
	AdminRoute,
	AuthRoute,
	OrdersRoute
};
var routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
