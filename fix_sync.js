const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Synchronise totalCoins avec coins au chargement
html = html.replace(
    'totalCoins = parseInt(user.total_coins) || 0;',
    'totalCoins = parseInt(user.total_coins) || parseInt(user.coins) || 0;'
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
