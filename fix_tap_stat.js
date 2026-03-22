const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Enlève la stat "par tap"
html = html.replace(
    `            <div class="stat-box">
                <strong id="tap-value">1</strong>
                par tap
            </div>`,
    ``
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
