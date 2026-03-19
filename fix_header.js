const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Remplace le CSS du header
html = html.replace(
    '.player-info {',
    `.game-header {
    display: flex;
    align-items: center;
    padding: 12px 15px;
    gap: 12px;
    width: 100%;
}
.avatar-wrapper {
    position: relative;
    flex-shrink: 0;
}
.avatar-circle {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: 3px solid #cd7f32;
    padding: 2px;
    position: relative;
}
.avatar-circle img, .avatar-circle .avatar-emoji-display {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    background: linear-gradient(135deg, #f0c040, #e07b00);
}
.avatar-level-badge {
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    background: #cd7f32;
    border-radius: 8px;
    padding: 1px 5px;
    font-size: 8px;
    font-weight: 900;
    white-space: nowrap;
    color: white;
}
.header-middle {
    flex: 1;
    min-width: 0;
}
.header-username {
    font-size: 13px;
    font-weight: 800;
    color: white;
    margin-bottom: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
    min-width: 80px;
}
.coins-cartouche-icon { font-size: 18px; line-height: 1; }
.coins-cartouche-value {
    font-size: 13px;
    font-weight: 900;
    color: #f0c040;
    font-family: 'Nunito', sans-serif;
    letter-spacing: -0.5px;
}
.coins-cartouche-label {
    font-size: 9px;
    color: #888;
    margin-top: 1px;
}
.player-info {`
);

// Remplace le HTML du home
html = html.replace(
    `<div class="home">
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
    `<!-- NOUVEAU HEADER -->
    <div class="game-header">
        <div class="avatar-wrapper">
            <div class="avatar-circle">
                <img id="player-avatar" src="" style="display:none;width:100%;height:100%;border-radius:50%;object-fit:cover;" onerror="this.style.display='none';document.getElementById('avatar-fallback').style.display='flex'">
                <div id="avatar-fallback" style="width:100%;height:100%;border-radius:50%;background:linear-gradient(135deg,#f0c040,#e07b00);display:flex;align-items:center;justify-content:center;font-size:22px;">👊</div>
            </div>
            <div class="avatar-level-badge" id="header-level-badge">🥉 Bronze</div>
        </div>

        <div class="header-middle">
            <div class="header-username" id="username">Joueur</div>
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

    <div class="home">`
);

// Ferme le div home correctement
html = html.replace(
    '<div class="tap-container">',
    `<div class="stats-row" style="margin-top:5px">
            <div class="stat-box">
                <strong id="per-hour-val">0</strong>
                coins/heure
            </div>
            <div class="stat-box">
                <strong id="tap-value">1</strong>
                par tap
            </div>
        </div>
        <div class="tap-container">`
);

// Supprime l'ancien stats-row
html = html.replace(
    `<div class="stats-row">
            <div class="stat-box">
                <strong id="per-hour-val">0</strong>
                coins/heure
            </div>
            <div class="stat-box">
                <strong id="tap-value">1</strong>
                par tap
            </div>
        </div>
        <div class="stats-row" style="margin-top:5px">
            <div class="stat-box">
                <strong id="per-hour-val">0</strong>
                coins/heure
            </div>
            <div class="stat-box">
                <strong id="tap-value">1</strong>
                par tap
            </div>
        </div>`,
    `<div class="stats-row" style="margin-top:5px">
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

// Met à jour la couleur de bordure selon le niveau
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
    // Met à jour couleur bordure avatar
    const circle = document.querySelector('.avatar-circle');
    if (circle) circle.style.borderColor = LEVEL_COLORS[current.name] || '#cd7f32';
    // Met à jour badge niveau
    const badge = document.getElementById('header-level-badge');
    if (badge) {
        badge.textContent = current.icon + ' ' + current.name;
        badge.style.background = LEVEL_COLORS[current.name] || '#cd7f32';
    }
    // Cache l'ancien badge
    const oldBadge = document.getElementById('level-badge');
    if (oldBadge) oldBadge.style.display = 'none';
    const oldProgress = document.querySelector('.level-progress');
    if (oldProgress) oldProgress.style.display = 'none';`
);

// Fix photo profil avec fallback
html = html.replace(
    `fetch(API + '/api/user/' + telegramId + '/photo')
                .then(r => r.json())
                .then(data => {
                    if (data.photoUrl) {
                        document.getElementById('player-avatar').src = data.photoUrl;
                        document.getElementById('player-avatar').style.display = 'block';
                    } else {
                        document.getElementById('player-avatar').style.display = 'none';
                    }
                }).catch(() => {
                    document.getElementById('player-avatar').style.display = 'none';
                });`,
    `fetch(API + '/api/user/' + telegramId + '/photo')
                .then(r => r.json())
                .then(data => {
                    if (data.photoUrl) {
                        const img = document.getElementById('player-avatar');
                        img.src = data.photoUrl;
                        img.style.display = 'block';
                        document.getElementById('avatar-fallback').style.display = 'none';
                    }
                }).catch(() => {});`
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
