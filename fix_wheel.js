const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Ajoute CSS roue
html = html.replace('</style>', `
.wheel-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 10px;
}
.wheel-wrapper {
    position: relative;
    width: 300px;
    height: 300px;
    margin: 20px auto;
}
.wheel {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    position: relative;
    transition: transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99);
    border: 4px solid #f0c040;
    box-shadow: 0 0 30px rgba(240,192,64,0.4);
}
.wheel-pointer {
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 30px;
    z-index: 10;
    filter: drop-shadow(0 2px 5px rgba(0,0,0,0.5));
}
.spin-btn {
    background: linear-gradient(135deg, #f0c040, #e07b00);
    color: #1a1a2e;
    border: none;
    border-radius: 20px;
    padding: 15px 40px;
    font-size: 18px;
    font-weight: 900;
    cursor: pointer;
    font-family: 'Nunito', sans-serif;
    transition: transform 0.2s;
    margin-top: 10px;
    box-shadow: 0 5px 20px rgba(240,192,64,0.3);
}
.spin-btn:active { transform: scale(0.97); }
.spin-btn:disabled { opacity: 0.5; cursor: default; }
.wheel-status {
    font-size: 13px;
    color: #888;
    margin-top: 10px;
    text-align: center;
}
.wheel-result {
    background: linear-gradient(135deg, rgba(240,192,64,0.2), rgba(224,123,0,0.1));
    border: 1px solid rgba(240,192,64,0.3);
    border-radius: 15px;
    padding: 15px 25px;
    text-align: center;
    margin-top: 15px;
    display: none;
    animation: fadeIn 0.5s ease;
}
.wheel-result-icon { font-size: 40px; }
.wheel-result-text { font-size: 18px; font-weight: 900; color: #f0c040; margin-top: 5px; }
.wheel-history {
    width: 100%;
    margin-top: 20px;
}
.wheel-history h3 { font-size: 16px; color: #888; margin-bottom: 10px; }
.wheel-history-item {
    display: flex;
    justify-content: space-between;
    background: rgba(22,33,62,0.8);
    border-radius: 10px;
    padding: 10px 15px;
    margin-bottom: 8px;
    font-size: 13px;
}
</style>`);

// Ajoute page roue avant nav
html = html.replace('<!-- NAV -->', `<!-- WHEEL -->
<div class="page" id="page-wheel">
    <h2>🎰 Roue de la Fortune</h2>
    <div class="wheel-container">
        <div class="wheel-wrapper">
            <div class="wheel-pointer">▼</div>
            <canvas id="wheelCanvas" width="300" height="300"></canvas>
        </div>
        <button class="spin-btn" id="spin-btn" onclick="spinWheel()">
            🎰 Tourner !
        </button>
        <div class="wheel-status" id="wheel-status">✨ 1 tour gratuit disponible !</div>
        <div class="wheel-result" id="wheel-result">
            <div class="wheel-result-icon" id="result-icon">🎉</div>
            <div class="wheel-result-text" id="result-text">+1000 coins !</div>
        </div>
    </div>
</div>

<!-- NAV -->`);

// Remplace nav pour ajouter roue
html = html.replace(
    `<button class="nav-btn" onclick="showPage('missions', this)">
        <span class="nav-icon">🎯</span>Missions
    </button>`,
    `<button class="nav-btn" onclick="showPage('missions', this)">
        <span class="nav-icon">🎯</span>Missions
    </button>
    <button class="nav-btn" onclick="showPage('wheel', this)">
        <span class="nav-icon">🎰</span>Roue
    </button>`
);

