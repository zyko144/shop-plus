import { createServerFn } from "@tanstack/react-start";

const COINGECKO_IDS: Record<string, string> = {
  LTC: "litecoin",
  ETH: "ethereum",
  SOL: "solana",
};

let cache: { rates: Record<string, number>; at: number } | null = null;
const CACHE_MS = 60_000; // evite de spammer CoinGecko a chaque ouverture du panier

/** Cours EUR en direct pour les cryptos acceptees, avec un court cache serveur.
 * Renvoie un objet partiel (les tickers indisponibles sont juste absents) plutot
 * que de faire echouer tout le panier si CoinGecko est momentanement indisponible. */
export const getCryptoRates = createServerFn({ method: "GET" }).handler(async () => {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.rates;
  try {
    const ids = Object.values(COINGECKO_IDS).join(",");
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=eur`);
    if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
    const json: Record<string, { eur?: number }> = await res.json();
    const rates: Record<string, number> = {};
    for (const [ticker, id] of Object.entries(COINGECKO_IDS)) {
      if (json[id]?.eur) rates[ticker] = json[id].eur!;
    }
    cache = { rates, at: Date.now() };
    return rates;
  } catch (e) {
    console.error("Cours crypto indisponibles:", e);
    return cache?.rates ?? {};
  }
});
