import streamingImg from "@/assets/cat-streaming.jpg";
import vpnImg from "@/assets/cat-vpn.jpg";
import twitchImg from "@/assets/cat-twitch.jpg";
import fortniteImg from "@/assets/cat-fortnite.jpg";
import rareImg from "@/assets/cat-rare.jpg";
import vbucksImg from "@/assets/cat-vbucks.jpg";
import steamImg from "@/assets/cat-steam.jpg";
import discordImg from "@/assets/cat-discord.jpg";

export const CATEGORY_IMAGES: Record<string, string> = {
  Streaming: streamingImg,
  VPN: vpnImg,
  Twitch: twitchImg,
  Fortnite: fortniteImg,
  "Fortnite Rare": rareImg,
  "V-Bucks": vbucksImg,
  Steam: steamImg,
  Discord: discordImg,
};

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  color: string; // hex
  emoji?: string;
  subtitle?: string;
  image?: string;
  logo?: string; // simpleicons slug
};

export const STREAMING: Product[] = [
  { id: "ytb", name: "YouTube Premium", subtitle: "1 Mois", price: 1, category: "Streaming", color: "#ff0033", emoji: "▶", logo: "youtube" },
  { id: "deezer", name: "Deezer Premium", subtitle: "Lifetime", price: 1, category: "Streaming", color: "#a238ff", emoji: "♪", logo: "deezer" },
  { id: "netflix", name: "Netflix", subtitle: "Premium", price: 1, category: "Streaming", color: "#e50914", emoji: "N", logo: "netflix" },
  { id: "disney", name: "Disney+", subtitle: "Premium", price: 1, category: "Streaming", color: "#113ccf", emoji: "✨", logo: "/disney-plus.png" },
  { id: "spotify", name: "Spotify Premium", subtitle: "2 Mois", price: 1, category: "Streaming", color: "#1db954", emoji: "🎧", logo: "spotify" },
  { id: "crunchy", name: "Crunchyroll", subtitle: "Premium", price: 1, category: "Streaming", color: "#f47521", emoji: "🍥", logo: "crunchyroll" },
  { id: "nba", name: "NBA League Pass", subtitle: "Premium", price: 1, category: "Streaming", color: "#c9082a", emoji: "🏀", logo: "nba" },
  { id: "ufc", name: "UFC Fight Pass", subtitle: "Lifetime", price: 1, category: "Streaming", color: "#d20a0a", emoji: "🥋", logo: "ufc" },
  { id: "hbo", name: "HBO Max", subtitle: "Premium", price: 1, category: "Streaming", color: "#9b4dff", emoji: "H", logo: "hbo" },
  { id: "dazn", name: "DAZN", subtitle: "Pays aléatoire", price: 1, category: "Streaming", color: "#f8ff13", emoji: "⚡", logo: "dazn" },
  { id: "cda", name: "CDA", subtitle: "Lifetime", price: 1, category: "Streaming", color: "#4ade80", emoji: "▶", logo: "https://icon.horse/icon/cda.pl" },
  { id: "polsat", name: "Polsat Box Go", subtitle: "Lifetime", price: 1, category: "Streaming", color: "#1e90ff", emoji: "📺", logo: "https://icon.horse/icon/polsatboxgo.pl" },
  { id: "paramount", name: "Paramount+ EU", subtitle: "Lifetime", price: 1, category: "Streaming", color: "#0064ff", emoji: "⛰", logo: "paramountplus" },
  { id: "capcut", name: "CapCut Pro", subtitle: "Premium", price: 1, category: "Streaming", color: "#25f4ee", emoji: "✂", logo: "https://icon.horse/icon/capcut.com" },
];

export const VPN: Product[] = [
  { id: "nordvpn", name: "NordVPN", subtitle: "Premium", price: 2, category: "VPN", color: "#4687ff", emoji: "🛡", logo: "nordvpn" },
  { id: "ipvanish", name: "IPVanish", subtitle: "Premium", price: 2, category: "VPN", color: "#70b800", emoji: "🔒" },
];

export const TWITCH: Product[] = [
  { id: "twitch2k", name: "2 000 Followers Twitch", price: 3, category: "Twitch", color: "#9146ff", emoji: "📈", logo: "twitch" },
];

export const FORTNITE_CLASSIC: Product[] = [
  { id: "fn-2-10", name: "Compte Fortnite 2 à 10 Skins", price: 0.6, category: "Fortnite", color: "#00d2ff", emoji: "💎" },
  { id: "fn-10-20", name: "Compte 10 à 20 Skins", price: 1.2, category: "Fortnite", color: "#00d2ff", emoji: "💎" },
  { id: "fn-20-50", name: "Compte 20 à 50 Skins", price: 3.5, category: "Fortnite", color: "#00bfff", emoji: "💎" },
  { id: "fn-50-100", name: "Compte 50 à 100 Skins", price: 6.5, category: "Fortnite", color: "#1fa7ff", emoji: "💎" },
  { id: "fn-100-150", name: "Compte 100 à 150 Skins", price: 8.5, category: "Fortnite", color: "#1fa7ff", emoji: "💎" },
  { id: "fn-150-250", name: "Compte 150 à 250 Skins", price: 13, category: "Fortnite", color: "#3b82f6", emoji: "💎" },
  { id: "fn-250-400", name: "Compte 250 à 400 Skins", price: 20, category: "Fortnite", color: "#4f46e5", emoji: "💎" },
  { id: "fn-400-550", name: "Compte 400 à 550 Skins", price: 45, category: "Fortnite", color: "#8b5cf6", emoji: "💎" },
];

