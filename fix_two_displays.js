const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// La cartouche utilise TOUJOURS formatCoins (long)
// Le reste utilise formatNumber (court)

// Cherche toutes les mises à jour de #coins et force formatCoins
html = html.replace(
    /document\.getElementById\('coins'\)\.textContent = formatNumber\(coins\)/g,
    "document.getElementById('coins').textContent = formatCoins(coins)"
);

// Supprime le displayTimeout inutile
html = html.replace(
    `    isTapping = true;
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveCoins, 1500);
    clearTimeout(displayTimeout);
    displayTimeout = setTimeout(() => {
        isTapping = false;
        document.getElementById('coins').textContent = formatNumber(coins);
    }, 5000);`,
    `    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveCoins, 1500);`
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
