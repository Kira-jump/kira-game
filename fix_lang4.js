const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Ajoute data-i18n aux éléments clés
html = html.replace('<div class="coins-label">', '<div class="coins-label" data-i18n="your_coins">');
html = html.replace('Tape pour gagner des coins !</div>', 'Tape pour gagner des coins !</div>'.replace('Tape pour gagner des coins !', '<span data-i18n="tap_info">Tape pour gagner des coins !</span>'));

// Remplace applyTranslations par une version plus robuste
html = html.replace(
    'function applyTranslations() {',
    `function applyTranslations() {
    const l = lang;
    // Méthode simple - remplace directement les textes
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (l[key]) el.innerHTML = l[key];
    });
    // Bouton langue
    document.getElementById('lang-btn').textContent = userLang === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN';
    // Nav
    const navLabels = document.querySelectorAll('.nav-btn');
    const keys = ['nav_play','nav_cards','nav_missions','nav_wheel','nav_top','nav_friends'];
    navLabels.forEach((btn, i) => {
        if(keys[i]) {
            const icon = btn.querySelector('.nav-icon');
            if(icon) btn.innerHTML = icon.outerHTML + l[keys[i]];
        }
    });
    // Wallet btn
    const wb = document.getElementById('wallet-btn');
    if(wb) wb.innerHTML = l.connect_wallet;
    // Stats boxes
    const boxes = document.querySelectorAll('.stat-box');
    if(boxes[0]) boxes[0].innerHTML = '<strong id="per-hour-val">' + formatNumber(coinsPerHour) + '</strong>' + l.coins_hour;
    if(boxes[1]) boxes[1].innerHTML = '<strong id="tap-value">' + coinsPerTap + '</strong>' + l.per_tap;
    // Spin btn
    updateWheelStatus();
}
function applyTranslations_old() {`
);

// Ferme la vieille fonction
html = html.replace(
    "if (userLang === 'ar') {\n        document.body.style.direction = 'rtl';\n    }\n}",
    "if (userLang === 'ar') {\n        document.body.style.direction = 'rtl';\n    }\n}}"
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
