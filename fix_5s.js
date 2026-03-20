const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Ajoute flag pour savoir si on tape
html = html.replace(
    'let displayTimeout = null;',
    `let displayTimeout = null;
let isTapping = false;`
);

// Set isTapping = true au tap
html = html.replace(
    '    clearTimeout(saveTimeout);\n    saveTimeout = setTimeout(saveCoins, 1500);\n    \n    // Garde format long pendant 5s\n    clearTimeout(displayTimeout);\n    displayTimeout = setTimeout(() => {\n        document.getElementById(\'coins\').textContent = formatNumber(coins);\n    }, 5000);',
    `    isTapping = true;
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveCoins, 1500);
    clearTimeout(displayTimeout);
    displayTimeout = setTimeout(() => {
        isTapping = false;
        document.getElementById('coins').textContent = formatNumber(coins);
    }, 5000);`
);

// updateUI respecte isTapping
html = html.replace(
    "document.getElementById('coins').textContent = formatNumber(coins);",
    `if (!isTapping) document.getElementById('coins').textContent = formatNumber(coins);`
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
