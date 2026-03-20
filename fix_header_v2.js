const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Ajoute CSS nouveau header
html = html.replace('.home {', `.game-header {
    display: flex;
    align-items: center;
    padding: 12px 15px;
    gap: 12px;
    width: 100%;
    margin-bottom: 10px;
}
.avatar-circle {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: 3px solid #cd7f32;
    overflow: hidden;
    flex-shrink: 0;
    background: linear-gradient(135deg, #f0c040, #e07b00);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    position: relative;
}
.avatar-circle img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}
.header-middle {
    flex: 1;
    min-width: 0;
}
.header-username {
    font-size: 13px;
    font-weight: 800;
    color: white;
    margin-bottom: 4px;
}
.header-level-name {
    font-size: 10px;
    color: #cd7f32;
    font-weight: 700;
    margin-bottom: 6px;
}
.header-progress-bar {
    width: 100%;
    height: 5px;
    background: rgba(255,255,255,0.08);
    border-radius: 10px;
    overflow: hidden;
}
.header-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #f0c040, #e07b00);
    border-radius: 10px;
    transition: width 0.5s ease;
}
.header-progress-text {
    display: flex;
    justify-content: space-between;
    font-size: 9px;
    color: #555;
    margin-top: 3px;
}
.coins-cartouche {
    flex-shrink: 0;
    background: rgba(240,192,64,0.1);
    border: 1px solid rgba(240,192,64,0.25);
    border-radius: 15px;
    padding: 8px 12px;
    text-align: center;
    min-width: 75px;
}
.coins-cartouche-icon { font-size: 16px; }
.coins-cartouche-value {
    font-size: 14px;
    font-weight: 900;
    color: #f0c040;
    letter-spacing: -0.5px;
}
.coins-cartouche-label { font-size: 9px; color: #888; }
.home {`);

// Remplace le contenu du home
html = html.replace(
`<div class="page active" id="page-home">
    <div class="home">
        <div class="player-info">
            <div class="player-avatar-display" id="player-avatar" onclick="openAvatarSelector()">👊</div>
            <div class="player-name" id="username">Joueur</div>
        </div>

        <div class="coins-container">
            <div class="coins-label" data-i18n="your_coins">💰 Tes coins</div>
            <div class="coins" id="coins">0</div>
        </div>

        <div class="stats-row">
            <div class="stat-box">
                <strong id="per-hour-val">0</strong>
                coins/heure
            </div>
            <div class="stat-box">
                <strong id="tap-value">1</strong>
                par tap
            </div>
        </div>`,
`<div class="page active" id="page-home">
    <!-- HEADER -->
    <div class="game-header">
        <div class="avatar-circle" id="avatar-circle">
            <img id="player-avatar" src="" style="display:none" onerror="this.style.display='none';document.getElementById('avatar-emoji').style.display='flex'">
            <span id="avatar-emoji" style="display:flex">👊</span>
        </div>
        <div class="header-middle">
            <div class="header-username" id="username">Joueur</div>
            <div class="header-level-name" id="header-level-name">🥉 Bronze</div>
            <div class="header-progress-bar">
                <div class="header-progress-fill" id="level-progress-fill" style="width:0%"></div>
            </div>
            <div class="header-progress-text">
                <span id="level-current-coins">0</span>
                <span id="level-next-coins">50K</span>
            </div>
        </div>
        <div class="coins-cartouche">
            <div class="coins-cartouche-icon">🪙</div>
            <div class="coins-cartouche-value" id="coins">0</div>
            <div class="coins-cartouche-label">coins</div>
        </div>
    </div>

    <div class="home">
        <div class="stats-row">
            <div class="stat-box">
                <strong id="per-hour-val">0</strong>
                coins/heure
            </div>
            <div class="stat-box">
                <strong id="tap-value">1</strong>
                par tap
            </div>
        </div>`
);

// Cache les anciens éléments
html = html.replace(
    'const LEVEL_COLORS = {',
    `// Couleurs par niveau
const LEVEL_COLORS = {`
);

// Met à jour updateLevelUI pour le nouveau header
html = html.replace(
    'function updateLevelUI() {',
    `const LEVEL_COLORS = {
    Bronze: '#cd7f32',
    Silver: '#c0c0c0',
    Gold: '#ffd700',
    Platinum: '#00bfff',
    Diamond: '#b9f2ff',
    Legend: '#ff6600'
};

function updateLevelUI() {
    const current = getCurrentLevel();
    const next = getNextLevel();
    // Couleur bordure avatar
    const circle = document.getElementById('avatar-circle');
    if (circle) circle.style.borderColor = LEVEL_COLORS[current.name] || '#cd7f32';
    // Nom niveau
    const levelName = document.getElementById('header-level-name');
    if (levelName) {
        levelName.textContent = current.icon + ' ' + current.name;
        levelName.style.color = LEVEL_COLORS[current.name] || '#cd7f32';
    }
    // Barre progression
    if (next) {
        const progress = ((totalCoins - current.min) / (next.min - current.min)) * 100;
        const fill = document.getElementById('level-progress-fill');
        if (fill) fill.style.width = Math.min(progress, 100) + '%';
        const curr = document.getElementById('level-current-coins');
        const nxt = document.getElementById('level-next-coins');
        if (curr) curr.textContent = formatNumber(totalCoins - current.min);
        if (nxt) nxt.textContent = formatNumber(next.min - current.min);
    } else {
        const fill = document.getElementById('level-progress-fill');
        if (fill) fill.style.width = '100%';
    }
    // Cache anciens badges
    const oldBadge = document.getElementById('level-badge');
    if (oldBadge) oldBadge.style.display = 'none';
    const oldProgress = document.querySelector('.level-progress');
    if (oldProgress) oldProgress.style.display = 'none';`
);

// Fix photo profil
html = html.replace(
    `fetch(API + '/api/user/' + telegramId + '/photo')
                .then(r => r.json())
                .then(data => {
                    if (data.photoUrl) {
                        const img = document.getElementById('player-avatar');
                        img.src = data.photoUrl;
                        img.style.display = 'block';
                        document.getElementById('avatar-fallback').style.display = 'none';
                    }
                }).catch(() => {});`,
    `fetch(API + '/api/user/' + telegramId + '/photo')
                .then(r => r.json())
                .then(data => {
                    if (data.photoUrl) {
                        const img = document.getElementById('player-avatar');
                        img.src = data.photoUrl;
                        img.style.display = 'block';
                        document.getElementById('avatar-emoji').style.display = 'none';
                    }
                }).catch(() => {});`
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
