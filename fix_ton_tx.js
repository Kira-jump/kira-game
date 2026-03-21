const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

html = html.replace(
    `const tx = {
                validUntil: Math.floor(Date.now() / 1000) + 600,
                messages: [{
                    address: 'UQDGKus1j0cjtOTy-FeqvGDpqfohTLlL82L03_GXDpl6tZSE',
                    amount: String(Math.floor(item.priceTon * 1e9)),
                    payload: ''
                }]
            };`,
    `const tx = {
                validUntil: Math.floor(Date.now() / 1000) + 600,
                messages: [{
                    address: 'UQDGKus1j0cjtOTy-FeqvGDpqfohTLlL82L03_GXDpl6tZSE',
                    amount: String(Math.floor(item.priceTon * 1e9))
                }]
            };`
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
