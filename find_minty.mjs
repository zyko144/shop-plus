import https from 'https';
https.get("https://fortnite-api.com/v2/cosmetics/br/search?name=Merry+Mint+Axe", res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log(JSON.parse(data).data.images.icon);
    });
});
