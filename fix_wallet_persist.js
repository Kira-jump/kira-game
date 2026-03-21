const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Fix adresse TON
html = html.replace(
    "address: 'UQDy7R-iFzXr7CkNf6YWUAlHI1QfscSw7MzNzNRea5CZncnp'",
    "address: 'UQDGKus1j0cjtOTy-FeqvGDpqfohTLlL82L03_GXDpl6tZSE'"
);

// Fix wallet persist - garde la connexion
html = html.replace(
    "restoreConnection: false,",
    "restoreConnection: true,"
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
