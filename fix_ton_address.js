const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

html = html.replace(
    'address: \'UQBsGhMhvLmHCwvLvRBVyXpMGAIbLFrjNHQgC7_1bZVKmKrK\'',
    'address: \'UQDy7R-iFzXr7CkNf6YWUAlHI1QfscSw7MzNzNRea5CZncnp\''
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
