const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Remplace l'icône 🪙 dans la cartouche par la photo
html = html.replace(
    '<img src="/coins_silver.png" style="width:28px;height:28px;object-fit:contain;">',
    '<img src="/coins_silver.png" style="width:28px;height:28px;object-fit:cover;border-radius:50%;overflow:hidden;">'
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
