import https from 'https';

const urls = [
  "https://fortnite-api.com/images/cosmetics/br/cid_035_athena_commando_m_medieval/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/cid_175_athena_commando_m_celestial/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/cid_731_athena_commando_m_cactusjack/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/cid_101_athena_commando_m_tacticalassassin/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/eid_takethel/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/pickaxe_id_322_mintcandy/icon.png",
  "https://fortnite-api.com/images/cosmetics/br/pickaxe_id_505_journey/icon.png"
];

urls.forEach(url => {
  https.get(url, res => {
    console.log(`${res.statusCode} : ${url}`);
  });
});
