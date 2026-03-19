const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Ajoute CSS niveau
html = html.replace('</style>', `
.level-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: linear-gradient(135deg, rgba(240,192,64,0.2), rgba(224,123,0,0.1));
    border: 1px solid rgba(240,192,64,0.3);
    border-radius: 20px;
    padding: 6px 15px;
    font-size: 13px;
    font-weight: 800;
    margin-bottom: 10px;
}
.level-progress {
    width: 100%;
    max-width: 300px;
    margin: 5px auto 15px;
}
.level-progress-bar {
    width: 100%;
    height: 6px;
    background: rgba(255,255,255,0.1);
    border-radius: 10px;
    overflow: hidden;
    margin-top: 5px;
}
.level-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #f0c040, #e07b00);
    border-radius: 10px;
    transition: width 0.5s ease;
}
.level-progress-text {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: #888;
    margin-top: 3px;
}
</style>`);

// Ajoute badge niveau dans home après player-info
html = html.replace(
    '<button class="wallet-btn"',
    `<div class="level-badge" id="level-badge">🥉 Bronze</div>
    <div class="level-progress">
        <div class="level-progress-bar">
            <div class="level-progress-fill" id="level-progress-fill" style="width:0%"></div>
        </div>
        <div class="level-progress-text">
            <span id="level-current-coins">0</span>
            <span id="level-next-coins">50K</span>
        </div>
    </div>
    <button class="wallet-btn"`
);

// Ajoute JS niveaux
html = html.replace('const BOOSTS =', `
const LEVELS = [
    { name: 'Bronze', icon: '🥉', min: 0, tapBonus: 1 },
    { name: 'Silver', icon: '🥈', min: 50000, tapBonus: 2 },
    { name: 'Gold', icon: '🥇', min: 500000, tapBonus: 3 },
    { name: 'Platinum', icon: '💠', min: 2000000, tapBonus: 4 },
    { name: 'Diamond', icon: '💎', min: 10000000, tapBonus: 5 },
    { name: 'Legend', icon: '👑', min: 50000000, tapBonus: 10 },
];

let totalCoins = 0;

function getCurrentLevel() {
    let level = LEVELS[0];
    for (const l of LEVELS) {
        if (totalCoins >= l.min) level = l;
    }
    return level;
}

function getNextLevel() {
    const current = getCurrentLevel();
    const idx = LEVELS.findIndex(l => l.name === current.name);
    return LEVELS[idx + 1] || null;
}

function updateLevelUI() {
    const current = getCurrentLevel();
    const next = getNextLevel();
    document.getElementById('level-badge').textContent = current.icon + ' ' + current.name;
    if (next) {
        const progress = ((totalCoins - current.min) / (next.min - current.min)) * 100;
        document.getElementById('level-progress-fill').style.width = Math.min(progress, 100) + '%';
        document.getElementById('level-current-coins').textContent = formatNumber(totalCoins - current.min);
        document.getElementById('level-next-coins').textContent = formatNumber(next.min - current.min);
    } else {
        document.getElementById('level-progress-fill').style.width = '100%';
        document.getElementById('level-current-coins').textContent = '👑 MAX';
        document.getElementById('level-next-coins').textContent = 'Legend';
    }
}

const BOOSTS =`
);

// Mets à jour loadUser pour récupérer total_coins
html = html.replace(
    'referrals = parseInt(user.referrals) || 0;',
    `referrals = parseInt(user.referrals) || 0;
            totalCoins = parseInt(user.total_coins) || 0;
            updateLevelUI();`
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
