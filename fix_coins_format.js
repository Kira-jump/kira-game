const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Remplace formatNumber pour la cartouche - affiche complet
html = html.replace(
    'function formatNumber(n) {\n    n = Math.floor(n || 0);\n    if (n >= 1000000) return (n/1000000).toFixed(1) + \'M\';\n    if (n >= 1000) return (n/1000).toFixed(1) + \'K\';\n    return n.toString();\n}',
    `function formatNumber(n) {
    n = Math.floor(n || 0);
    if (n >= 1000000) return (n/1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n/1000).toFixed(1) + 'K';
    return n.toString();
}

function formatCoins(n) {
    n = Math.floor(n || 0);
    return n.toLocaleString('fr-FR');
}`
);

// Utilise formatCoins pour la cartouche
html = html.replace(
    `document.getElementById('coins').textContent = formatNumber(coins);`,
    `document.getElementById('coins').textContent = formatCoins(coins);`
);

// Aussi au tap
html = html.replace(
    `el.textContent = formatNumber(coins);`,
    `el.textContent = formatCoins(coins);`
);

// Réduit la police si nombre long
html = html.replace(
    `.coins-cartouche-value {
    font-size: 16px;
    font-weight: 900;
    color: #f0c040;
    letter-spacing: -0.5px;
    line-height: 1.1;
}`,
    `.coins-cartouche-value {
    font-size: 13px;
    font-weight: 900;
    color: #f0c040;
    letter-spacing: -0.5px;
    line-height: 1.1;
    white-space: nowrap;
}`
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
