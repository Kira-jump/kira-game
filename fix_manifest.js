const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

html = html.replace(
    "manifestUrl: 'https://kira-game.vercel.app/tonconnect-manifest.json',",
    "manifestUrl: 'https://raw.githubusercontent.com/Kira-jump/kira-game/main/public/tonconnect-manifest.json',"
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
