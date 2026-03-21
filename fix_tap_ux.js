const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Désactive zoom et sélection
html = html.replace(
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">'
);

// Ajoute CSS anti-sélection et anti-zoom
html = html.replace(
    '* { margin: 0; padding: 0; box-sizing: border-box; }',
    `* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
body { overscroll-behavior: none; }`
);

// Réduit les espacements pour tout voir sans scroll
html = html.replace(
    '.home {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    padding-top: 20px;\n}',
    `.home {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 5px;
}`
);

// Réduit le bouton tap
html = html.replace(
    `.tap-btn {
            width: 220px;
            height: 220px;`,
    `.tap-btn {
            width: 190px;
            height: 190px;`
);

// Réduit les stat-box
html = html.replace(
    `.stats-row {
    display: flex;
    gap: 15px;
    margin: 15px 0 25px;
}`,
    `.stats-row {
    display: flex;
    gap: 10px;
    margin: 8px 0 10px;
}`
);

// Réduit le boost container
html = html.replace(
    `.boost-container {
    margin-top: 15px;`,
    `.boost-container {
    margin-top: 8px;`
);

// Réduit les boosts
html = html.replace(
    `.boost-btn {
    background: linear-gradient(135deg, rgba(22,33,62,0.9), rgba(15,25,50,0.9));
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 15px;
    padding: 10px 15px;`,
    `.boost-btn {
    background: linear-gradient(135deg, rgba(22,33,62,0.9), rgba(15,25,50,0.9));
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 15px;
    padding: 7px 12px;`
);

html = html.replace(
    `.boost-icon { font-size: 24px; }`,
    `.boost-icon { font-size: 20px; }`
);

html = html.replace(
    `.boost-name { font-size: 12px; font-weight: 800; margin: 3px 0; }`,
    `.boost-name { font-size: 11px; font-weight: 800; margin: 2px 0; }`
);

// Réduit wallet btn
html = html.replace(
    `<button class="wallet-btn" id="wallet-btn" onclick="connectWallet()" style="margin:5px auto;">`,
    `<button class="wallet-btn" id="wallet-btn" onclick="connectWallet()" style="margin:3px auto;padding:8px 15px;font-size:13px;">`
);

// Réduit stat-box padding
html = html.replace(
    `.stat-box {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(240,192,64,0.2);
    border-radius: 15px;
    padding: 8px 15px;
    text-align: center;
    font-size: 12px;
    color: #aaa;
}`,
    `.stat-box {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(240,192,64,0.2);
    border-radius: 12px;
    padding: 6px 12px;
    text-align: center;
    font-size: 11px;
    color: #aaa;
}`
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
