const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Ajoute CSS quick links
html = html.replace('</style>', `
.quick-links {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin: 8px 0;
}
.quick-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    transition: transform 0.2s;
}
.quick-link:active { transform: scale(0.9); }
.quick-link-icon {
    width: 45px;
    height: 45px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
}
.quick-link-label { font-size: 9px; color: #888; font-weight: 700; }
</style>`);

// Ajoute quick links avant tap-container
html = html.replace(
    '<div class="tap-container">',
    `<div class="quick-links">
        <div class="quick-link" onclick="showPageFromHome('wheel')">
            <div class="quick-link-icon" style="background:rgba(255,50,50,0.15);border:1px solid rgba(255,50,50,0.3);">🎰</div>
            <div class="quick-link-label">Roue</div>
        </div>
        <div class="quick-link" onclick="showPageFromHome('shop')">
            <div class="quick-link-icon" style="background:rgba(255,50,50,0.15);border:1px solid rgba(255,50,50,0.3);">🛒</div>
            <div class="quick-link-label">Boutique</div>
        </div>
        <div class="quick-link" onclick="showPageFromHome('referral')">
            <div class="quick-link-icon" style="background:rgba(0,200,100,0.15);border:1px solid rgba(0,200,100,0.3);">👥</div>
            <div class="quick-link-label">Amis</div>
        </div>
        <div class="quick-link" onclick="showPageFromHome('promo')">
            <div class="quick-link-icon" style="background:rgba(0,200,100,0.15);border:1px solid rgba(0,200,100,0.3);">🎁</div>
            <div class="quick-link-label">Promo</div>
        </div>
    </div>
    <div class="tap-container">`
);

// Ajoute fonction showPageFromHome
html = html.replace(
    'function navigateTo(page) {',
    `function showPageFromHome(page) {
    const moreBtn = document.querySelector('[onclick="showPage(\\'more\\', this)"]');
    if (moreBtn) showPage(page, moreBtn);
}

function navigateTo(page) {`
);

// Supprime bouton Plus de la nav
html = html.replace(
    `    <button class="nav-btn" onclick="showPage('more', this)">
        <span class="nav-icon">⋯</span>Plus
    </button>`,
    ``
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
