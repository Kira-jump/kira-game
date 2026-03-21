const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Remplace les IDs dans updateLevelUI
html = html.replace(
    `        document.getElementById('level-progress-fill').style.width = Math.min(progress, 100) + '%';
        document.getElementById('level-current-coins').textContent = formatNumber(totalCoins - current.min);
        document.getElementById('level-next-coins').textContent = formatNumber(next.min - current.min);
    } else {
        document.getElementById('level-progress-fill').style.width = '100%';
        document.getElementById('level-current-coins').textContent = '👑 MAX';
        document.getElementById('level-next-coins').textContent = 'Legend';`,
    `        const fill = document.getElementById('level-progress-fill');
        if(fill) fill.style.width = Math.min(progress, 100) + '%';
        const curr = document.getElementById('level-current-coins');
        if(curr) curr.textContent = formatNumber(current.min) + ' → ' + formatNumber(totalCoins);
        const nxt = document.getElementById('level-next-coins');
        if(nxt) nxt.textContent = formatNumber(next.min);
    } else {
        const fill = document.getElementById('level-progress-fill');
        if(fill) fill.style.width = '100%';
        const curr = document.getElementById('level-current-coins');
        if(curr) curr.textContent = '👑 MAX';
        const nxt = document.getElementById('level-next-coins');
        if(nxt) nxt.textContent = '';`
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
