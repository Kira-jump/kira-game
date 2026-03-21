const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Remplace toute la nav
html = html.replace(
    `<nav class="nav">
    <button class="nav-btn active" onclick="showPage('home', this)">
        <span class="nav-icon">🎮</span>Jouer
    </button>
    <button class="nav-btn" onclick="showPage('cards', this)">
        <span class="nav-icon">🃏</span>Cartes
    </button>
    <button class="nav-btn" onclick="showPage('missions', this)">
        <span class="nav-icon">🎯</span>Missions
    </button>
    <button class="nav-btn" onclick="showPage('wheel', this)">
        <span class="nav-icon">🎰</span>Roue
    </button>
    <button class="nav-btn" onclick="showPage('shop', this)">
        <span class="nav-icon">🛒</span>Shop
    </button>
    <button class="nav-btn" onclick="showPage('promo', this)">
        <span class="nav-icon">🎁</span>Promo
    </button>
    <button class="nav-btn" onclick="showPage('leaderboard', this)">
        <span class="nav-icon">🏆</span>Top
    </button>
    <button class="nav-btn" onclick="showPage('referral', this)">
        <span class="nav-icon">👥</span>Amis
    </button>
    <button class="nav-btn" onclick="showPage('stats', this)">
        <span class="nav-icon">📊</span>Stats
    </button>
</nav>`,
    `<nav class="nav">
    <button class="nav-btn active" onclick="showPage('home', this)">
        <span class="nav-icon">🎮</span>Jouer
    </button>
    <button class="nav-btn" onclick="showPage('cards', this)">
        <span class="nav-icon">🃏</span>Cartes
    </button>
    <button class="nav-btn" onclick="showPage('missions', this)">
        <span class="nav-icon">🎯</span>Missions
    </button>
    <button class="nav-btn" onclick="showPage('leaderboard', this)">
        <span class="nav-icon">🏆</span>Top
    </button>
    <button class="nav-btn" onclick="showPage('more', this)">
        <span class="nav-icon">⋯</span>Plus
    </button>
</nav>`
);

// Ajoute page "Plus" avec les autres options
html = html.replace('<!-- STATS -->', `<!-- MORE -->
<div class="page" id="page-more">
    <h2>⋯ Plus</h2>
    <div class="more-grid">
        <div class="more-item" onclick="navigateTo('wheel')">
            <div class="more-icon">🎰</div>
            <div class="more-name">Roue</div>
        </div>
        <div class="more-item" onclick="navigateTo('shop')">
            <div class="more-icon">🛒</div>
            <div class="more-name">Boutique</div>
        </div>
        <div class="more-item" onclick="navigateTo('promo')">
            <div class="more-icon">🎁</div>
            <div class="more-name">Promo</div>
        </div>
        <div class="more-item" onclick="navigateTo('referral')">
            <div class="more-icon">👥</div>
            <div class="more-name">Amis</div>
        </div>
        <div class="more-item" onclick="navigateTo('stats')">
            <div class="more-icon">📊</div>
            <div class="more-name">Stats</div>
        </div>
    </div>
</div>

<!-- STATS -->`);

// Ajoute CSS more grid
html = html.replace('</style>', `
.more-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    margin-top: 10px;
}
.more-item {
    background: rgba(22,33,62,0.9);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px;
    padding: 20px 10px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
}
.more-item:active { transform: scale(0.95); border-color: rgba(240,192,64,0.4); }
.more-icon { font-size: 36px; margin-bottom: 8px; }
.more-name { font-size: 13px; font-weight: 800; color: #aaa; }
</style>`);

// Ajoute fonction navigateTo
html = html.replace(
    'async function loadStats()',
    `function navigateTo(page) {
    const moreBtn = document.querySelector('.nav-btn:last-child');
    const targetBtn = document.querySelector('[onclick="showPage(\\'more\\', this)"]');
    showPage(page, targetBtn);
}

async function loadStats()`
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
