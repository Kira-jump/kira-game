const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Enlève chat et stats du menu Plus
html = html.replace(
    `        <div class="more-item" onclick="navigateTo('stats')">
            <div class="more-icon">📊</div>
            <div class="more-name">Stats</div>
        </div>
        <div class="more-item" onclick="navigateTo('chat')">
            <div class="more-icon">💬</div>
            <div class="more-name">Chat</div>
        </div>`,
    ``
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
