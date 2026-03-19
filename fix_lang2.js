const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

html = html.replace(
    `const rawLang = tg.initDataUnsafe?.user?.language_code || navigator.language || 'fr';
const userLang = rawLang.split('-')[0].toLowerCase();`,
    `// Détection langue multiple sources
let userLang = 'fr';
try {
    const tgLang = tg.initDataUnsafe?.user?.language_code;
    const navLang = navigator.language || navigator.userLanguage;
    const rawLang = tgLang || navLang || 'fr';
    userLang = rawLang.split('-')[0].toLowerCase();
    if (!TRANSLATIONS[userLang]) userLang = 'en';
    console.log('Langue détectée:', userLang, 'TG:', tgLang, 'Nav:', navLang);
} catch(e) { userLang = 'en'; }`
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
