const fs = require('fs');
let html = fs.readFileSync('public/admin.html', 'utf8');

// Ajoute section promo dans le dashboard
html = html.replace(
    '<!-- PLAYERS TABLE -->',
    `<!-- PROMO CODES -->
        <div class="section">
            <h2>🎁 Codes Promo</h2>
            <div class="actions-grid">
                <div class="action-box">
                    <h3>➕ Créer un code</h3>
                    <input type="text" class="action-input" id="promo-code" placeholder="Code (ex: KIRA2024)" style="text-transform:uppercase">
                    <input type="number" class="action-input" id="promo-coins" placeholder="Coins à donner">
                    <input type="number" class="action-input" id="promo-max" placeholder="Max utilisations (défaut: 100)">
                    <input type="date" class="action-input" id="promo-expires" placeholder="Date expiration (optionnel)">
                    <button class="action-btn" onclick="createPromo()">➕ Créer le code</button>
                    <p class="success-msg" id="promo-success">✅ Code créé !</p>
                </div>
                <div class="action-box">
                    <h3>📋 Codes actifs</h3>
                    <div id="promo-list" style="max-height:200px;overflow-y:auto"></div>
                </div>
            </div>
        </div>

        <!-- PLAYERS TABLE -->`
);

// Ajoute CSS pour promo list
html = html.replace(
    '</style>',
    `.promo-tag {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(240,192,64,0.05);
        border: 1px solid rgba(240,192,64,0.1);
        border-radius: 8px;
        padding: 8px 12px;
        margin-bottom: 8px;
        font-size: 12px;
    }
    .promo-tag-code { color: #f0c040; font-weight: 900; letter-spacing: 1px; }
    .promo-tag-info { color: #888; font-size: 11px; }
    .delete-promo {
        background: rgba(255,50,50,0.2);
        border: none;
        color: #ff5555;
        border-radius: 6px;
        padding: 3px 8px;
        cursor: pointer;
        font-size: 11px;
    }
    </style>`
);

// Ajoute JS promo dans le dashboard
html = html.replace(
    '// Auto refresh toutes les 30 secondes',
    `async function createPromo() {
    const code = document.getElementById('promo-code').value.trim().toUpperCase();
    const coins = parseInt(document.getElementById('promo-coins').value);
    const maxUses = parseInt(document.getElementById('promo-max').value) || 100;
    const expiresAt = document.getElementById('promo-expires').value || null;

    if (!code || !coins) { alert('Remplis le code et les coins !'); return; }

    try {
        const res = await fetch(API + '/api/admin/promo/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, rewardCoins: coins, maxUses, expiresAt, password: ADMIN_PASSWORD })
        });
        if (res.ok) {
            document.getElementById('promo-success').style.display = 'block';
            document.getElementById('promo-code').value = '';
            document.getElementById('promo-coins').value = '';
            document.getElementById('promo-max').value = '';
            setTimeout(() => document.getElementById('promo-success').style.display = 'none', 3000);
            loadPromos();
        } else {
            const err = await res.json();
            alert(err.error || 'Erreur');
        }
    } catch(e) { alert('Erreur réseau'); }
}

async function loadPromos() {
    try {
        const res = await fetch(API + '/api/admin/promos');
        if (!res.ok) return;
        const promos = await res.json();
        const list = document.getElementById('promo-list');
        if (promos.length === 0) {
            list.innerHTML = '<p style="color:#555;font-size:12px">Aucun code créé</p>';
            return;
        }
        list.innerHTML = promos.map(p => \`
            <div class="promo-tag">
                <div>
                    <div class="promo-tag-code">\${p.code}</div>
                    <div class="promo-tag-info">💰 \${formatNumber(p.reward_coins)} | \${p.current_uses}/\${p.max_uses} utilisations</div>
                </div>
            </div>
        \`).join('');
    } catch(e) {}
}

// Auto refresh toutes les 30 secondes`
);

// Charge les promos au démarrage
html = html.replace(
    '// Auto refresh toutes les 30 secondes\nsetInterval(loadDashboard, 30000);',
    `loadPromos();
// Auto refresh toutes les 30 secondes
setInterval(() => { loadDashboard(); loadPromos(); }, 30000);`
);

fs.writeFileSync('public/admin.html', html);
console.log('Done!');
