const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Ajoute CSS boutique
html = html.replace('</style>', `
.shop-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 10px;
}
.shop-item {
    background: linear-gradient(135deg, rgba(22,33,62,0.9), rgba(15,25,50,0.9));
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px;
    padding: 15px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
}
.shop-item::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #f0c040, transparent);
    opacity: 0;
    transition: opacity 0.3s;
}
.shop-item:active { transform: scale(0.95); border-color: rgba(240,192,64,0.4); }
.shop-item:active::before { opacity: 1; }
.shop-item-icon { font-size: 36px; margin-bottom: 8px; }
.shop-item-name { font-size: 12px; font-weight: 800; margin-bottom: 5px; }
.shop-item-desc { font-size: 10px; color: #888; margin-bottom: 8px; }
.shop-item-price {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    border-radius: 10px;
    padding: 4px 10px;
    font-size: 12px;
    font-weight: 900;
}
.price-ton {
    background: rgba(0,136,204,0.2);
    border: 1px solid rgba(0,136,204,0.4);
    color: #0088cc;
}
.price-coins {
    background: rgba(240,192,64,0.15);
    border: 1px solid rgba(240,192,64,0.3);
    color: #f0c040;
}
.shop-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 15px;
}
.shop-tab {
    flex: 1;
    background: rgba(22,33,62,0.9);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 10px;
    font-size: 13px;
    font-weight: 800;
    cursor: pointer;
    color: #888;
    font-family: 'Nunito', sans-serif;
    transition: all 0.2s;
}
.shop-tab.active {
    border-color: #f0c040;
    color: #f0c040;
    background: rgba(240,192,64,0.1);
}
.vip-badge {
    display: inline-block;
    background: linear-gradient(135deg, #ffd700, #ff6600);
    border-radius: 8px;
    padding: 2px 8px;
    font-size: 10px;
    font-weight: 900;
    color: white;
    margin-left: 5px;
}
</style>`);

// Ajoute page boutique avant nav
html = html.replace('<!-- NAV -->', `<!-- SHOP -->
<div class="page" id="page-shop">
    <h2>🛒 Boutique</h2>
    <div class="shop-tabs">
        <button class="shop-tab active" onclick="switchShopTab('ton', this)">💎 TON</button>
        <button class="shop-tab" onclick="switchShopTab('coins', this)">🪙 Coins</button>
    </div>
    <div class="shop-grid" id="shop-grid"></div>
</div>

<!-- NAV -->`);

// Ajoute bouton boutique dans la nav
html = html.replace(
    `<button class="nav-btn" onclick="showPage('missions', this)">
        <span class="nav-icon">🎯</span>Missions
    </button>
    <button class="nav-btn" onclick="showPage('wheel', this)">
        <span class="nav-icon">🎰</span>Roue
    </button>`,
    `<button class="nav-btn" onclick="showPage('missions', this)">
        <span class="nav-icon">🎯</span>Missions
    </button>
    <button class="nav-btn" onclick="showPage('wheel', this)">
        <span class="nav-icon">🎰</span>Roue
    </button>
    <button class="nav-btn" onclick="showPage('shop', this)">
        <span class="nav-icon">🛒</span>Shop
    </button>`
);

// Ajoute JS boutique
html = html.replace('loadUser();', `
// SHOP
let shopItems = [];
let currentShopTab = 'ton';

async function loadShop() {
    try {
        const res = await fetch(API + '/api/shop');
        if (res.ok) shopItems = await res.json();
        renderShop();
    } catch(e) {}
}

function switchShopTab(tab, btn) {
    document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    currentShopTab = tab;
    renderShop();
}

function renderShop() {
    const grid = document.getElementById('shop-grid');
    if (!grid) return;
    const filtered = shopItems.filter(item =>
        currentShopTab === 'ton' ? item.priceTon : item.priceCoins
    );
    grid.innerHTML = filtered.map(item => \`
        <div class="shop-item" onclick="buyItem('\${item.id}')">
            <div class="shop-item-icon">\${item.icon}</div>
            <div class="shop-item-name">\${item.name}</div>
            <div class="shop-item-desc">\${getItemDesc(item)}</div>
            <div class="shop-item-price \${item.priceTon ? 'price-ton' : 'price-coins'}">
                \${item.priceTon ? '💎 ' + item.priceTon + ' TON' : '🪙 ' + formatNumber(item.priceCoins)}
            </div>
        </div>
    \`).join('');
}

function getItemDesc(item) {
    if (item.type === 'tap') return '+' + item.value + ' tap permanent';
    if (item.type === 'coins') return formatNumber(item.value) + ' coins bonus';
    if (item.type === 'vip') return 'Badge VIP exclusif 👑';
    if (item.type === 'wheel') return item.value + ' tours de roue';
    if (item.type === 'shield') return 'Protection ' + item.value + 'h';
    return '';
}

async function buyItem(itemId) {
    const item = shopItems.find(i => i.id === itemId);
    if (!item) return;

    if (item.priceCoins) {
        // Achat avec coins
        if (coins < item.priceCoins) { alert('Pas assez de coins !'); return; }
        if (!confirm('Acheter ' + item.name + ' pour ' + formatNumber(item.priceCoins) + ' coins ?')) return;
        try {
            const res = await fetch(API + '/api/shop/' + telegramId + '/buy-coins', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId })
            });
            if (res.ok) {
                const user = await res.json();
                coins = parseInt(user.coins) || 0;
                coinsPerTap = parseInt(user.coins_per_tap) || 1;
                updateUI();
                alert('✅ Achat réussi ! ' + item.icon + ' ' + item.name);
            } else {
                const err = await res.json();
                alert(err.error || 'Erreur');
            }
        } catch(e) { alert('Erreur réseau'); }
    } else {
        // Achat avec TON
        if (!walletAddress) {
            alert('💎 Connecte ton wallet TON d\\'abord !');
            return;
        }
        try {
            // Transaction TON
            const tx = {
                validUntil: Math.floor(Date.now() / 1000) + 600,
                messages: [{
                    address: 'UQBsGhMhvLmHCwvLvRBVyXpMGAIbLFrjNHQgC7_1bZVKmKrK',
                    amount: String(Math.floor(item.priceTon * 1e9)),
                    payload: ''
                }]
            };
            await tonConnectUI.sendTransaction(tx);
            const res = await fetch(API + '/api/shop/' + telegramId + '/buy-ton', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId, txHash: 'confirmed' })
            });
            if (res.ok) {
                const user = await res.json();
                coins = parseInt(user.coins) || 0;
                coinsPerTap = parseInt(user.coins_per_tap) || 1;
                updateUI();
                alert('✅ Achat TON réussi ! ' + item.icon + ' ' + item.name);
            }
        } catch(e) {
            if (e.message !== 'Reject request') alert('Erreur transaction: ' + e.message);
        }
    }
}

const origShowPage2 = showPage;
showPage = function(name, btn) {
    origShowPage2(name, btn);
    if (name === 'shop') loadShop();
};

loadUser();`);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