// Ajoute JS roue
html = html.replace('loadUser();', `
// WHEEL
const WHEEL_REWARDS = [
    { label: '500 🪙', color: '#e07b00', icon: '🪙' },
    { label: '1K 🪙', color: '#f0c040', icon: '🪙' },
    { label: '5K 🪙', color: '#e07b00', icon: '💰' },
    { label: '10K 🪙', color: '#f0c040', icon: '💰' },
    { label: '⚡ x2', color: '#0088cc', icon: '⚡' },
    { label: '🔥 x3', color: '#cc4400', icon: '🔥' },
    { label: '🃏 Carte', color: '#6600cc', icon: '🃏' },
    { label: '💎 50K', color: '#00cc88', icon: '💎' },
];

let wheelSpinning = false;
let freeSpinUsed = false;
let currentRotation = 0;

function drawWheel() {
    const canvas = document.getElementById('wheelCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const centerX = 150, centerY = 150, radius = 145;
    const sliceAngle = (2 * Math.PI) / WHEEL_REWARDS.length;

    WHEEL_REWARDS.forEach((reward, i) => {
        const startAngle = i * sliceAngle - Math.PI / 2;
        const endAngle = startAngle + sliceAngle;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = reward.color;
        ctx.fill();
        ctx.strokeStyle = '#1a1a2e';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = 'white';
        ctx.font = 'bold 11px Nunito, Arial';
        ctx.fillText(reward.label, radius - 10, 4);
        ctx.restore();
    });

    // Centre
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#1a1a2e';
    ctx.fill();
    ctx.strokeStyle = '#f0c040';
    ctx.lineWidth = 3;
    ctx.stroke();
}

async function loadWheelStatus() {
    try {
        const res = await fetch(API + '/api/wheel/' + telegramId + '/status');
        if (res.ok) {
            const data = await res.json();
            freeSpinUsed = data.freeSpinUsed;
            updateWheelStatus();
        }
    } catch(e) {}
}

function updateWheelStatus() {
    const btn = document.getElementById('spin-btn');
    const status = document.getElementById('wheel-status');
    if (!freeSpinUsed) {
        btn.textContent = '🎰 Tour Gratuit !';
        status.textContent = '✨ 1 tour gratuit disponible !';
        status.style.color = '#f0c040';
    } else {
        btn.textContent = '🎰 Tourner (1000 🪙)';
        status.textContent = 'Tour gratuit utilisé. Prochain gratuit demain !';
        status.style.color = '#888';
    }
}

async function spinWheel() {
    if (wheelSpinning) return;
    wheelSpinning = true;
    document.getElementById('spin-btn').disabled = true;
    document.getElementById('wheel-result').style.display = 'none';

    try {
        const res = await fetch(API + '/api/wheel/' + telegramId + '/spin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });

        if (!res.ok) {
            const err = await res.json();
            alert(err.error || 'Erreur');
            wheelSpinning = false;
            document.getElementById('spin-btn').disabled = false;
            return;
        }

        const data = await res.json();
        const reward = data.reward;

        // Trouve l'index de la récompense
        const rewardIndex = WHEEL_REWARDS.findIndex(r => r.label === reward.label);
        const sliceAngle = 360 / WHEEL_REWARDS.length;
        const targetAngle = 360 - (rewardIndex * sliceAngle) - sliceAngle / 2;
        const spins = 5 * 360;
        const finalRotation = currentRotation + spins + targetAngle - (currentRotation % 360);

        const canvas = document.getElementById('wheelCanvas');
        canvas.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
        canvas.style.transform = 'rotate(' + finalRotation + 'deg)';
        currentRotation = finalRotation;

        setTimeout(() => {
            wheelSpinning = false;
            freeSpinUsed = true;
            updateWheelStatus();
            document.getElementById('spin-btn').disabled = false;

            // Affiche résultat
            const resultEl = document.getElementById('wheel-result');
            document.getElementById('result-icon').textContent = WHEEL_REWARDS[rewardIndex].icon;
            document.getElementById('result-text').textContent = 'Tu as gagné ' + reward.label + ' !';
            resultEl.style.display = 'block';

            // Met à jour les coins
            if (reward.type === 'coins') {
                coins += reward.value;
                totalCoins += reward.value;
                document.getElementById('coins').textContent = formatNumber(coins);
                updateLevelUI();
            }
        }, 4200);

    } catch(e) {
        alert('Erreur réseau');
        wheelSpinning = false;
        document.getElementById('spin-btn').disabled = false;
    }
}

const origShowPage = showPage;
showPage = function(name, btn) {
    origShowPage(name, btn);
    if (name === 'wheel') {
        drawWheel();
        loadWheelStatus();
    }
};

loadUser();
loadMissions();
drawWheel();
loadWheelStatus();`);

// Supprime l'ancien loadUser() en double
html = html.replace('loadUser();\nloadMissions();\nrenderBoosts();', '');

fs.writeFileSync('public/index.html', html);
console.log('Done!');
