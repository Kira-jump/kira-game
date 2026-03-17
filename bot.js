require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connexion Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
console.log('✅ Supabase connecté !');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Commande /start
bot.onText(/\/start (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    await registerUser(msg, match[1]);
    sendWelcome(chatId);
});

bot.onText(/\/start$/, async (msg) => {
    const chatId = msg.chat.id;
    await registerUser(msg, null);
    sendWelcome(chatId);
});

async function registerUser(msg, referrerId) {
    const telegramId = msg.chat.id.toString();
    const username = msg.chat.username || msg.chat.first_name || 'Joueur';

    const { data: existing } = await supabase
        .from('users')
        .select('*')
        .eq('telegram_id', telegramId)
        .single();

    if (!existing) {
        await supabase.from('users').insert({
            telegram_id: telegramId,
            username,
            referred_by: referrerId || null
        });

        if (referrerId) {
            const { data: ref } = await supabase
                .from('users')
                .select('*')
                .eq('telegram_id', referrerId)
                .single();
            if (ref) {
                await supabase
                    .from('users')
                    .update({ coins: ref.coins + 500, referrals: ref.referrals + 1 })
                    .eq('telegram_id', referrerId);
            }
        }
    }
}

function sendWelcome(chatId) {
    bot.sendMessage(chatId, '🎮 Bienvenue sur Kira Game !', {
        reply_markup: {
            inline_keyboard: [[
                {
                    text: '🎮 Jouer',
                    web_app: { url: process.env.APP_URL }
                }
            ]]
        }
    });
}

// API - Récupérer un joueur
app.get('/api/user/:telegramId', async (req, res) => {
    try {
        const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('telegram_id', req.params.telegramId)
            .single();

        if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

        // Calcul revenus passifs
        const now = Date.now();
        const lastSeen = new Date(user.last_seen).getTime();
        const diffHours = (now - lastSeen) / (1000 * 60 * 60);
        const earned = Math.floor(diffHours * user.coins_per_hour);

        if (earned > 0) {
            await supabase
                .from('users')
                .update({ coins: user.coins + earned, last_seen: new Date() })
                .eq('telegram_id', req.params.telegramId);
            user.coins += earned;
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API - Sauvegarder les coins
app.post('/api/user/:telegramId/tap', async (req, res) => {
    try {
        const { coins } = req.body;
        const { data: user } = await supabase
            .from('users')
            .update({ coins, last_seen: new Date() })
            .eq('telegram_id', req.params.telegramId)
            .select()
            .single();
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API - Acheter une carte
app.post('/api/user/:telegramId/buy-card', async (req, res) => {
    try {
        const { cardId, cost, coinsPerHour } = req.body;
        const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('telegram_id', req.params.telegramId)
            .single();

        if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
        if (user.coins < cost) return res.status(400).json({ error: 'Pas assez de coins' });

        const cards = user.cards || [];
        const cardIndex = cards.findIndex(c => c.cardId === cardId);
        if (cardIndex >= 0) cards[cardIndex].level += 1;
        else cards.push({ cardId, level: 1 });

        const { data: updated } = await supabase
            .from('users')
            .update({
                coins: user.coins - cost,
                coins_per_hour: user.coins_per_hour + coinsPerHour,
                cards
            })
            .eq('telegram_id', req.params.telegramId)
            .select()
            .single();

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API - Classement
app.get('/api/leaderboard', async (req, res) => {
    try {
        const { data: users } = await supabase
            .from('users')
            .select('username, coins')
            .order('coins', { ascending: false })
            .limit(10);
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`✅ Serveur démarré sur le port ${process.env.PORT}`);
});

console.log('🤖 Bot démarré...');
