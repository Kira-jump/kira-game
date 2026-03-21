const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Ajoute CSS stats
html = html.replace('</style>', `
.stats-page {
    padding-bottom: 90px;
}
.player-profile-card {
    background: linear-gradient(135deg, rgba(240,192,64,0.15), rgba(224,123,0,0.05));
    border: 1px solid rgba(240,192,64,0.2);
    border-radius: 20px;
    padding: 20px;
    text-align: center;
    margin-bottom: 15px;
    position: relative;
    overflow: hidden;
}
.profile-avatar-large {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin: 0 auto 10px;
    border: 3px solid #f0c040;
    overflow: hidden;
    background: linear-gradient(135deg, #f0c040, #e07b00);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
}
.profile-avatar-large img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.profile-name { font-size: 22px; font-weight: 900; margin-bottom: 5px; }
.profile-level {
    display: inline-block;
    border-radius: 10px;
    padding: 4px 12px;
    font-size: 13px;
    font-weight: 800;
    margin-bottom: 15px;
}
.profile-rank {
    font-size: 14px;
    color: #aaa;
}
.profile-rank span { color: #f0c040; font-weight: 900; font-size: 18px; }
.stats-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 15px;
}
.stats-card {
    background: rgba(22,33,62,0.9);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px;
    padding: 15px;
    text-align: center;
}
.stats-card-icon { font-size: 28px; margin-bottom: 8px; }
.stats-card-value {
    font-size: 18px;
    font-weight: 900;
    color: #f0c040;
    margin-bottom: 3px;
}
.stats-card-label { font-size: 11px; color: #888; }
.streak-card {
    background: linear-gradient(135deg, rgba(255,100,0,0.15), rgba(255,50,0,0.05));
    border: 1px solid rgba(255,100,0,0.3);
    border-radius: 20px;
    padding: 20px;
    text-align: center;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 15px;
}
.streak-icon { font-size: 48px; }
.streak-info { text-align: left; }
.streak-value { font-size: 36px; font-weight: 900; color: #ff6400; line-height: 1; }
.streak-label { font-size: 13px; color: #aaa; margin-top: 3px; }
.wheel-stats-card {
    background: rgba(22,33,62,0.9);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px;
    padding: 20px;
    margin-bottom: 15px;
}
.wheel-stats-card h3 { font-size: 15px; font-weight: 800; margin-bottom: 15px; color: #f0c040; }
.wheel-stat-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    font-size: 13px;
}
.wheel-stat-row:last-child { border-bottom: none; }
</style>`);

// Ajoute page stats avant nav
html = html.replace('<!-- NAV -->', `<!-- STATS -->
<div class="page" id="page-stats">
    <div class="stats-page">
        <h2>📊 Mon Profil</h2>

        <!-- Profil card -->
        <div class="player-profile-card">
            <div class="profile-avatar-large" id="stats-avatar">
                <img id="stats-avatar-img" src="" style="display:none">
                <span id="stats-avatar-emoji">👊</span>
            </div>
            <div class="profile-name" id="stats-username">Joueur</div>
            <div class="profile-level" id="stats-level">🥉 Bronze</div>
            <div class="profile-rank">Rang mondial : <span id="stats-rank">#1</span></div>
        </div>

        <!-- Streak -->
        <div class="streak-card">
            <div class="streak-icon">🔥</div>
            <div class="streak-info">
                <div class="streak-value" id="stats-streak">0</div>
                <div class="streak-label">Jours consécutifs</div>
            </div>
        </div>

        <!-- Stats cards -->
        <div class="stats-cards">
            <div class="stats-card">
                <div class="stats-card-icon">💰</div>
                <div class="stats-card-value" id="stats-total-coins">0</div>
                <div class="stats-card-label">Total coins</div>
            </div>
            <div class="stats-card">
                <div class="stats-card-icon">👆</div>
                <div class="stats-card-value" id="stats-total-taps">0</div>
                <div class="stats-card-label">Total taps</div>
            </div>
            <div class="stats-card">
                <div class="stats-card-icon">⚡</div>
                <div class="stats-card-value" id="stats-coins-hour">0</div>
                <div class="stats-card-label">Coins/heure</div>
            </div>
            <div class="stats-card">
                <div class="stats-card-icon">🎯</div>
                <div class="stats-card-value" id="stats-missions">0</div>
                <div class="stats-card-label">Missions faites</div>
            </div>
            <div class="stats-card">
                <div class="stats-card-icon">👥</div>
                <div class="stats-card-value" id="stats-referrals">0</div>
                <div class="stats-card-label">Amis invités</div>
            </div>
            <div class="stats-card">
                <div class="stats-card-icon">📅</div>
                <div class="stats-card-value" id="stats-best-day">0</div>
                <div class="stats-card-label">Meilleur jour taps</div>
            </div>
        </div>

        <!-- Roue stats -->
        <div class="wheel-stats-card">
            <h3>🎰 Statistiques Roue</h3>
            <div class="wheel-stat-row">
                <span style="color:#aaa">Total de tours</span>
                <span id="stats-total-spins" style="font-weight:800">0</span>
            </div>
            <div class="wheel-stat-row">
                <span style="color:#aaa">Meilleure récompense</span>
                <span id="stats-best-spin" style="color:#f0c040;font-weight:800">Aucune</span>
            </div>
        </div>
    </div>
</div>

<!-- NAV -->`);

