import { supabase } from "@/integrations/supabase/client";
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
  is_active?: boolean;
};

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

export const PAYPAL_URL = "https://paypal.me/zyko921";

// Fonction dynamique pour charger les produits depuis la DB
export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true);

  if (error) {
    console.error("Erreur chargement produits:", error);
    return [];
  }
  return data || [];
}

// Fonction pour l'admin (inclut les inactifs)
export async function getAdminProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("category", { ascending: true });

  if (error) {
    console.error("Erreur chargement admin produits:", error);
    return [];
  }
  return data || [];
}