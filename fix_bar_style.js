const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Ajoute style inline à la barre
html = html.replace(
    '<div class="game-header-progress-fill" id="level-progress-fill" style="width:0%"></div>',
    '<div class="game-header-progress-fill" id="level-progress-fill" style="width:0%;height:100%;background:linear-gradient(90deg,#f0c040,#e07b00);border-radius:10px;transition:width 0.5s ease;"></div>'
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
