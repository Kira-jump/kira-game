const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Sauvegarde la photo dans Supabase après chargement
html = html.replace(
    `fetch(API + '/api/user/' + telegramId + '/photo')
                .then(r => r.json())
                .then(data => {
                    if (data.photoUrl) {
                        const img = document.getElementById('player-avatar');
                        img.src = data.photoUrl;
                        img.style.display = 'block';
                        document.getElementById('avatar-emoji').style.display = 'none';
                    }
                }).catch(() => {});`,
    `fetch(API + '/api/user/' + telegramId + '/photo')
                .then(r => r.json())
                .then(data => {
                    if (data.photoUrl) {
                        const img = document.getElementById('player-avatar');
                        img.src = data.photoUrl;
                        img.style.display = 'block';
                        document.getElementById('avatar-emoji').style.display = 'none';
                        // Sauvegarde photo dans DB
                        fetch(API + '/api/user/' + telegramId + '/save-photo', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ photoUrl: data.photoUrl })
                        }).catch(() => {});
                    }
                }).catch(() => {});`
);

// Met à jour le classement pour utiliser photo_url
html = html.replace(
    `<div class="leader-avatar" style="overflow:hidden;background:linear-gradient(135deg,#f0c040,#e07b00);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;color:#1a1a2e;">\${u.username === telegramUsername && document.getElementById('player-avatar').src ? '<img src="' + document.getElementById('player-avatar').src + '" style="width:100%;height:100%;object-fit:cover;">' : u.username.charAt(0).toUpperCase()}</div>`,
    `<div class="leader-avatar" style="overflow:hidden;background:linear-gradient(135deg,#f0c040,#e07b00);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;color:#1a1a2e;">
        \${u.photo_url 
            ? '<img src="' + u.photo_url + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" onerror="this.style.display=\\'none\\'">' 
            : u.username.charAt(0).toUpperCase()}
    </div>`
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
