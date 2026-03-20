const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Réduit la cartouche coins
html = html.replace(
'.coins-cartouche {\n    flex-shrink: 0;\n    background: rgba(240,192,64,0.1);\n    border: 1px solid rgba(240,192,64,0.25);\n    border-radius: 15px;\n    padding: 8px 12px;\n    text-align: center;\n    min-width: 75px;\n}',
`.coins-cartouche {
    flex-shrink: 0;
    background: rgba(240,192,64,0.1);
    border: 1px solid rgba(240,192,64,0.25);
    border-radius: 12px;
    padding: 5px 10px;
    text-align: center;
    min-width: 65px;
}`);

// Réduit la taille du chiffre
html = html.replace(
'.coins-cartouche-value {\n    font-size: 14px;\n    font-weight: 900;\n    color: #f0c040;\n    letter-spacing: -0.5px;\n}',
`.coins-cartouche-value {
    font-size: 12px;
    font-weight: 900;
    color: #f0c040;
    letter-spacing: -0.5px;
}`);

// Agrandit l'avatar
html = html.replace(
'.avatar-circle {\n    width: 50px;\n    height: 50px;\n    border-radius: 50%;\n    border: 3px solid #cd7f32;\n    overflow: hidden;\n    flex-shrink: 0;\n    background: linear-gradient(135deg, #f0c040, #e07b00);\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 22px;\n}',
`.avatar-circle {
    width: 65px;
    height: 65px;
    border-radius: 50%;
    border: 3px solid #cd7f32;
    overflow: hidden;
    flex-shrink: 0;
    background: linear-gradient(135deg, #f0c040, #e07b00);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    box-shadow: 0 0 15px rgba(205,127,50,0.3);
}`);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
