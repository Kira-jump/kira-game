const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Fix langue - lit mieux le language_code
html = html.replace(
    "const userLang = tg.initDataUnsafe?.user?.language_code || 'fr';",
    `const rawLang = tg.initDataUnsafe?.user?.language_code || navigator.language || 'fr';
const userLang = rawLang.split('-')[0].toLowerCase();`
);

// Fix sync barre avec coins actuels
html = html.replace(
    'totalCoins = parseInt(user.total_coins) || parseInt(user.coins) || 0;',
    'totalCoins = Math.max(parseInt(user.total_coins) || 0, parseInt(user.coins) || 0);'
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
