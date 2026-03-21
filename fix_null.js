const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

html = html.replace(
    "document.getElementById('level-badge').textContent = current.icon + ' ' + current.name;",
    "const badge = document.getElementById('level-badge'); if(badge) badge.textContent = current.icon + ' ' + current.name;"
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
