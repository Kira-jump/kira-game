const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Ajoute CSS floating links
html = html.replace('</style>', `
.floating-links {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.float-left {
    position: absolute;
    left: 10px;
    display: flex;
    flex-direction: column;
    gap: 15px;
}
.float-right {
    position: absolute;
    right: 10px;
    display: flex;
    flex-direction: column;
    gap: 15px;
}
.float-btn {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    cursor: pointer;
    transition: transform 0.2s;
    flex-direction: column;
    gap: 2px;
}
.float-btn:active { transform: scale(0.9); }
.float-btn-label { font-size: 8px; font-weight: 800; color: white; }
.float-red { background: rgba(255,50,50,0.2); border: 1px solid rgba(255,50,50,0.4); }
.float-green { background: rgba(0,200,100,0.2); border: 1px solid rgba(0,200,100,0.4); }
</style>`);

// Wrappe tap-container avec floating links
html = html.replace(
    '<div class="tap-container">',
    `<div class="floating-links">
        <div class="float-left">
            <div class="float-btn float-red" onclick="showPageFromHome('wheel')">
                🎰
                <span class="float-btn-label">Roue</span>
            </div>
            <div class="float-btn float-red" onclick="showPageFromHome('shop')">
                🛒
                <span class="float-btn-label">Shop</span>
            </div>
        </div>
        <div class="float-right">
            <div class="float-btn float-green" onclick="showPageFromHome('referral')">
                👥
                <span class="float-btn-label">Amis</span>
            </div>
            <div class="float-btn float-green" onclick="showPageFromHome('promo')">
                🎁
                <span class="float-btn-label">Promo</span>
            </div>
        </div>
        <div class="tap-container">`
);

// Ferme le div floating-links
html = html.replace(
    '</div>\n\n        <div class="tap-info"',
    '</div>\n        </div>\n\n        <div class="tap-info"'
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
