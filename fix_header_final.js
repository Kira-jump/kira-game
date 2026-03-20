const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Nouveau CSS header
html = html.replace(
`.game-header {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    gap: 12px;
    width: 100%;
}`,
`.game-header {
    padding: 12px 15px 0;
    width: 100%;
}
.game-header-top {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;
}
.game-header-progress {
    width: 100%;
    height: 6px;
    background: rgba(255,255,255,0.08);
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 3px;
}
.game-header-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #f0c040, #e07b00);
    border-radius: 10px;
    transition: width 0.5s ease;
}
.game-header-progress-text {
    display: flex;
    justify-content: space-between;
    font-size: 9px;
    color: #555;
    margin-bottom: 8px;
}`);

// Nouveau HTML header
html = html.replace(
`    <!-- NOUVEAU HEADER -->
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
        </div>`,
`    <!-- NOUVEAU HEADER -->
        <div class="game-header">
            <div class="game-header-top">
                <div class="avatar-circle" id="avatar-circle">
                    <img id="player-avatar" src="" style="display:none;width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none';document.getElementById('avatar-emoji').style.display='block'">
                    <span id="avatar-emoji">👊</span>
                </div>
                <div class="header-middle">
                    <div class="header-username" id="username">Joueur</div>
                    <div class="header-level-name" id="header-level-name">🥉 Bronze</div>
                </div>
                <div class="coins-cartouche">
                    <div style="display:flex;align-items:center;gap:6px;justify-content:center">
                        <span style="font-size:22px">🪙</span>
                        <div>
                            <div class="coins-cartouche-value" id="coins">0</div>
                            <div class="coins-cartouche-label">coins</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="game-header-progress">
                <div class="game-header-progress-fill" id="level-progress-fill" style="width:0%"></div>
            </div>
            <div class="game-header-progress-text">
                <span id="level-current-coins">0</span>
                <span id="level-next-coins">50K</span>
            </div>
        </div>`);

// Met à jour updateLevelUI pour la nouvelle barre
html = html.replace(
    `const fill = document.getElementById('level-progress-fill');
        if (fill) fill.style.width = Math.min(progress, 100) + '%';`,
    `const fill = document.getElementById('level-progress-fill');
        if (fill) { fill.style.width = Math.min(progress, 100) + '%'; fill.className = 'game-header-progress-fill'; }`
);

// Coins cartouche plus grand
html = html.replace(
`.coins-cartouche {
    flex-shrink: 0;
    background: rgba(240,192,64,0.1);
    border: 1px solid rgba(240,192,64,0.25);
    border-radius: 12px;
    padding: 5px 10px;
    text-align: center;
    min-width: 65px;
}`,
`.coins-cartouche {
    flex-shrink: 0;
    background: rgba(240,192,64,0.1);
    border: 1px solid rgba(240,192,64,0.25);
    border-radius: 15px;
    padding: 8px 15px;
    text-align: center;
    min-width: 110px;
}`);

html = html.replace(
`.coins-cartouche-value {
    font-size: 12px;
    font-weight: 900;
    color: #f0c040;
    letter-spacing: -0.5px;
}`,
`.coins-cartouche-value {
    font-size: 16px;
    font-weight: 900;
    color: #f0c040;
    letter-spacing: -0.5px;
    line-height: 1.1;
}`);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
