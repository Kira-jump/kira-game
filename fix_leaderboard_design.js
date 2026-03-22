const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Remplace le rendu du classement
html = html.replace(
    `list.innerHTML = myRankHtml + users.map((u, i) => \\\`
            <div class="leader-item" style="\\\${u.username === telegramUsername ? 'border-color:rgba(240,192,64,0.4)' : ''}">
                <div class="leader-rank">\\\${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i+1)}</div>
                <div class="leader-avatar">\\\${u.avatar || '👊'}</div>
                <div class="leader-name">\\\${u.username}\\\${u.username === telegramUsername ? ' 👈' : ''}</div>
                <div class="leader-coins">💰 \\\${formatNumber(u.coins)}</div>
            </div>
        \\\`).join('');`,
    `list.innerHTML = myRankHtml + users.map((u, i) => \\\`
            <div class="leader-item" style="\\\${u.username === telegramUsername ? 'border-color:rgba(240,192,64,0.4)' : ''}">
                <div class="leader-rank">\\\${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i+1)}</div>
                <div class="leader-avatar" style="overflow:hidden;border-radius:50%;">
                    \\\${u.username === telegramUsername && document.getElementById('player-avatar') && document.getElementById('player-avatar').src
                        ? '<img src="' + document.getElementById('player-avatar').src + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">'
                        : '👊'}
                </div>
                <div class="leader-name">\\\${u.username}</div>
                <div class="leader-coins">
                    <img src="/coins_silver.png" style="width:20px;height:20px;object-fit:cover;border-radius:50%;vertical-align:middle;margin-right:3px;">
                    \\\${formatNumber(u.coins)}
                </div>
            </div>
        \\\`).join('');`
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
