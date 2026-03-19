const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Remplace la page leaderboard
html = html.replace(
    `<div class="page" id="page-leaderboard">
    <h2>🏆 Classement</h2>
    <div id="leaderboard-list"></div>
</div>`,
    `<div class="page" id="page-leaderboard">
    <h2>🏆 Classement</h2>
    <div class="level-tabs" id="level-tabs">
        <button class="level-tab active" onclick="switchLeaderboard('Bronze', this)">🥉</button>
        <button class="level-tab" onclick="switchLeaderboard('Silver', this)">🥈</button>
        <button class="level-tab" onclick="switchLeaderboard('Gold', this)">🥇</button>
        <button class="level-tab" onclick="switchLeaderboard('Platinum', this)">💠</button>
        <button class="level-tab" onclick="switchLeaderboard('Diamond', this)">💎</button>
        <button class="level-tab" onclick="switchLeaderboard('Legend', this)">👑</button>
    </div>
    <div class="level-tab-title" id="level-tab-title">🥉 Bronze</div>
    <div id="leaderboard-list"></div>
</div>`
);

// Ajoute CSS tabs
html = html.replace('</style>', `
.level-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 15px;
    overflow-x: auto;
    padding-bottom: 5px;
}
.level-tab {
    background: rgba(22,33,62,0.9);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 10px 15px;
    font-size: 20px;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
}
.level-tab.active {
    border-color: #f0c040;
    background: rgba(240,192,64,0.15);
    transform: scale(1.1);
}
.level-tab-title {
    font-size: 16px;
    font-weight: 900;
    color: #f0c040;
    margin-bottom: 15px;
    text-align: center;
}
.empty-leaderboard {
    text-align: center;
    padding: 40px 20px;
    color: #555;
    font-size: 14px;
}
.empty-leaderboard .empty-icon { font-size: 48px; margin-bottom: 10px; }
.my-rank {
    background: linear-gradient(135deg, rgba(240,192,64,0.15), rgba(224,123,0,0.1));
    border: 1px solid rgba(240,192,64,0.3);
    border-radius: 12px;
    padding: 12px 15px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
}
.my-rank-label { color: #f0c040; font-weight: 800; }
</style>`);

// Remplace la fonction loadLeaderboard
html = html.replace(
    `async function loadLeaderboard() {
    try {
        const res = await fetch(API + '/api/leaderboard');
        const users = await res.json();
        const medals = ['🥇', '🥈', '🥉'];
        document.getElementById('leaderboard-list').innerHTML = users.map((u, i) => \`
            <div class="leader-item">
                <div class="leader-rank">\${medals[i] || (i+1)}</div>
                <div class="leader-avatar">👤</div>
                <div class="leader-name">\${u.username}</div>
                <div class="leader-coins">💰 \${formatNumber(u.coins)}</div>
            </div>
        \`).join('');
    } catch(e) {}
}`,
    `let currentLeaderboardLevel = 'Bronze';
const LEVEL_ICONS = { Bronze: '🥉', Silver: '🥈', Gold: '🥇', Platinum: '💠', Diamond: '💎', Legend: '👑' };

async function switchLeaderboard(level, btn) {
    document.querySelectorAll('.level-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    currentLeaderboardLevel = level;
    document.getElementById('level-tab-title').textContent = LEVEL_ICONS[level] + ' ' + level;
    await loadLeaderboard();
}

async function loadLeaderboard() {
    try {
        const res = await fetch(API + '/api/leaderboard?level=' + currentLeaderboardLevel);
        const users = await res.json();
        const list = document.getElementById('leaderboard-list');

        // Montre le rang du joueur actuel
        const myIndex = users.findIndex(u => u.username === telegramUsername);
        const myRankHtml = myIndex >= 0 ? \`
            <div class="my-rank">
                <div class="leader-rank">\${myIndex + 1}</div>
                <div class="leader-name my-rank-label">👤 Toi - \${telegramUsername}</div>
                <div class="leader-coins">💰 \${formatNumber(coins)}</div>
            </div>
        \` : '';

        if (users.length === 0) {
            list.innerHTML = \`
                \${myRankHtml}
                <div class="empty-leaderboard">
                    <div class="empty-icon">\${LEVEL_ICONS[currentLeaderboardLevel]}</div>
                    <p>Aucun joueur en \${currentLeaderboardLevel} pour l'instant !</p>
                    <p style="margin-top:8px;color:#444">Sois le premier ! 🚀</p>
                </div>
            \`;
            return;
        }

        list.innerHTML = myRankHtml + users.map((u, i) => \`
            <div class="leader-item" style="\${u.username === telegramUsername ? 'border-color:rgba(240,192,64,0.4)' : ''}">
                <div class="leader-rank">\${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i+1)}</div>
                <div class="leader-avatar">\${u.avatar || '👊'}</div>
                <div class="leader-name">\${u.username}\${u.username === telegramUsername ? ' 👈' : ''}</div>
                <div class="leader-coins">💰 \${formatNumber(u.coins)}</div>
            </div>
        \`).join('');
    } catch(e) {}
}`
);

// Met à jour showPage pour charger le bon niveau
html = html.replace(
    "if (name === 'leaderboard') loadLeaderboard();",
    `if (name === 'leaderboard') {
        // Auto-switch vers le niveau du joueur
        const playerLevel = getCurrentLevel().name;
        currentLeaderboardLevel = playerLevel;
        document.getElementById('level-tab-title').textContent = LEVEL_ICONS[playerLevel] + ' ' + playerLevel;
        document.querySelectorAll('.level-tab').forEach((t, i) => {
            const levels = ['Bronze','Silver','Gold','Platinum','Diamond','Legend'];
            t.classList.toggle('active', levels[i] === playerLevel);
        });
        loadLeaderboard();
    }`
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
