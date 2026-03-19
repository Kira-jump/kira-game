const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Remplace l'avatar cliquable par la photo de profil Telegram
html = html.replace(
    '<div class="player-avatar-display" id="player-avatar" onclick="openAvatarSelector()">👊</div>',
    '<img id="player-avatar" src="" style="width:36px;height:36px;border-radius:50%;object-fit:cover;background:linear-gradient(135deg,#f0c040,#e07b00);" onerror="this.style.display=\'none\'">'
);

// Remplace le tap-btn pour garder 👊
html = html.replace(
    `document.getElementById('tap-btn').textContent = currentAvatar;`,
    ''
);

// Charge la photo de profil Telegram
html = html.replace(
    'currentAvatar = user.avatar',
    '// Photo profil Telegram\n            const tgUser = tg.initDataUnsafe?.user;\n            if (tgUser?.photo_url) {\n                document.getElementById("player-avatar").src = tgUser.photo_url;\n            } else {\n                document.getElementById("player-avatar").style.display = "none";\n            }\n            currentAvatar = user.avatar'
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
