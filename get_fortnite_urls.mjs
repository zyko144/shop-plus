import https from 'https';

const names = [
  "Black Knight",
  "Galaxy",
  "Travis Scott",
  "The Reaper",
  "Take The L",
  "Minty Axe",
  "Leviathan Axe"
];

names.forEach(name => {
  const url = `https://fortnite-api.com/v2/cosmetics/br/search?name=${encodeURIComponent(name)}`;
  https.get(url, res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        if (json.data && json.data.images) {
          console.log(`"${name}": "${json.data.images.icon}",`);
        } else {
          console.log(`NOT FOUND: ${name}`);
        }
      } catch(e) {
        console.error(e);
      }
    });
  });
});
