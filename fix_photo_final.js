const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

html = html.replace(
    `img.src = data.photoUrl;
                        img.style.display = 'block';
                        const emoji = document.getElementById('avatar-emoji');
                        if (emoji) emoji.style.display = 'none';`,
    `img.src = data.photoUrl;
                        img.style.display = 'block';
                        const emoji = document.getElementById('avatar-emoji');
                        if (emoji) emoji.style.display = 'none';
                        // Sauvegarde photo
                        fetch(API + '/api/user/' + telegramId + '/save-photo', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ photoUrl: data.photoUrl })
                        }).catch(() => {});`
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
