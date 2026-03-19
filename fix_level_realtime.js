const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Met à jour total_coins en temps réel au tap
html = html.replace(
    'clearTimeout(saveTimeout);',
    `totalCoins += coinsPerTap;
    updateLevelUI();
    clearTimeout(saveTimeout);`
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