// Ajoute bouton stats dans nav
html = html.replace(
    `<button class="nav-btn" onclick="showPage('referral', this)">
        <span class="nav-icon">👥</span>Amis
    </button>`,
    `<button class="nav-btn" onclick="showPage('referral', this)">
        <span class="nav-icon">👥</span>Amis
    </button>
    <button class="nav-btn" onclick="showPage('stats', this)">
        <span class="nav-icon">📊</span>Stats
    </button>`
);

// Ajoute JS stats
html = html.replace('loadUser();', `
// STATS
let sessionTaps = 0;

async function loadStats() {
    try {
        const res = await fetch(API + '/api/stats/' + telegramId);
        if (!res.ok) return;
        const data = await res.json();
        const user = data.user;
        const current = getCurrentLevel();

        // Photo profil
        const statsImg = document.getElementById('stats-avatar-img');
        const statsEmoji = document.getElementById('stats-avatar-emoji');
        const mainImg = document.getElementById('player-avatar');
        if (mainImg && mainImg.src && mainImg.style.display !== 'none') {
            statsImg.src = mainImg.src;
            statsImg.style.display = 'block';
            statsEmoji.style.display = 'none';
        }

        document.getElementById('stats-username').textContent = telegramUsername;
        document.getElementById('stats-level').textContent = current.icon + ' ' + current.name;
        document.getElementById('stats-level').style.background = LEVEL_COLORS[current.name] + '33';
        document.getElementById('stats-level').style.color = LEVEL_COLORS[current.name];
        document.getElementById('stats-rank').textContent = '#' + data.globalRank;
        document.getElementById('stats-streak').textContent = user.streak || 0;
        document.getElementById('stats-total-coins').textContent = formatNumber(user.coins);
        document.getElementById('stats-total-taps').textContent = formatNumber(user.total_taps || 0);
        document.getElementById('stats-coins-hour').textContent = formatNumber(user.coins_per_hour);
        document.getElementById('stats-missions').textContent = data.totalMissions;
        document.getElementById('stats-referrals').textContent = user.referrals || 0;
        document.getElementById('stats-best-day').textContent = formatNumber(user.best_day_taps || 0);
        document.getElementById('stats-total-spins').textContent = data.totalSpins;
        document.getElementById('stats-best-spin').textContent = data.bestSpinReward;
    } catch(e) {}
}

// Compte les taps de la session
const tapBtnEl = document.getElementById('tap-btn');
tapBtnEl.addEventListener('click', () => {
    sessionTaps++;
    if (sessionTaps % 50 === 0) {
        fetch(API + '/api/user/' + telegramId + '/update-taps', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taps: 50 })
        }).catch(() => {});
    }
});

const origShowPage3 = showPage;
showPage = function(name, btn) {
    origShowPage3(name, btn);
    if (name === 'stats') loadStats();
};

loadUser();`);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