export const FORTNITE_RARE: Product[] = [
  { id: "fn-leviathan", name: "Leviathan Axe", subtitle: "100-200 Skins", price: 15, category: "Fortnite Rare", color: "#00ffd1", emoji: "🪓" },
  { id: "fn-minty", name: "Minty Axe", subtitle: "100-250 Skins", price: 20, category: "Fortnite Rare", color: "#7cffb2", emoji: "🪓" },
  { id: "fn-takel", name: "Take The L", subtitle: "100-250 Skins", price: 17, category: "Fortnite Rare", color: "#ff4dd2", emoji: "💃" },
  { id: "fn-reaper", name: "The Reaper", subtitle: "100-250 Skins", price: 17, category: "Fortnite Rare", color: "#9aa0a6", emoji: "🗡" },
  { id: "fn-travis", name: "Travis Scott", subtitle: "100-250 Skins", price: 35, category: "Fortnite Rare", color: "#ff7a00", emoji: "🎤" },
  { id: "fn-galaxy", name: "Galaxy", subtitle: "70-150 Skins", price: 50, category: "Fortnite Rare", color: "#7b00ff", emoji: "🌌" },
  { id: "fn-bk60", name: "Black Knight", subtitle: "60-200 Skins", price: 70, category: "Fortnite Rare", color: "#5c5cff", emoji: "🛡" },
  { id: "fn-bk50", name: "Black Knight", subtitle: "50-200 Skins", price: 80, category: "Fortnite Rare", color: "#3b3bff", emoji: "🛡" },
];

export const VBUCKS: Product[] = [
  { id: "vb-1000", name: "1000 - 2500 V-Bucks", price: 5, category: "V-Bucks", color: "#f0b400", emoji: "💰" },
  { id: "vb-2500", name: "2500 - 5000 V-Bucks", price: 14, category: "V-Bucks", color: "#ffc933", emoji: "💰" },
];

export type SteamCategory = {
  name: string;
  color: string;
  emoji: string;
  games: string[];
};

export const STEAM_CATEGORIES: SteamCategory[] = [
  {
    name: "Action & Aventure",
    color: "#ff5722",
    emoji: "⚔",
    games: ["God of War", "Cyberpunk 2077", "Hogwarts Legacy", "The Witcher 3", "GTA 5", "UNCHARTED: Legacy of Thieves", "Just Cause 4", "Resident Evil Village", "Hitman"],
  },
  {
    name: "Survie & Horreur",
    color: "#7b1fa2",
    emoji: "👻",
    games: ["Outlast", "Outlast 2", "The Forest", "Sons of the Forest", "ARK", "Dead by Daylight", "Phasmophobia", "Escape the Backrooms", "Raft"],
  },
  {
    name: "Simulation & Bac à sable",
    color: "#00bcd4",
    emoji: "🛠",
    games: ["Farming Simulator 25", "Cities Skylines", "Cities Skylines 2", "House Flipper 2", "Garry's Mod", "Supermarket Simulator", "Euro Truck Simulator 2", "Contraband Police", "Assetto Corsa", "BeamNG.drive"],
  },
  {
    name: "Multijoueur & Divers",
    color: "#4caf50",
    emoji: "🎮",
    games: ["Sea of Thieves", "Among Us", "Ready or Not", "Marvel Rivals", "Detroit: Become Human", "Wallpaper Engine", "Schedule 1"],
  },
];

export const STEAM_PRODUCT: Product = {
  id: "steam-account",
  name: "Compte Steam avec jeux",
  price: 5,
  category: "Steam",
  color: "#1b2838",
  emoji: "🎮",
  subtitle: "Comptes avec jeux bonus inclus",
};

export const DISCORD_DECO: Product[] = [
  { id: "dd-499", name: "Décoration 4.99€", subtitle: "Au lieu de 4.99€", price: 1.99, category: "Discord", color: "#5865f2", emoji: "✦" },
  { id: "dd-599", name: "Décoration 5.99€", subtitle: "Au lieu de 5.99€", price: 2.99, category: "Discord", color: "#5865f2", emoji: "✦" },
  { id: "dd-699", name: "Décoration 6.99€", subtitle: "Au lieu de 6.99€", price: 3.99, category: "Discord", color: "#5865f2", emoji: "✦" },
  { id: "dd-799", name: "Décoration 7.99€", subtitle: "Au lieu de 7.99€", price: 4.99, category: "Discord", color: "#5865f2", emoji: "✦" },
  { id: "dd-899", name: "Décoration 8.99€", subtitle: "Au lieu de 8.99€", price: 5.99, category: "Discord", color: "#5865f2", emoji: "✦" },
  { id: "dd-999", name: "Décoration 9.99€", subtitle: "Au lieu de 9.99€", price: 6.99, category: "Discord", color: "#5865f2", emoji: "✦" },
  { id: "dd-1199", name: "Décoration 11.99€", subtitle: "Au lieu de 11.99€", price: 7.99, category: "Discord", color: "#5865f2", emoji: "✦" },
  { id: "dd-1299", name: "Décoration 12.99€", subtitle: "Au lieu de 12.99€", price: 8.99, category: "Discord", color: "#5865f2", emoji: "✦" },
  { id: "dd-1599", name: "Décoration 15.99€", subtitle: "Au lieu de 15.99€", price: 11.99, category: "Discord", color: "#5865f2", emoji: "✦" },
  { id: "dd-1799", name: "Décoration 17.99€", subtitle: "Au lieu de 17.99€", price: 13.99, category: "Discord", color: "#5865f2", emoji: "✦" },
];

export const PAYPAL_URL = "https://paypal.me/zyko921";

export function getAllProducts(): Product[] {
  return [
    ...STREAMING,
    ...VPN,
    ...TWITCH,
    ...FORTNITE_CLASSIC,
    ...FORTNITE_RARE,
    ...VBUCKS,
    STEAM_PRODUCT,
    ...DISCORD_DECO,
  ];
}