const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

html = html.replace(
    `.catch(() => {});`,
    `.then(data => {
                    if (data.photoUrl) {
                        const img = document.getElementById('player-avatar');
                        img.src = data.photoUrl;
                        img.style.display = 'block';
                        document.getElementById('avatar-emoji').style.display = 'none';
                        fetch(API + '/api/user/' + telegramId + '/save-photo', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ photoUrl: data.photoUrl })
                        }).catch(() => {});
                    }
                }).catch(() => {});`
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
