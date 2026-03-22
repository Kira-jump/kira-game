const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Réduit tap-container marges
html = html.replace(
    `.tap-container {
        position: relative;
        margin-bottom: 20px;
    }`,
    `.tap-container {
        position: relative;
        margin-bottom: 5px;
    }`
);

// Réduit tap-btn taille
html = html.replace(
    `.tap-btn {
            width: 190px;
            height: 190px;`,
    `.tap-btn {
            width: 170px;
            height: 170px;`
);

// Cache tap-info
html = html.replace(
    '<div class="tap-info" style="font-size:11px;margin-top:3px;color:#555">Tape pour gagner des coins !</div>',
    ''
);

// Réduit stats-row marges
html = html.replace(
    '<div class="stats-row" style="margin-top:5px">',
    '<div class="stats-row" style="margin-top:3px;margin-bottom:3px">'
);

// Cache wallet-btn si wallet connecté par défaut
html = html.replace(
    `<button class="wallet-btn" id="wallet-btn" onclick="connectWallet()" style="margin:3px auto;padding:8px 15px;font-size:13px;">
            💎 Connecter Wallet TON
        </button>
        <div class="wallet-connected" id="wallet-connected">
            ✅ Wallet connecté !<br><span id="wallet-address" style="font-size:11px;color:#aaa;"></span>
        </div>`,
    `<button class="wallet-btn" id="wallet-btn" onclick="connectWallet()" style="margin:2px auto;padding:6px 15px;font-size:11px;display:none">
            💎 Connecter Wallet TON
        </button>
        <div class="wallet-connected" id="wallet-connected" style="padding:6px 12px;font-size:11px;margin:2px auto;">
            ✅ Wallet connecté !<br><span id="wallet-address" style="font-size:10px;color:#aaa;"></span>
        </div>`
);

// Réduit boost-btn padding
html = html.replace(
    `.boost-btn {
    background: linear-gradient(135deg, rgba(22,33,62,0.9), rgba(15,25,50,0.9));
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 15px;
    padding: 7px 12px;`,
    `.boost-btn {
    background: linear-gradient(135deg, rgba(22,33,62,0.9), rgba(15,25,50,0.9));
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 5px 8px;`
);

// Montre wallet btn si pas connecté au chargement
html = html.replace(
    'async function checkWalletForUser() {',
    `async function checkWalletForUser() {
    // Montre bouton wallet si pas connecté
    setTimeout(() => {
        if (!walletAddress) {
            document.getElementById('wallet-btn').style.display = 'flex';
        }
    }, 2000);`
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
