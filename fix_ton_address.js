const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

html = html.replace(
    'address: \'UQDGKus1j0cjtOTy-FeqvGDpqfohTLlL82L03_GXDpl6tZSE\'',
    'address: \'UQDGKus1j0cjtOTy-FeqvGDpqfohTLlL82L03_GXDpl6tZSE\''
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
