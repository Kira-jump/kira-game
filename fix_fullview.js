const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Cache le bouton wallet par défaut - accessible via settings
html = html.replace(
    `<button class="wallet-btn" id="wallet-btn" onclick="connectWallet()" style="margin:3px auto;padding:8px 15px;font-size:13px;">
            💎 Connecter Wallet TON
        </button>
        <div class="wallet-connected" id="wallet-connected">
            ✅ Wallet connecté !<br><span id="wallet-address" style="font-size:11px;color:#aaa;"></span>
        </div>`,
    `<div id="wallet-section" style="width:100%">
        <button class="wallet-btn" id="wallet-btn" onclick="connectWallet()" style="margin:3px auto;padding:6px 15px;font-size:12px;display:none">
            💎 Connecter Wallet TON
        </button>
        <div class="wallet-connected" id="wallet-connected" style="display:none!important">
            ✅ Wallet connecté !<br><span id="wallet-address" style="font-size:11px;color:#aaa;"></span>
        </div>
    </div>`
);

// Ajoute icône wallet dans le header à côté du nom
html = html.replace(
    '<div class="header-username" id="username">Joueur</div>',
    `<div style="display:flex;align-items:center;gap:8px">
                    <div class="header-username" id="username">Joueur</div>
                    <span id="wallet-icon" onclick="toggleWallet()" style="font-size:16px;cursor:pointer;opacity:0.5" title="Connecter Wallet">💎</span>
                </div>`
);

// Ajoute fonction toggleWallet
html = html.replace(
    'async function initTonConnect()',
    `function toggleWallet() {
    const btn = document.getElementById('wallet-btn');
    const connected = document.getElementById('wallet-connected');
    if (walletAddress) {
        connected.style.display = connected.style.display === 'none' ? 'block' : 'none';
    } else {
        btn.style.display = btn.style.display === 'none' ? 'flex' : 'none';
    }
}

async function initTonConnect()`
);

// Réduit tap-info
html = html.replace(
    '<div class="tap-info">Tape pour gagner des coins !</div>',
    '<div class="tap-info" style="font-size:11px;margin-top:3px;color:#555">Tape pour gagner des coins !</div>'
);

// Réduit les rings du tap
html = html.replace(
    `.tap-ring {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 260px;
        height: 260px;`,
    `.tap-ring {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 220px;
        height: 220px;`
);

html = html.replace(
    `.tap-ring-2 {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 290px;
        height: 290px;`,
    `.tap-ring-2 {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 245px;
        height: 245px;`
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
