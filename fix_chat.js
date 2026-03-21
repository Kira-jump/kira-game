const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Ajoute CSS chat
html = html.replace('</style>', `
.chat-page {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 120px);
    padding: 0;
}
.chat-header {
    padding: 15px 20px 10px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
}
.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.chat-message {
    display: flex;
    gap: 10px;
    animation: fadeIn 0.3s ease;
}
.chat-message.own {
    flex-direction: row-reverse;
}
.chat-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f0c040, #e07b00);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
    overflow: hidden;
}
.chat-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.chat-bubble {
    max-width: 75%;
}
.chat-meta {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 4px;
    font-size: 11px;
}
.chat-name { font-weight: 800; color: white; }
.chat-level-badge {
    border-radius: 5px;
    padding: 1px 5px;
    font-size: 9px;
    font-weight: 800;
}
.chat-vip-badge {
    background: linear-gradient(135deg, #ffd700, #ff6600);
    border-radius: 5px;
    padding: 1px 5px;
    font-size: 9px;
    font-weight: 900;
    color: white;
}
.chat-time { color: #555; font-size: 10px; }
.chat-text {
    background: rgba(22,33,62,0.9);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 15px;
    border-top-left-radius: 3px;
    padding: 10px 14px;
    font-size: 14px;
    line-height: 1.4;
    word-break: break-word;
}
.chat-message.own .chat-text {
    background: rgba(240,192,64,0.15);
    border-color: rgba(240,192,64,0.2);
    border-top-left-radius: 15px;
    border-top-right-radius: 3px;
}
.chat-message.own .chat-meta {
    flex-direction: row-reverse;
}
.chat-input-area {
    padding: 10px 15px;
    background: rgba(13,13,26,0.95);
    border-top: 1px solid rgba(255,255,255,0.05);
    display: flex;
    gap: 10px;
    align-items: center;
}
.chat-input {
    flex: 1;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 20px;
    padding: 10px 15px;
    color: white;
    font-size: 14px;
    font-family: 'Nunito', sans-serif;
    outline: none;
    resize: none;
    max-height: 80px;
}
.chat-send-btn {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f0c040, #e07b00);
    border: none;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: transform 0.2s;
}
.chat-send-btn:active { transform: scale(0.9); }
.chat-online {
    font-size: 11px;
    color: #00c864;
    margin-top: 2px;
}
</style>`);

// Ajoute page chat
html = html.replace('<!-- MORE -->', `<!-- CHAT -->
<div class="page" id="page-chat" style="padding:0;padding-bottom:0">
    <div class="chat-page">
        <div class="chat-header">
            <h2 style="margin-bottom:2px">💬 Chat Global</h2>
            <div class="chat-online" id="chat-online">● En ligne</div>
        </div>
        <div class="chat-messages" id="chat-messages">
            <div style="text-align:center;color:#555;font-size:13px;margin-top:20px">Chargement...</div>
        </div>
        <div class="chat-input-area">
            <textarea class="chat-input" id="chat-input" placeholder="Écris un message..." rows="1" maxlength="200"></textarea>
            <button class="chat-send-btn" onclick="sendChatMessage()">➤</button>
        </div>
    </div>
</div>

<!-- MORE -->`);

// Ajoute item chat dans page more
html = html.replace(
    `<div class="more-item" onclick="navigateTo('stats')">
            <div class="more-icon">📊</div>
            <div class="more-name">Stats</div>
        </div>`,
    `<div class="more-item" onclick="navigateTo('stats')">
            <div class="more-icon">📊</div>
            <div class="more-name">Stats</div>
        </div>
        <div class="more-item" onclick="navigateTo('chat')">
            <div class="more-icon">💬</div>
            <div class="more-name">Chat</div>
        </div>`
);

// Ajoute JS chat
html = html.replace('loadUser();', `
// CHAT
let chatRefreshInterval = null;
let lastChatId = 0;
const LEVEL_COLORS_CHAT = { Bronze: '#cd7f32', Silver: '#c0c0c0', Gold: '#ffd700', Platinum: '#00bfff', Diamond: '#b9f2ff', Legend: '#ff6600' };

function formatChatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    if (diff < 60000) return 'maintenant';
    if (diff < 3600000) return Math.floor(diff/60000) + 'min';
    if (diff < 86400000) return Math.floor(diff/3600000) + 'h';
    return Math.floor(diff/86400000) + 'j';
}

async function loadChat() {
    try {
        const res = await fetch(API + '/api/chat');
        if (!res.ok) return;
        const messages = await res.json();
        const container = document.getElementById('chat-messages');
        const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;

        if (messages.length === 0) {
            container.innerHTML = '<div style="text-align:center;color:#555;font-size:13px;margin-top:20px">Sois le premier à écrire ! 👋</div>';
            return;
        }

        container.innerHTML = messages.reverse().map(msg => {
            const isOwn = msg.telegram_id === telegramId;
            const levelColor = LEVEL_COLORS_CHAT[msg.level] || '#cd7f32';
            return \`
                <div class="chat-message \${isOwn ? 'own' : ''}">
                    <div class="chat-avatar">👊</div>
                    <div class="chat-bubble">
                        <div class="chat-meta">
                            <span class="chat-name">\${msg.username}</span>
                            <span class="chat-level-badge" style="background:\${levelColor}33;color:\${levelColor}">\${msg.level}</span>
                            \${msg.is_vip ? '<span class="chat-vip-badge">VIP</span>' : ''}
                            <span class="chat-time">\${formatChatTime(msg.created_at)}</span>
                        </div>
                        <div class="chat-text">\${msg.message}</div>
                    </div>
                </div>
            \`;
        }).join('');

        if (isAtBottom) container.scrollTop = container.scrollHeight;
    } catch(e) {}
}

async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;

    try {
        const res = await fetch(API + '/api/chat/' + telegramId, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        if (res.ok) {
            input.value = '';
            await loadChat();
            const container = document.getElementById('chat-messages');
            container.scrollTop = container.scrollHeight;
        } else {
            const err = await res.json();
            alert(err.error);
        }
    } catch(e) { alert('Erreur réseau'); }
}

// Enter pour envoyer
document.getElementById('chat-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendChatMessage();
    }
});

const origShowPage4 = showPage;
showPage = function(name, btn) {
    origShowPage4(name, btn);
    if (name === 'chat') {
        loadChat();
        chatRefreshInterval = setInterval(loadChat, 5000);
    } else {
        if (chatRefreshInterval) { clearInterval(chatRefreshInterval); chatRefreshInterval = null; }
    }
};

loadUser();`);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
