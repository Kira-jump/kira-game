const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

html = html.replace(
    `// Photo profil Telegram\n            const tgUser = tg.initDataUnsafe?.user;\n            if (tgUser?.photo_url) {\n                document.getElementById("player-avatar").src = tgUser.photo_url;\n            } else {\n                document.getElementById("player-avatar").style.display = "none";\n            }`,
    `// Photo profil via API
            fetch(API + '/api/user/' + telegramId + '/photo')
                .then(r => r.json())
                .then(data => {
                    if (data.photoUrl) {
                        document.getElementById('player-avatar').src = data.photoUrl;
                        document.getElementById('player-avatar').style.display = 'block';
                    } else {
                        document.getElementById('player-avatar').style.display = 'none';
                    }
                }).catch(() => {
                    document.getElementById('player-avatar').style.display = 'none';
                });`
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
