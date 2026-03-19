const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Ajoute CSS boost
html = html.replace('</style>', `
.boost-container {
    margin-top: 15px;
    display: flex;
    gap: 10px;
    justify-content: center;
}
.boost-btn {
    background: linear-gradient(135deg, rgba(22,33,62,0.9), rgba(15,25,50,0.9));
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 15px;
    padding: 10px 15px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    flex: 1;
    font-family: 'Nunito', sans-serif;
    color: white;
}
.boost-btn:active { transform: scale(0.95); }
.boost-btn.active-boost {
    border-color: #f0c040;
    background: linear-gradient(135deg, rgba(240,192,64,0.2), rgba(224,123,0,0.1));
}
.boost-btn.cooldown { opacity: 0.5; cursor: default; }
.boost-icon { font-size: 24px; }
.boost-name { font-size: 12px; font-weight: 800; margin: 3px 0; }
.boost-timer { font-size: 11px; color: #f0c040; font-weight: 700; }

.boost-active-bar {
    background: linear-gradient(135deg, rgba(240,192,64,0.15), rgba(224,123,0,0.1));
    border: 1px solid rgba(240,192,64,0.3);
    border-radius: 15px;
    padding: 10px 15px;
    margin-top: 10px;
    display: none;
    text-align: center;
    font-size: 13px;
    font-weight: 800;
    color: #f0c040;
    animation: pulse 1s infinite alternate;
}
@keyframes pulse {
    0% { box-shadow: 0 0 10px rgba(240,192,64,0.2); }
    100% { box-shadow: 0 0 20px rgba(240,192,64,0.5); }
}
</style>`);

// Ajoute boost container dans home après tap-info
html = html.replace(
    '<div class="tap-info">Tape pour gagner des coins !</div>',
    `<div class="tap-info">Tape pour gagner des coins !</div>
    <div class="boost-active-bar" id="boost-active-bar">⚡ BOOST ACTIF ! x<span id="boost-multiplier">1</span> — <span id="boost-countdown">30</span>s</div>
    <div class="boost-container" id="boost-container"></div>`
);

// Ajoute JS boost avant loadUser()
html = html.replace('loadUser();', `
const BOOSTS = [
    { id: 'boost_x2', icon: '⚡', name: 'x2 Boost', multiplier: 2, duration: 30, cooldown: 3600 },
    { id: 'boost_x3', icon: '🔥', name: 'x3 Boost', multiplier: 3, duration: 30, cooldown: 3600 },
    { id: 'boost_x5', icon: '💎', name: 'x5 Boost', multiplier: 5, duration: 30, cooldown: 7200 },
];

let boostCooldowns = JSON.parse(localStorage.getItem('boostCooldowns') || '{}');
let activeBoost = null;
let boostTimer = null;
let boostCountdown = 0;

function renderBoosts() {
    const container = document.getElementById('boost-container');
    if (!container) return;
    const now = Date.now();
    container.innerHTML = BOOSTS.map(b => {
        const cooldownEnd = boostCooldowns[b.id] || 0;
        const remaining = Math.max(0, Math.ceil((cooldownEnd - now) / 1000));
        const isActive = activeBoost && activeBoost.id === b.id;
        const onCooldown = remaining > 0 && !isActive;
        return \`<button class="boost-btn \${isActive ? 'active-boost' : ''} \${onCooldown ? 'cooldown' : ''}"
            onclick="activateBoost('\${b.id}')">
            <div class="boost-icon">\${b.icon}</div>
            <div class="boost-name">\${b.name}</div>
            <div class="boost-timer">\${isActive ? '⚡ Actif' : onCooldown ? formatTime(remaining) : 'Prêt !'}</div>
        </button>\`;
    }).join('');
}

function formatTime(s) {
    if (s >= 3600) return Math.floor(s/3600) + 'h';
    if (s >= 60) return Math.floor(s/60) + 'm';
    return s + 's';
}

function activateBoost(boostId) {
    const now = Date.now();
    const boost = BOOSTS.find(b => b.id === boostId);
    if (!boost) return;
    const cooldownEnd = boostCooldowns[boostId] || 0;
    if (cooldownEnd > now) { alert('Boost en cooldown !'); return; }
    if (activeBoost) { alert('Un boost est déjà actif !'); return; }

    activeBoost = boost;
    coinsPerTap = coinsPerTap * boost.multiplier;
    boostCountdown = boost.duration;

    document.getElementById('tap-value').textContent = coinsPerTap;
    document.getElementById('boost-active-bar').style.display = 'block';
    document.getElementById('boost-multiplier').textContent = boost.multiplier;
    document.getElementById('boost-countdown').textContent = boostCountdown;

    boostCooldowns[boostId] = now + (boost.cooldown * 1000);
    localStorage.setItem('boostCooldowns', JSON.stringify(boostCooldowns));

    boostTimer = setInterval(() => {
        boostCountdown--;
        document.getElementById('boost-countdown').textContent = boostCountdown;
        renderBoosts();
        if (boostCountdown <= 0) {
            clearInterval(boostTimer);
            coinsPerTap = Math.max(1, Math.floor(coinsPerTap / boost.multiplier));
            document.getElementById('tap-value').textContent = coinsPerTap;
            document.getElementById('boost-active-bar').style.display = 'none';
            activeBoost = null;
            renderBoosts();
        }
    }, 1000);
    renderBoosts();
}

// Cooldown timer
setInterval(() => { renderBoosts(); }, 1000);

loadUser();
renderBoosts();`);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
