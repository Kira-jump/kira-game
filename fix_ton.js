const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Ajoute TON Connect script dans le head
html = html.replace('</head>', `
<script src="https://unpkg.com/@tonconnect/ui@latest/dist/tonconnect-ui.min.js"></script>
</head>`);

// Ajoute CSS wallet
html = html.replace('</style>', `
.wallet-btn {
    background: linear-gradient(135deg, #0088cc, #0066aa);
    color: white;
    border: none;
    border-radius: 15px;
    padding: 12px 20px;
    font-size: 14px;
    font-weight: 900;
    cursor: pointer;
    font-family: 'Nunito', sans-serif;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 10px auto;
    transition: transform 0.2s;
}
.wallet-btn:active { transform: scale(0.97); }
.wallet-connected {
    background: linear-gradient(135deg, rgba(0,200,100,0.15), rgba(0,150,80,0.1));
    border: 1px solid rgba(0,200,100,0.3);
    border-radius: 15px;
    padding: 10px 15px;
    margin: 10px auto;
    text-align: center;
    font-size: 13px;
    color: #00c864;
    font-weight: 700;
    display: none;
}
</style>`);

// Ajoute bouton wallet dans home après player-info
html = html.replace(
    '<div class="coins-container">',
    `<button class="wallet-btn" id="wallet-btn" onclick="connectWallet()">
        💎 Connecter Wallet TON
    </button>
    <div class="wallet-connected" id="wallet-connected">
        ✅ Wallet connecté !<br><span id="wallet-address" style="font-size:11px;color:#aaa;"></span>
    </div>
    <div class="coins-container">`
);

// Ajoute JS TON Connect
html = html.replace('loadUser();', `
// TON Connect
let tonConnectUI = null;
let walletAddress = null;

async function initTonConnect() {
    try {
        tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
            manifestUrl: 'https://kira-game.vercel.app/tonconnect-manifest.json',
        });
        tonConnectUI.onStatusChange(wallet => {
            if (wallet) {
                walletAddress = wallet.account.address;
                document.getElementById('wallet-btn').style.display = 'none';
                document.getElementById('wallet-connected').style.display = 'block';
                document.getElementById('wallet-address').textContent = walletAddress.slice(0,8) + '...' + walletAddress.slice(-6);
                saveWallet(walletAddress);
            } else {
                walletAddress = null;
                document.getElementById('wallet-btn').style.display = 'flex';
                document.getElementById('wallet-connected').style.display = 'none';
            }
        });
    } catch(e) { console.log('TON Connect error:', e); }
}

async function connectWallet() {
    if (tonConnectUI) {
        await tonConnectUI.openModal();
    }
}

async function saveWallet(address) {
    try {
        await fetch(API + '/api/user/' + telegramId + '/wallet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ walletAddress: address })
        });
    } catch(e) {}
}

initTonConnect();
loadUser();`);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
