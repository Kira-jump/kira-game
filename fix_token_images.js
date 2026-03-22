const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Remplace l'icône pièce dans la cartouche
html = html.replace(
    '<div class="coins-cartouche-icon">🪙</div>',
    '<img src="/coins_silver.png" style="width:28px;height:28px;object-fit:contain;">'
);

// Remplace le bouton tap emoji par la pièce argentée
html = html.replace(
    '<button class="tap-btn" id="tap-btn">👊</button>',
    '<button class="tap-btn" id="tap-btn" style="background:none;box-shadow:0 0 40px rgba(150,150,200,0.4);"><img src="/coins_silver.png" style="width:180px;height:180px;object-fit:contain;border-radius:50%;"></button>'
);

// Remplace emoji roue dans les stats
html = html.replace(
    "document.getElementById('avatar-emoji').textContent",
    "// avatar emoji"
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
