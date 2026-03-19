const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');
html = html.replace(
    'userData.coins += userData.coinsPerTap;',
    'userData.coins = (userData.coins || 0) + (userData.coinsPerTap || 1);'
);
html = html.replace(
    'scoreDisplay.textContent = formatNumber(Math.floor(userData.coins));',
    'scoreDisplay.textContent = formatNumber(Math.floor(userData.coins || 0));'
);
fs.writeFileSync('public/index.html', html);
console.log('Done!');
