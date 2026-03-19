const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Remplace la détection de langue par un bouton manuel
html = html.replace(
    `// Détection langue multiple sources
let userLang = 'fr';
try {
    const tgLang = tg.initDataUnsafe?.user?.language_code;
    const navLang = navigator.language || navigator.userLanguage;
    const rawLang = tgLang || navLang || 'fr';
    userLang = rawLang.split('-')[0].toLowerCase();
    if (!TRANSLATIONS[userLang]) userLang = 'en';
    console.log('Langue détectée:', userLang, 'TG:', tgLang, 'Nav:', navLang);
} catch(e) { userLang = 'en'; }`,
    `let userLang = localStorage.getItem('lang_' + telegramId) || 'fr';`
);

// Ajoute bouton langue dans le header
html = html.replace(
    '<div class="player-info">',
    `<div style="display:flex;justify-content:flex-end;margin-bottom:10px">
        <button onclick="toggleLang()" id="lang-btn" style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:6px 15px;color:white;font-family:'Nunito',sans-serif;font-weight:800;font-size:13px;cursor:pointer;">
            🇫🇷 FR
        </button>
    </div>
    <div class="player-info">`
);

// Ajoute fonction toggleLang
html = html.replace(
    'function applyTranslations()',
    `function toggleLang() {
    userLang = userLang === 'fr' ? 'en' : 'fr';
    localStorage.setItem('lang_' + telegramId, userLang);
    document.getElementById('lang-btn').textContent = userLang === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN';
    applyTranslations();
    updateUI();
}

function applyTranslations()`
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
