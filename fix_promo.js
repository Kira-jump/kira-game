const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Ajoute CSS promo
html = html.replace('</style>', `
.promo-box {
    background: linear-gradient(135deg, rgba(240,192,64,0.1), rgba(224,123,0,0.05));
    border: 1px solid rgba(240,192,64,0.2);
    border-radius: 20px;
    padding: 25px 20px;
    text-align: center;
    margin-bottom: 20px;
}
.promo-box h3 { font-size: 20px; font-weight: 900; margin-bottom: 8px; }
.promo-box p { color: #aaa; font-size: 14px; margin-bottom: 20px; }
.promo-input {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(240,192,64,0.3);
    border-radius: 15px;
    padding: 14px 20px;
    color: white;
    font-size: 18px;
    font-weight: 900;
    font-family: 'Nunito', sans-serif;
    text-align: center;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 15px;
    outline: none;
}
.promo-input::placeholder { color: #555; letter-spacing: 2px; font-size: 14px; }
.promo-submit {
    width: 100%;
    background: linear-gradient(135deg, #f0c040, #e07b00);
    color: #1a1a2e;
    border: none;
    border-radius: 15px;
    padding: 14px;
    font-size: 16px;
    font-weight: 900;
    cursor: pointer;
    font-family: 'Nunito', sans-serif;
    transition: transform 0.2s;
}
.promo-submit:active { transform: scale(0.97); }
.promo-result {
    border-radius: 15px;
    padding: 15px;
    margin-top: 15px;
    text-align: center;
    font-weight: 800;
    font-size: 15px;
    display: none;
}
.promo-result.success {
    background: rgba(0,200,100,0.1);
    border: 1px solid rgba(0,200,100,0.3);
    color: #00c864;
}
.promo-result.error {
    background: rgba(255,50,50,0.1);
    border: 1px solid rgba(255,50,50,0.3);
    color: #ff5555;
}
.promo-history {
    background: rgba(22,33,62,0.8);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 20px;
    padding: 20px;
}
.promo-history h3 { font-size: 16px; color: #888; margin-bottom: 15px; font-weight: 700; }
.promo-history-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    font-size: 13px;
}
.promo-history-item:last-child { border-bottom: none; }
.promo-code-tag {
    background: rgba(240,192,64,0.1);
    border: 1px solid rgba(240,192,64,0.2);
    border-radius: 8px;
    padding: 3px 10px;
    color: #f0c040;
    font-weight: 900;
    letter-spacing: 1px;
}
</style>`);

// Ajoute page promo dans le frontend
html = html.replace('<!-- NAV -->', `<!-- PROMO -->
<div class="page" id="page-promo">
    <h2>🎁 Codes Promo</h2>
    <div class="promo-box">
        <h3>🎟️ Entre ton code !</h3>
        <p>Les codes promo te donnent des coins et des récompenses exclusives !</p>
        <input type="text" class="promo-input" id="promo-input" placeholder="ENTRE TON CODE" maxlength="20">
        <button class="promo-submit" onclick="usePromoCode()">🎁 Utiliser le code</button>
        <div class="promo-result" id="promo-result"></div>
    </div>
    <div class="promo-history">
        <h3>📋 Codes utilisés</h3>
        <div id="promo-history-list">
            <p style="color:#555;text-align:center;font-size:13px">Aucun code utilisé</p>
        </div>
    </div>
</div>

<!-- NAV -->`);

// Ajoute bouton promo dans nav
html = html.replace(
    `<button class="nav-btn" onclick="showPage('shop', this)">
        <span class="nav-icon">🛒</span>Shop
    </button>`,
    `<button class="nav-btn" onclick="showPage('shop', this)">
        <span class="nav-icon">🛒</span>Shop
    </button>
    <button class="nav-btn" onclick="showPage('promo', this)">
        <span class="nav-icon">🎁</span>Promo
    </button>`
);

// Ajoute JS promo
html = html.replace('loadUser();', `
// PROMO
let usedPromos = [];

async function usePromoCode() {
    const code = document.getElementById('promo-input').value.trim().toUpperCase();
    if (!code) { showPromoResult('error', 'Entre un code !'); return; }

    try {
        const res = await fetch(API + '/api/promo/' + telegramId + '/use', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });
        const data = await res.json();

        if (res.ok) {
            coins = parseInt(data.user.coins) || 0;
            totalCoins = coins;
            updateUI();
            updateLevelUI();
            document.getElementById('promo-input').value = '';
            showPromoResult('success', '🎉 Code valide ! +' + formatNumber(data.reward) + ' coins !');
            usedPromos.unshift({ code, reward: data.reward });
            renderPromoHistory();
        } else {
            showPromoResult('error', '❌ ' + data.error);
        }
    } catch(e) {
        showPromoResult('error', '❌ Erreur réseau');
    }
}

function showPromoResult(type, message) {
    const el = document.getElementById('promo-result');
    el.className = 'promo-result ' + type;
    el.textContent = message;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 4000);
}

function renderPromoHistory() {
    const list = document.getElementById('promo-history-list');
    if (usedPromos.length === 0) {
        list.innerHTML = '<p style="color:#555;text-align:center;font-size:13px">Aucun code utilisé</p>';
        return;
    }
    list.innerHTML = usedPromos.map(p => \`
        <div class="promo-history-item">
            <span class="promo-code-tag">\${p.code}</span>
            <span style="color:#f0c040;font-weight:700">+\${formatNumber(p.reward)} 🪙</span>
        </div>
    \`).join('');
}

// Enter key pour promo
document.getElementById('promo-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') usePromoCode();
});

loadUser();`);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
