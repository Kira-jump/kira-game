const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Utilise coins directement pour totalCoins
html = html.replace(
    'totalCoins = parseInt(user.coins) || 0;',
    `totalCoins = parseInt(user.coins) || 0;
            // Sync total_coins avec coins
            if (parseInt(user.total_coins) < totalCoins) {
                fetch(API + '/api/user/' + telegramId + '/tap', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ coins: totalCoins })
                }).catch(() => {});
            }`
);

// Met à jour totalCoins au tap
html = html.replace(
    'totalCoins += coinsPerTap;',
    'totalCoins = coins;'
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
