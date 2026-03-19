const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Ajoute page missions avant la nav
html = html.replace('<!-- NAV -->', `<!-- MISSIONS -->
<div class="page" id="page-missions">
    <h2>🎯 Missions</h2>
    <div id="missions-list"></div>
</div>

<!-- NAV -->`);

// Remplace la nav
html = html.replace(`<nav class="nav">
    <button class="nav-btn active" onclick="showPage('home', this)">
        <span class="nav-icon">🎮</span>Jouer
    </button>
    <button class="nav-btn" onclick="showPage('cards', this)">
        <span class="nav-icon">🃏</span>Cartes
    </button>
    <button class="nav-btn" onclick="showPage('leaderboard', this)">
        <span class="nav-icon">🏆</span>Top
    </button>
    <button class="nav-btn" onclick="showPage('referral', this)">
        <span class="nav-icon">👥</span>Amis
    </button>
</nav>`, `<nav class="nav">
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
    <button class="nav-btn" onclick="showPage('referral', this)">
        <span class="nav-icon">👥</span>Amis
    </button>
</nav>`);

// Ajoute CSS missions
html = html.replace('</style>', `
.mission-item {
    background: linear-gradient(135deg, rgba(22,33,62,0.9), rgba(15,25,50,0.9));
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px;
    padding: 15px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 15px;
}
.mission-item.completed { opacity: 0.5; }
.mission-icon { font-size: 36px; }
.mission-info { flex: 1; }
.mission-name { font-size: 15px; font-weight: 800; margin-bottom: 3px; }
.mission-reward { font-size: 13px; color: #f0c040; font-weight: 700; }
.mission-progress { font-size: 12px; color: #888; margin-top: 3px; }
.mission-btn {
    background: linear-gradient(135deg, #f0c040, #e07b00);
    color: #1a1a2e;
    border: none;
    border-radius: 12px;
    padding: 10px 15px;
    font-size: 13px;
    font-weight: 900;
    cursor: pointer;
    font-family: 'Nunito', sans-serif;
    white-space: nowrap;
}
.mission-btn.done {
    background: rgba(255,255,255,0.1);
    color: #888;
    cursor: default;
}
</style>`);

// Ajoute JS missions avant loadUser()
html = html.replace('loadUser();', `
const MISSIONS = [
    { id: 'daily_login', icon: '📅', name: 'Connexion du jour', desc: 'Connecte-toi aujourd hui', reward: 500, check: () => true },
    { id: 'tap_100', icon: '👆', name: 'Tapeur', desc: 'Tape 100 fois', reward: 1000, check: () => tapCount >= 100 },
    { id: 'buy_card', icon: '🃏', name: 'Collectionneur', desc: 'Achète une carte', reward: 2000, check: () => cards.length > 0 },
    { id: 'coins_1000', icon: '💰', name: 'Riche !', desc: 'Accumule 1000 coins', reward: 3000, check: () => coins >= 1000 },
];

let completedMissions = [];
let tapCount = 0;

async function loadMissions() {
    try {
        const res = await fetch(API + '/api/missions/' + telegramId);
        if (res.ok) {
            const data = await res.json();
            completedMissions = data.map(m => m.mission_id);
        }
    } catch(e) {}
    renderMissions();
}

function renderMissions() {
    const list = document.getElementById('missions-list');
    if (!list) return;
    list.innerHTML = MISSIONS.map(m => {
        const done = completedMissions.includes(m.id);
        const canClaim = m.check() && !done;
        return \`<div class="mission-item \${done ? 'completed' : ''}">
            <div class="mission-icon">\${m.icon}</div>
            <div class="mission-info">
                <div class="mission-name">\${m.name}</div>
                <div class="mission-reward">+\${formatNumber(m.reward)} coins</div>
                <div class="mission-progress">\${m.desc}</div>
            </div>
            <button class="mission-btn \${done ? 'done' : ''}" onclick="claimMission('\${m.id}', \${m.reward})" \${done ? 'disabled' : ''}>
                \${done ? '✅' : canClaim ? 'Réclamer' : '⏳'}
            </button>
        </div>\`;
    }).join('');
}

async function claimMission(missionId, reward) {
    const mission = MISSIONS.find(m => m.id === missionId);
    if (!mission || !mission.check()) { alert('Mission pas encore accomplie !'); return; }
    try {
        const res = await fetch(API + '/api/missions/' + telegramId + '/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ missionId, reward })
        });
        if (res.ok) {
            const user = await res.json();
            coins = parseInt(user.coins) || 0;
            completedMissions.push(missionId);
            updateUI();
            renderMissions();
            alert('🎉 +' + formatNumber(reward) + ' coins !');
        } else {
            const err = await res.json();
            alert(err.error || 'Erreur');
        }
    } catch(e) { alert('Erreur réseau'); }
}

const originalShowPage = showPage;
showPage = function(name, btn) {
    originalShowPage(name, btn);
    if (name === 'missions') loadMissions();
};

const tapBtn2 = document.getElementById('tap-btn');
tapBtn2.addEventListener('click', () => {
    tapCount++;
    renderMissions();
});

loadUser();
loadMissions();`);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
