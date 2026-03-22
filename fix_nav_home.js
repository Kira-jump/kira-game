const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

html = html.replace(
    `function showPageFromHome(page) {
    const moreBtn = document.querySelector('[onclick="showPage(\\'more\\', this)"]');
    if (moreBtn) showPage(page, moreBtn);
}`,
    `function showPageFromHome(page) {
    // Trouve n'importe quel bouton nav actif
    const anyBtn = document.querySelector('.nav-btn');
    showPage(page, anyBtn);
}`
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
