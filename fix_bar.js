const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

html = html.replace(
    'totalCoins = parseInt(user.total_coins) || parseInt(user.coins) || 0;',
    'totalCoins = parseInt(user.coins) || 0;'
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
