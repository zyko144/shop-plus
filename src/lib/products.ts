import { supabase } from "@/integrations/supabase/client";
import streamingImg from "@/assets/cat-streaming.jpg";
import vpnImg from "@/assets/cat-vpn.jpg";
import twitchImg from "@/assets/cat-twitch.jpg";
import fortniteImg from "@/assets/cat-fortnite.jpg";
import rareImg from "@/assets/cat-rare.jpg";
import vbucksImg from "@/assets/cat-vbucks.jpg";
import steamImg from "@/assets/cat-steam.jpg";
import discordImg from "@/assets/cat-discord.jpg";
import robuxImg from "@/assets/cat-robux.png";
import valorantImg from "@/assets/cat-valorant.png";
import epicGamesImg from "@/assets/cat-epicgames.png";

export const CATEGORY_IMAGES: Record<string, string> = {
  Streaming: streamingImg,
  VPN: vpnImg,
  Twitch: twitchImg,
  Fortnite: fortniteImg,
  "Fortnite Rare": rareImg,
  "V-Bucks": vbucksImg,
  Steam: steamImg,
  Discord: discordImg,
  "Robux": robuxImg,
  "Valorant EU": valorantImg,
  "Epic Games": epicGamesImg,
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

export const RARE_SKIN_IMAGES: Record<string, string> = {
  "Black Knight": "https://fortnite-api.com/images/cosmetics/br/cid_035_athena_commando_m_medieval/icon.png",
  "Galaxy": "https://fortnite-api.com/images/cosmetics/br/cid_175_athena_commando_m_celestial/icon.png",
  "Travis Scott": "https://fortnite-api.com/images/cosmetics/br/cid_703_athena_commando_m_cyclone/icon.png",
  "The Reaper": "https://fortnite-api.com/images/cosmetics/br/cid_084_athena_commando_m_assassin/icon.png",
  "Take The L": "https://fortnite-api.com/images/cosmetics/br/eid_takethel/icon.png",
  "Minty Axe": "https://fortnite-api.com/images/cosmetics/br/pickaxe_id_294_candycane/icon.png",
  "Leviathan Axe": "https://fortnite-api.com/images/cosmetics/br/pickaxe_id_508_historianmale_6bqsw/icon.png",
};

/** Image/logo specifique a un produit (pas la photo generique de categorie) :
 * skin Fortnite Rare > logo produit (URL directe, chemin site, ou slug Simple
 * Icons) > override par categorie (Fortnite/V-Bucks/Discord ont toujours la
 * meme icone). `colorHex` (sans #) surcharge la couleur du produit -- utile
 * pour forcer du blanc sur les embeds Discord sans toucher au theme du site. */
export function resolveProductLogoUrl(product: Pick<Product, "name" | "category" | "color" | "logo">, colorHex?: string): string | undefined {
  const color = colorHex ?? product.color.replace("#", "");
  if (product.category === "Fortnite Rare" && RARE_SKIN_IMAGES[product.name]) return RARE_SKIN_IMAGES[product.name];
  if (product.category === "Fortnite") return `https://cdn.simpleicons.org/fortnite/${color}`;
  if (product.category === "V-Bucks") return `https://cdn.simpleicons.org/epicgames/${color}`;
  if (product.category === "Discord") return `https://cdn.simpleicons.org/discord/${color}`;
  if (!product.logo) return undefined;
  if (product.logo.startsWith("http") || product.logo.startsWith("/")) return product.logo;
  return `https://cdn.simpleicons.org/${product.logo}/${color}`;
}

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

export const PAYPAL_URL = "https://paypal.me/steamapp";

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
  
  let products = (data || []).filter(p => !['CDA', 'Polsat Box Go'].includes(p.name));
  
  // Modification automatique des prix programmée pour le 23 Juin 2026 à 12h00
  const scheduledTime = new Date('2026-06-23T12:00:00+02:00').getTime();
  if (Date.now() >= scheduledTime) {
    products = products.map(p => {
      if (p.category === 'Fortnite' || p.category === 'Fortnite Rare') {
        return { ...p, price: Number((p.price * 2.5).toFixed(2)) };
      }
      if (p.category === 'Steam') {
        return { ...p, price: Number((p.price * 1.5).toFixed(2)) };
      }
      if (p.category === 'Streaming') {
        if (p.name.toLowerCase().includes('spotify')) {
          return { ...p, price: 3.00 };
        } else {
          return { ...p, price: 2.20 };
        }
      }
      return p;
    });
  }
  
  return products;
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