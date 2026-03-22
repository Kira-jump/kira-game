const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Renforce anti-zoom
html = html.replace(
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">'
);

// Ajoute CSS anti-zoom complet
html = html.replace(
    '* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; touch-action: manipulation; }',
    `* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
html { touch-action: pan-x pan-y; }
input, textarea, select { font-size: 16px !important; }`
);

// Ajoute JS anti-zoom
html = html.replace(
    'tg.expand();',
    `tg.expand();
// Anti zoom
document.addEventListener('gesturestart', e => e.preventDefault());
document.addEventListener('gesturechange', e => e.preventDefault());
document.addEventListener('gestureend', e => e.preventDefault());
document.addEventListener('touchmove', e => { if (e.scale !== 1) e.preventDefault(); }, { passive: false });`
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
