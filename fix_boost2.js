const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Remplace la ligne localStorage par une version liée au telegramId
html = html.replace(
    "let boostCooldowns = JSON.parse(localStorage.getItem('boostCooldowns') || '{}');",
    "let boostCooldowns = JSON.parse(localStorage.getItem('boostCooldowns_' + telegramId) || '{}');"
);

html = html.replace(
    "localStorage.setItem('boostCooldowns', JSON.stringify(boostCooldowns));",
    "localStorage.setItem('boostCooldowns_' + telegramId, JSON.stringify(boostCooldowns));"
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
