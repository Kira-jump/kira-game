const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Fix affichage pièce - mode circulaire
html = html.replace(
    '<button class="tap-btn" id="tap-btn" style="background:none;box-shadow:0 0 40px rgba(150,150,200,0.4);"><img src="/coins_silver.png" style="width:180px;height:180px;object-fit:contain;border-radius:50%;"></button>',
    '<button class="tap-btn" id="tap-btn" style="overflow:hidden;background:#0d0d1a;box-shadow:0 0 40px rgba(150,150,200,0.4);"><img src="/coins_silver.png" style="width:110%;height:110%;object-fit:cover;margin-top:-5%;margin-left:-5%;"></button>'
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
