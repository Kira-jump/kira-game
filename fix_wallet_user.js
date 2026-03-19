const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

html = html.replace(
    'tonConnectUI = new TON_CONNECT_UI.TonConnectUI({',
    `tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
            restoreConnection: false,`
);

// Ajoute disconnect au chargement pour reset
html = html.replace(
    'initTonConnect();',
    `// Disconnect wallet au chargement pour chaque utilisateur
async function checkWalletForUser() {
    await initTonConnect();
    // Vérifie si le wallet sauvegardé appartient à cet utilisateur
    const savedWallet = localStorage.getItem('wallet_' + telegramId);
    if (!savedWallet && tonConnectUI) {
        try { await tonConnectUI.disconnect(); } catch(e) {}
    }
}
checkWalletForUser();`
);

// Sauvegarde wallet par utilisateur
html = html.replace(
    'saveWallet(walletAddress);',
    `localStorage.setItem('wallet_' + telegramId, walletAddress);
                saveWallet(walletAddress);`
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
