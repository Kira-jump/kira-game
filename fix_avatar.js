const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Ajoute CSS avatar
html = html.replace('</style>', `
.avatar-selector {
    display: none;
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.8);
    z-index: 1000;
    padding: 20px;
    overflow-y: auto;
}
.avatar-selector.active { display: block; animation: fadeIn 0.3s ease; }
.avatar-selector-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    margin-top: 40px;
}
.avatar-selector-header h3 { font-size: 20px; font-weight: 900; color: #f0c040; }
.close-avatar {
    background: rgba(255,255,255,0.1);
    border: none;
    color: white;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    font-size: 18px;
    cursor: pointer;
}
.avatars-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 20px;
}
.avatar-item {
    background: rgba(22,33,62,0.9);
    border: 2px solid rgba(255,255,255,0.08);
    border-radius: 15px;
    padding: 15px 10px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
}
.avatar-item:active { transform: scale(0.95); }
.avatar-item.selected { border-color: #f0c040; background: rgba(240,192,64,0.1); }
.avatar-item.locked { opacity: 0.4; cursor: default; }
.avatar-emoji { font-size: 32px; margin-bottom: 5px; }
.avatar-name { font-size: 10px; color: #aaa; font-weight: 700; }
.avatar-lock { font-size: 11px; color: #f0c040; margin-top: 3px; }
.player-avatar-display {
    font-size: 28px;
    cursor: pointer;
    transition: transform 0.2s;
}
.player-avatar-display:active { transform: scale(0.9); }
</style>`);

// Remplace l'avatar statique par un avatar dynamique cliquable
html = html.replace(
    '<div class="player-avatar">👤</div>',
    '<div class="player-avatar-display" id="player-avatar" onclick="openAvatarSelector()">👊</div>'
);

// Ajoute le sélecteur d'avatar avant la nav
html = html.replace('<!-- NAV -->', `<!-- AVATAR SELECTOR -->
<div class="avatar-selector" id="avatar-selector">
    <div class="avatar-selector-header">
        <h3>🎨 Choisis ton avatar</h3>
        <button class="close-avatar" onclick="closeAvatarSelector()">✕</button>
    </div>
    <div class="avatars-grid" id="avatars-grid"></div>
</div>

<!-- NAV -->`);

// Ajoute JS avatar
html = html.replace('loadUser();', `
const AVATARS = [
    { emoji: '👊', name: 'Poing', level: 'Bronze' },
    { emoji: '🐱', name: 'Chat', level: 'Bronze' },
    { emoji: '🐶', name: 'Chien', level: 'Bronze' },
    { emoji: '🦊', name: 'Renard', level: 'Silver' },
    { emoji: '🐺', name: 'Loup', level: 'Silver' },
    { emoji: '🦁', name: 'Lion', level: 'Gold' },
    { emoji: '🐯', name: 'Tigre', level: 'Gold' },
    { emoji: '🐸', name: 'Grenouille', level: 'Gold' },
    { emoji: '🤖', name: 'Robot', level: 'Platinum' },
    { emoji: '👾', name: 'Alien', level: 'Platinum' },
    { emoji: '💀', name: 'Skull', level: 'Diamond' },
    { emoji: '🔥', name: 'Feu', level: 'Diamond' },
    { emoji: '💎', name: 'Diamond', level: 'Diamond' },
    { emoji: '👑', name: 'Couronne', level: 'Legend' },
    { emoji: '🚀', name: 'Fusée', level: 'Legend' },
    { emoji: '⚡', name: 'Éclair', level: 'Legend' },
];

const LEVEL_ORDER = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Legend'];

let currentAvatar = '👊';

function isAvatarUnlocked(avatarLevel) {
    const currentLevelIndex = LEVEL_ORDER.indexOf(getCurrentLevel().name);
    const avatarLevelIndex = LEVEL_ORDER.indexOf(avatarLevel);
    return currentLevelIndex >= avatarLevelIndex;
}

function openAvatarSelector() {
    const grid = document.getElementById('avatars-grid');
    grid.innerHTML = AVATARS.map(a => {
        const unlocked = isAvatarUnlocked(a.level);
        const selected = currentAvatar === a.emoji;
        return \`<div class="avatar-item \${selected ? 'selected' : ''} \${!unlocked ? 'locked' : ''}"
            onclick="\${unlocked ? 'selectAvatar(\\"' + a.emoji + '\\")'  : ''}">
            <div class="avatar-emoji">\${a.emoji}</div>
            <div class="avatar-name">\${a.name}</div>
            <div class="avatar-lock">\${unlocked ? (selected ? '✅' : '') : '🔒 ' + a.level}</div>
        </div>\`;
    }).join('');
    document.getElementById('avatar-selector').classList.add('active');
}

function closeAvatarSelector() {
    document.getElementById('avatar-selector').classList.remove('active');
}

async function selectAvatar(emoji) {
    currentAvatar = emoji;
    document.getElementById('player-avatar').textContent = emoji;
    document.getElementById('tap-btn').textContent = emoji;
    closeAvatarSelector();
    // Sauvegarde
    try {
        await fetch(API + '/api/user/' + telegramId + '/avatar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ avatar: emoji })
        });
    } catch(e) {}
}

loadUser();`);

// Met à jour loadUser pour charger l'avatar
html = html.replace(
    'referrals = parseInt(user.referrals) || 0;',
    `referrals = parseInt(user.referrals) || 0;
            currentAvatar = user.avatar || '👊';
            document.getElementById('player-avatar').textContent = currentAvatar;
            document.getElementById('tap-btn').textContent = currentAvatar;`
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
