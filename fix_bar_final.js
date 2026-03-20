const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Force totalCoins = coins au chargement
html = html.replace(
    'totalCoins = parseInt(user.coins) || 0;',
    'totalCoins = parseInt(user.coins) || 0; // Force sync'
);

// Fix updateLevelUI pour afficher les bons min/max
html = html.replace(
    `    if (next) {
        const progress = Math.min(((totalCoins - current.min) / (next.min - current.min)) * 100, 100);
        const fill = document.getElementById('level-progress-fill');
        if (fill) { fill.style.width = Math.min(progress, 100) + '%'; fill.className = 'game-header-progress-fill'; }
        const curr = document.getElementById('level-current-coins');
        const nxt = document.getElementById('level-next-coins');
        if (curr) curr.textContent = formatNumber(totalCoins - current.min);
        if (nxt) nxt.textContent = formatNumber(next.min - current.min);
    } else {
        const fill = document.getElementById('level-progress-fill');
        if (fill) fill.style.width = '100%';
    }`,
    `    if (next) {
        const progress = Math.min(((totalCoins - current.min) / (next.min - current.min)) * 100, 100);
        const fill = document.getElementById('level-progress-fill');
        if (fill) { fill.style.width = progress + '%'; fill.className = 'game-header-progress-fill'; }
        const curr = document.getElementById('level-current-coins');
        const nxt = document.getElementById('level-next-coins');
        if (curr) curr.textContent = formatNumber(current.min) + ' → ' + formatNumber(totalCoins);
        if (nxt) nxt.textContent = formatNumber(next.min);
    } else {
        const fill = document.getElementById('level-progress-fill');
        if (fill) { fill.style.width = '100%'; fill.className = 'game-header-progress-fill'; }
        const curr = document.getElementById('level-current-coins');
        if (curr) curr.textContent = '👑 MAX';
    }`
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
