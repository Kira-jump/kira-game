const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Ajoute un timer pour garder le format long
html = html.replace(
    `let saveTimeout = null;`,
    `let saveTimeout = null;
let displayTimeout = null;`
);

// Garde le format long pendant 5s après le tap
html = html.replace(
    `clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveCoins, 1500);`,
    `clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveCoins, 1500);
    
    // Garde format long pendant 5s
    clearTimeout(displayTimeout);
    displayTimeout = setTimeout(() => {
        document.getElementById('coins').textContent = formatNumber(coins);
    }, 5000);`
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
