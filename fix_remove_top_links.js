const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Enlève les quick-links du haut
html = html.replace(
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
    </div>`,
    ``
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
