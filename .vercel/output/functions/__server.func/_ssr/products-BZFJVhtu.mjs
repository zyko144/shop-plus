import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as useAuth } from "./auth-DTdYFO5Z.mjs";
import { n as useCart } from "./cart-1SO8M5j5.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as User, d as Shield, l as ShoppingCart, x as LogOut } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products-BZFJVhtu.js
var import_jsx_runtime = require_jsx_runtime();
var logo_default = "/assets/logo-CNXo6MJ9.png";
function Header() {
	const { count, setOpen } = useCart();
	const { user, profile, signOut } = useAuth();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-50 glass border-b border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-7xl mx-auto px-6 h-16 flex items-center justify-between",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2.5 font-black text-lg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: logo_default,
						alt: "SHOP+",
						className: "w-9 h-9 rounded-xl shadow-[0_0_24px_rgba(220,38,38,.6)]"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "tracking-tight",
						children: ["SHOP", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent",
							children: "+"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden md:flex items-center gap-4 text-xs",
					children: [
						profile?.role === "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin",
							className: "text-red-500 hover:text-red-400 transition-colors flex items-center gap-2 font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { size: 16 }), " Dashboard"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5 text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" }), " Livraison instantanée"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "https://discord.gg/UUBFjjCp",
							target: "_blank",
							rel: "noreferrer",
							className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-white transition hover:scale-105",
							style: { background: "linear-gradient(135deg,#dc2626,#991b1b)" },
							children: "🎫 Ticket Discord"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						profile?.role === "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin",
							className: "text-sm px-3 py-2 rounded-lg hover:bg-muted text-red-500 flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { size: 16 }),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "Admin"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/orders",
							className: "text-sm px-3 py-2 rounded-lg hover:bg-muted flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { size: 16 }),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "Commandes"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: signOut,
							className: "text-sm px-3 py-2 rounded-lg hover:bg-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { size: 16 })
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						className: "text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium",
						children: "Connexion"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setOpen(true),
						className: "relative p-2 rounded-lg hover:bg-muted",
						"aria-label": "Cart",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { size: 20 }), count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full grid place-items-center font-bold",
							children: count
						})]
					})]
				})
			]
		})
	});
}
var CATEGORY_IMAGES = {
	Streaming: "/assets/cat-streaming-C6rWfKLF.jpg",
	VPN: "/assets/cat-vpn-hyCcP9h9.jpg",
	Twitch: "/assets/cat-twitch-CTmm6kRS.jpg",
	Fortnite: "/assets/cat-fortnite-B5DIVbil.jpg",
	"Fortnite Rare": "/assets/cat-rare-DlungkDW.jpg",
	"V-Bucks": "/assets/cat-vbucks-B7FX2Dva.jpg",
	Steam: "/assets/cat-steam-DQYjXowe.jpg",
	Discord: "/assets/cat-discord-zCY9AnSL.jpg"
};
var STREAMING = [
	{
		id: "ytb",
		name: "YouTube Premium",
		subtitle: "1 Mois",
		price: 1,
		category: "Streaming",
		color: "#ff0033",
		emoji: "▶",
		logo: "youtube"
	},
	{
		id: "deezer",
		name: "Deezer Premium",
		subtitle: "Lifetime",
		price: 1,
		category: "Streaming",
		color: "#a238ff",
		emoji: "♪",
		logo: "deezer"
	},
	{
		id: "netflix",
		name: "Netflix",
		subtitle: "Premium",
		price: 1,
		category: "Streaming",
		color: "#e50914",
		emoji: "N",
		logo: "netflix"
	},
	{
		id: "disney",
		name: "Disney+",
		subtitle: "Premium",
		price: 1,
		category: "Streaming",
		color: "#113ccf",
		emoji: "✨",
		logo: "disneyplus"
	},
	{
		id: "spotify",
		name: "Spotify Premium",
		subtitle: "1 Mois",
		price: 1,
		category: "Streaming",
		color: "#1db954",
		emoji: "🎧",
		logo: "spotify"
	},
	{
		id: "crunchy",
		name: "Crunchyroll",
		subtitle: "Premium",
		price: 1,
		category: "Streaming",
		color: "#f47521",
		emoji: "🍥",
		logo: "crunchyroll"
	},
	{
		id: "nba",
		name: "NBA League Pass",
		subtitle: "Premium",
		price: 1,
		category: "Streaming",
		color: "#c9082a",
		emoji: "🏀",
		logo: "nba"
	},
	{
		id: "ufc",
		name: "UFC Fight Pass",
		subtitle: "Lifetime",
		price: 1,
		category: "Streaming",
		color: "#d20a0a",
		emoji: "🥋",
		logo: "ufc"
	},
	{
		id: "hbo",
		name: "HBO Max",
		subtitle: "Premium",
		price: 1,
		category: "Streaming",
		color: "#9b4dff",
		emoji: "H",
		logo: "hbo"
	},
	{
		id: "dazn",
		name: "DAZN",
		subtitle: "Pays aléatoire",
		price: 1,
		category: "Streaming",
		color: "#f8ff13",
		emoji: "⚡",
		logo: "dazn"
	},
	{
		id: "cda",
		name: "CDA",
		subtitle: "Lifetime",
		price: 1,
		category: "Streaming",
		color: "#4ade80",
		emoji: "▶",
		logo: "https://icon.horse/icon/cda.pl"
	},
	{
		id: "polsat",
		name: "Polsat Box Go",
		subtitle: "Lifetime",
		price: 1,
		category: "Streaming",
		color: "#1e90ff",
		emoji: "📺",
		logo: "https://icon.horse/icon/polsatboxgo.pl"
	},
	{
		id: "paramount",
		name: "Paramount+ EU",
		subtitle: "Lifetime",
		price: 1,
		category: "Streaming",
		color: "#0064ff",
		emoji: "⛰",
		logo: "paramountplus"
	},
	{
		id: "capcut",
		name: "CapCut Pro",
		subtitle: "Premium",
		price: 1,
		category: "Streaming",
		color: "#25f4ee",
		emoji: "✂",
		logo: "https://icon.horse/icon/capcut.com"
	}
];
var VPN = [{
	id: "nordvpn",
	name: "NordVPN",
	subtitle: "Premium",
	price: 2,
	category: "VPN",
	color: "#4687ff",
	emoji: "🛡",
	logo: "nordvpn"
}, {
	id: "ipvanish",
	name: "IPVanish",
	subtitle: "Premium",
	price: 2,
	category: "VPN",
	color: "#70b800",
	emoji: "🔒"
}];
var TWITCH = [{
	id: "twitch2k",
	name: "2 000 Followers Twitch",
	price: 3,
	category: "Twitch",
	color: "#9146ff",
	emoji: "📈",
	logo: "twitch"
}];
var FORTNITE_CLASSIC = [
	{
		id: "fn-2-10",
		name: "Compte Fortnite 2 à 10 Skins",
		price: .6,
		category: "Fortnite",
		color: "#00d2ff",
		emoji: "💎"
	},
	{
		id: "fn-10-20",
		name: "Compte 10 à 20 Skins",
		price: 1.2,
		category: "Fortnite",
		color: "#00d2ff",
		emoji: "💎"
	},
	{
		id: "fn-20-50",
		name: "Compte 20 à 50 Skins",
		price: 3.5,
		category: "Fortnite",
		color: "#00bfff",
		emoji: "💎"
	},
	{
		id: "fn-50-100",
		name: "Compte 50 à 100 Skins",
		price: 6.5,
		category: "Fortnite",
		color: "#1fa7ff",
		emoji: "💎"
	},
	{
		id: "fn-100-150",
		name: "Compte 100 à 150 Skins",
		price: 8.5,
		category: "Fortnite",
		color: "#1fa7ff",
		emoji: "💎"
	},
	{
		id: "fn-150-250",
		name: "Compte 150 à 250 Skins",
		price: 13,
		category: "Fortnite",
		color: "#3b82f6",
		emoji: "💎"
	},
	{
		id: "fn-250-400",
		name: "Compte 250 à 400 Skins",
		price: 20,
		category: "Fortnite",
		color: "#4f46e5",
		emoji: "💎"
	},
	{
		id: "fn-400-550",
		name: "Compte 400 à 550 Skins",
		price: 45,
		category: "Fortnite",
		color: "#8b5cf6",
		emoji: "💎"
	}
];
var FORTNITE_RARE = [
	{
		id: "fn-leviathan",
		name: "Leviathan Axe",
		subtitle: "100-200 Skins",
		price: 15,
		category: "Fortnite Rare",
		color: "#00ffd1",
		emoji: "🪓"
	},
	{
		id: "fn-minty",
		name: "Minty Axe",
		subtitle: "100-250 Skins",
		price: 20,
		category: "Fortnite Rare",
		color: "#7cffb2",
		emoji: "🪓"
	},
	{
		id: "fn-takel",
		name: "Take The L",
		subtitle: "100-250 Skins",
		price: 17,
		category: "Fortnite Rare",
		color: "#ff4dd2",
		emoji: "💃"
	},
	{
		id: "fn-reaper",
		name: "The Reaper",
		subtitle: "100-250 Skins",
		price: 17,
		category: "Fortnite Rare",
		color: "#9aa0a6",
		emoji: "🗡"
	},
	{
		id: "fn-travis",
		name: "Travis Scott",
		subtitle: "100-250 Skins",
		price: 35,
		category: "Fortnite Rare",
		color: "#ff7a00",
		emoji: "🎤"
	},
	{
		id: "fn-galaxy",
		name: "Galaxy",
		subtitle: "70-150 Skins",
		price: 50,
		category: "Fortnite Rare",
		color: "#7b00ff",
		emoji: "🌌"
	},
	{
		id: "fn-bk60",
		name: "Black Knight",
		subtitle: "60-200 Skins",
		price: 70,
		category: "Fortnite Rare",
		color: "#5c5cff",
		emoji: "🛡"
	},
	{
		id: "fn-bk50",
		name: "Black Knight",
		subtitle: "50-200 Skins",
		price: 80,
		category: "Fortnite Rare",
		color: "#3b3bff",
		emoji: "🛡"
	}
];
var VBUCKS = [{
	id: "vb-1000",
	name: "1000 - 2500 V-Bucks",
	price: 5,
	category: "V-Bucks",
	color: "#f0b400",
	emoji: "💰"
}, {
	id: "vb-2500",
	name: "2500 - 5000 V-Bucks",
	price: 14,
	category: "V-Bucks",
	color: "#ffc933",
	emoji: "💰"
}];
var STEAM_CATEGORIES = [
	{
		name: "Action & Aventure",
		color: "#ff5722",
		emoji: "⚔",
		games: [
			"God of War",
			"Cyberpunk 2077",
			"Hogwarts Legacy",
			"The Witcher 3",
			"GTA 5",
			"UNCHARTED: Legacy of Thieves",
			"Just Cause 4",
			"Resident Evil Village",
			"Hitman"
		]
	},
	{
		name: "Survie & Horreur",
		color: "#7b1fa2",
		emoji: "👻",
		games: [
			"Outlast",
			"Outlast 2",
			"The Forest",
			"Sons of the Forest",
			"ARK",
			"Dead by Daylight",
			"Phasmophobia",
			"Escape the Backrooms",
			"Raft"
		]
	},
	{
		name: "Simulation & Bac à sable",
		color: "#00bcd4",
		emoji: "🛠",
		games: [
			"Farming Simulator 25",
			"Cities Skylines",
			"Cities Skylines 2",
			"House Flipper 2",
			"Garry's Mod",
			"Supermarket Simulator",
			"Euro Truck Simulator 2",
			"Contraband Police",
			"Assetto Corsa",
			"BeamNG.drive"
		]
	},
	{
		name: "Multijoueur & Divers",
		color: "#4caf50",
		emoji: "🎮",
		games: [
			"Sea of Thieves",
			"Among Us",
			"Ready or Not",
			"Marvel Rivals",
			"Detroit: Become Human",
			"Wallpaper Engine",
			"Schedule 1"
		]
	}
];
var STEAM_PRODUCT = {
	id: "steam-account",
	name: "Compte Steam avec jeux",
	price: 5,
	category: "Steam",
	color: "#1b2838",
	emoji: "🎮",
	subtitle: "Comptes avec jeux bonus inclus"
};
var DISCORD_DECO = [
	{
		id: "dd-499",
		name: "Décoration 4.99€",
		subtitle: "Au lieu de 4.99€",
		price: 1.99,
		category: "Discord",
		color: "#5865f2",
		emoji: "✦"
	},
	{
		id: "dd-599",
		name: "Décoration 5.99€",
		subtitle: "Au lieu de 5.99€",
		price: 2.99,
		category: "Discord",
		color: "#5865f2",
		emoji: "✦"
	},
	{
		id: "dd-699",
		name: "Décoration 6.99€",
		subtitle: "Au lieu de 6.99€",
		price: 3.99,
		category: "Discord",
		color: "#5865f2",
		emoji: "✦"
	},
	{
		id: "dd-799",
		name: "Décoration 7.99€",
		subtitle: "Au lieu de 7.99€",
		price: 4.99,
		category: "Discord",
		color: "#5865f2",
		emoji: "✦"
	},
	{
		id: "dd-899",
		name: "Décoration 8.99€",
		subtitle: "Au lieu de 8.99€",
		price: 5.99,
		category: "Discord",
		color: "#5865f2",
		emoji: "✦"
	},
	{
		id: "dd-999",
		name: "Décoration 9.99€",
		subtitle: "Au lieu de 9.99€",
		price: 6.99,
		category: "Discord",
		color: "#5865f2",
		emoji: "✦"
	},
	{
		id: "dd-1199",
		name: "Décoration 11.99€",
		subtitle: "Au lieu de 11.99€",
		price: 7.99,
		category: "Discord",
		color: "#5865f2",
		emoji: "✦"
	},
	{
		id: "dd-1299",
		name: "Décoration 12.99€",
		subtitle: "Au lieu de 12.99€",
		price: 8.99,
		category: "Discord",
		color: "#5865f2",
		emoji: "✦"
	},
	{
		id: "dd-1599",
		name: "Décoration 15.99€",
		subtitle: "Au lieu de 15.99€",
		price: 11.99,
		category: "Discord",
		color: "#5865f2",
		emoji: "✦"
	},
	{
		id: "dd-1799",
		name: "Décoration 17.99€",
		subtitle: "Au lieu de 17.99€",
		price: 13.99,
		category: "Discord",
		color: "#5865f2",
		emoji: "✦"
	}
];
var PAYPAL_URL = "https://paypal.me/zyko921";
function getAllProducts() {
	return [
		...STREAMING,
		...VPN,
		...TWITCH,
		...FORTNITE_CLASSIC,
		...FORTNITE_RARE,
		...VBUCKS,
		STEAM_PRODUCT,
		...DISCORD_DECO
	];
}
//#endregion
export { Header as a, STREAMING as c, VPN as d, getAllProducts as f, FORTNITE_RARE as i, TWITCH as l, DISCORD_DECO as n, PAYPAL_URL as o, FORTNITE_CLASSIC as r, STEAM_CATEGORIES as s, CATEGORY_IMAGES as t, VBUCKS as u };
