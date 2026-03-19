const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Fix style "Toi - username"
html = html.replace(
    '.my-rank-label { color: #f0c040; font-weight: 800; }',
    '.my-rank-label { color: #f0c040; font-weight: 800; font-size: 11px; }'
);

// Enlève le 👈 et met couleur dorée sur la ligne du joueur
html = html.replace(
    `\${u.username === telegramUsername ? ' 👈' : ''}`,
    ''
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
