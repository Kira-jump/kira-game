const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Ajoute CSS
html = html.replace('</style>', `
.game-header {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    gap: 12px;
    width: 100%;
}
.avatar-circle {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 3px solid #cd7f32;
    overflow: hidden;
    flex-shrink: 0;
    background: linear-gradient(135deg, #f0c040, #e07b00);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
}
.avatar-circle img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.header-middle {
    flex: 1;
    min-width: 0;
}
.header-username {
    font-size: 13px;
    font-weight: 800;
    color: white;
    margin-bottom: 2px;
}
.header-level-name {
    font-size: 10px;
    color: #cd7f32;
    font-weight: 700;
    margin-bottom: 5px;
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
    margin-top: 2px;
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
</style>`);

// Remplace juste la section player-info + level-badge + level-progress + coins-container
const oldSection = `        <div class="player-info">
            <img id="player-avatar" src="" style="width:36px;height:36px;border-radius:50%;object-fit:cover;background:linear-gradient(135deg,#f0c040,#e07b00);" onerror="this.style.display='none'">
            <div class="player-name" id="username">Joueur</div>
        </div>

        <div class="level-badge" id="level-badge">🥉 Bronze</div>
    <div class="level-progress">
        <div class="level-progress-bar">
            <div class="level-progress-fill" id="level-progress-fill" style="width:0%"></div>
        </div>
        <div class="level-progress-text">
            <span id="level-current-coins">0</span>
            <span id="level-next-coins">50K</span>
        </div>
    </div>
    <button class="wallet-btn" id="wallet-btn" onclick="connectWallet()">
        💎 Connecter Wallet TON
    </button>
    <div class="wallet-connected" id="wallet-connected">
        ✅ Wallet connecté !<br><span id="wallet-address" style="font-size:11px;color:#aaa;"></span>
    </div>
    <div class="coins-container">
            <div class="coins-label">💰 Tes coins</div>
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
        </div>`;

const newSection = `        <!-- NOUVEAU HEADER -->
        <div class="game-header">
            <div class="avatar-circle" id="avatar-circle">
                <img id="player-avatar" src="" style="display:none;width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none';document.getElementById('avatar-emoji').style.display='block'">
                <span id="avatar-emoji">👊</span>
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

        <!-- WALLET (caché par défaut) -->
        <button class="wallet-btn" id="wallet-btn" onclick="connectWallet()" style="margin:5px auto;">
            💎 Connecter Wallet TON
        </button>
        <div class="wallet-connected" id="wallet-connected">
            ✅ Wallet connecté !<br><span id="wallet-address" style="font-size:11px;color:#aaa;"></span>
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
        </div>`;

html = html.replace(oldSection, newSection);

// Met à jour updateLevelUI
html = html.replace(
    'function updateLevelUI() {\n    const current = getCurrentLevel();\n    const next = getNextLevel();',
    `const LEVEL_COLORS = { Bronze: '#cd7f32', Silver: '#c0c0c0', Gold: '#ffd700', Platinum: '#00bfff', Diamond: '#b9f2ff', Legend: '#ff6600' };
function updateLevelUI() {
    const current = getCurrentLevel();
    const next = getNextLevel();
    const circle = document.getElementById('avatar-circle');
    if (circle) circle.style.borderColor = LEVEL_COLORS[current.name] || '#cd7f32';
    const ln = document.getElementById('header-level-name');
    if (ln) { ln.textContent = current.icon + ' ' + current.name; ln.style.color = LEVEL_COLORS[current.name] || '#cd7f32'; }`
);

// Met à jour photo profil
html = html.replace(
    `if (data.photoUrl) {
                        document.getElementById('player-avatar').src = data.photoUrl;
                        document.getElementById('player-avatar').style.display = 'block';
                    } else {
                        document.getElementById('player-avatar').style.display = 'none';
                    }`,
    `if (data.photoUrl) {
                        const img = document.getElementById('player-avatar');
                        img.src = data.photoUrl;
                        img.style.display = 'block';
                        const emoji = document.getElementById('avatar-emoji');
                        if (emoji) emoji.style.display = 'none';
                    }`
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
