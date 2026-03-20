const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Met à jour le CSS du header
html = html.replace(
'.game-header {\n    display: flex;\n    align-items: center;\n    padding: 10px 15px;\n    gap: 12px;\n    width: 100%;\n}',
`.game-header {
    display: flex;
    align-items: center;
    padding: 15px 15px 10px;
    gap: 15px;
    width: 100%;
    background: linear-gradient(180deg, rgba(22,33,62,0.8) 0%, transparent 100%);
}`);

html = html.replace(
'.avatar-circle {\n    width: 50px;\n    height: 50px;\n    border-radius: 50%;\n    border: 3px solid #cd7f32;\n    overflow: hidden;\n    flex-shrink: 0;\n    background: linear-gradient(135deg, #f0c040, #e07b00);\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 22px;\n}',
`.avatar-circle {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    border: 3px solid #cd7f32;
    overflow: visible;
    flex-shrink: 0;
    background: linear-gradient(135deg, #f0c040, #e07b00);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    position: relative;
    box-shadow: 0 0 20px rgba(205,127,50,0.4);
}
.avatar-level-tag {
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    background: #cd7f32;
    border-radius: 8px;
    padding: 2px 8px;
    font-size: 9px;
    font-weight: 900;
    white-space: nowrap;
    color: white;
    border: 1px solid rgba(255,255,255,0.2);
}`);

html = html.replace(
'.coins-cartouche {\n    flex-shrink: 0;\n    background: rgba(240,192,64,0.1);\n    border: 1px solid rgba(240,192,64,0.25);\n    border-radius: 15px;\n    padding: 8px 12px;\n    text-align: center;\n    min-width: 75px;\n}',
`.coins-cartouche {
    flex-shrink: 0;
    background: rgba(240,192,64,0.12);
    border: 1px solid rgba(240,192,64,0.3);
    border-radius: 18px;
    padding: 10px 15px;
    text-align: center;
    min-width: 90px;
    box-shadow: 0 0 15px rgba(240,192,64,0.1);
}`);

html = html.replace(
'.coins-cartouche-value {\n    font-size: 14px;\n    font-weight: 900;\n    color: #f0c040;\n    letter-spacing: -0.5px;\n}',
`.coins-cartouche-value {
    font-size: 18px;
    font-weight: 900;
    color: #f0c040;
    letter-spacing: -0.5px;
    line-height: 1.1;
}`);

html = html.replace(
'.header-progress-bar {\n    width: 100%;\n    height: 5px;\n    background: rgba(255,255,255,0.08);\n    border-radius: 10px;\n    overflow: hidden;\n}',
`.header-progress-bar {
    width: 100%;
    height: 6px;
    background: rgba(255,255,255,0.08);
    border-radius: 10px;
    overflow: visible;
    position: relative;
}
.header-progress-cursor {
    position: absolute;
    top: -4px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 8px solid #f0c040;
    transform: translateX(-50%);
    transition: left 0.5s ease;
}`);

// Ajoute le badge niveau et curseur dans le HTML
html = html.replace(
    '<div class="avatar-circle" id="avatar-circle">',
    `<div style="position:relative;display:inline-block">
            <div class="avatar-circle" id="avatar-circle">`
);

html = html.replace(
    '<span id="avatar-emoji">👊</span>\n            </div>',
    `<span id="avatar-emoji">👊</span>
            </div>
            <div class="avatar-level-tag" id="avatar-level-tag">🥉 Bronze</div>
            </div>`
);

html = html.replace(
    '<div class="header-progress-bar">\n                    <div class="header-progress-fill" id="level-progress-fill" style="width:0%"></div>\n                </div>',
    `<div class="header-progress-bar">
                    <div class="header-progress-fill" id="level-progress-fill" style="width:0%"></div>
                    <div class="header-progress-cursor" id="level-progress-cursor" style="left:0%"></div>
                </div>`
);

// Met à jour updateLevelUI pour le curseur et badge
html = html.replace(
    `const ln = document.getElementById('header-level-name');
    if (ln) { ln.textContent = current.icon + ' ' + current.name; ln.style.color = LEVEL_COLORS[current.name] || '#cd7f32'; }`,
    `const ln = document.getElementById('header-level-name');
    if (ln) { ln.textContent = current.icon + ' ' + current.name; ln.style.color = LEVEL_COLORS[current.name] || '#cd7f32'; }
    const tag = document.getElementById('avatar-level-tag');
    if (tag) { tag.textContent = current.icon + ' ' + current.name; tag.style.background = LEVEL_COLORS[current.name] || '#cd7f32'; }
    if (next) {
        const progress = Math.min(((totalCoins - current.min) / (next.min - current.min)) * 100, 100);
        const cursor = document.getElementById('level-progress-cursor');
        if (cursor) cursor.style.left = progress + '%';
    }`
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
