const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

html = html.replace(
    `const ln = document.getElementById('header-level-name');
    if (ln) { ln.textContent = current.icon + ' ' + current.name; ln.style.color = LEVEL_COLORS[current.name] || '#cd7f32'; }`,
    `const ln = document.getElementById('header-level-name');
    if (ln) { ln.textContent = current.icon + ' ' + current.name; ln.style.color = LEVEL_COLORS[current.name] || '#cd7f32'; }
    // Sauvegarde le niveau si changé
    if (window.lastSavedLevel !== current.name) {
        window.lastSavedLevel = current.name;
        fetch(API + '/api/user/' + telegramId + '/update-level', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ level: current.name })
        }).catch(() => {});
    }`
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
