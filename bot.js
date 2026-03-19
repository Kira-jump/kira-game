require('dotenv').config();
const express = require('express');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/start (.+)/, async (msg, match) => {
    await registerUser(msg, match[1]);
    sendWelcome(msg.chat.id);
});

bot.onText(/\/start$/, async (msg) => {
    await registerUser(msg, null);
    sendWelcome(msg.chat.id);
});

async function registerUser(msg, referrerId) {
    const telegramId = msg.chat.id.toString();
    const username = msg.chat.username || msg.chat.first_name || 'Joueur';
    const { data: existing } = await supabase
        .from('users').select('*').eq('telegram_id', telegramId).single();
    if (!existing) {
        await supabase.from('users').insert({ telegram_id: telegramId, username, referred_by: referrerId || null });
        if (referrerId) {
            const { data: ref } = await supabase.from('users').select('*').eq('telegram_id', referrerId).single();
            if (ref) await supabase.from('users').update({ coins: ref.coins + 500, referrals: ref.referrals + 1 }).eq('telegram_id', referrerId);
        }
    }
}

function sendWelcome(chatId) {
    bot.sendMessage(chatId, '🎮 Bienvenue sur Kira Game !', {
        reply_markup: { inline_keyboard: [[{ text: '🎮 Jouer', web_app: { url: process.env.APP_URL } }]] }
    });
}

// INIT USER
app.post('/api/user/init', async (req, res) => {
    try {
        const { telegramId, username } = req.body;
        let { data: user } = await supabase.from('users').select('*').eq('telegram_id', telegramId).single();
        if (!user) {
            const { data: newUser } = await supabase.from('users').insert({ telegram_id: telegramId, username }).select().single();
            user = newUser;
        }
        const now = Date.now();
        const lastSeen = new Date(user.last_seen).getTime();
        const diffHours = (now - lastSeen) / (1000 * 60 * 60);
        const earned = Math.floor(diffHours * user.coins_per_hour);
        if (earned > 0) {
            await supabase.from('users').update({ coins: user.coins + earned, last_seen: new Date() }).eq('telegram_id', telegramId);
            user.coins += earned;
        }
        res.json(user);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// SAVE COINS
app.post('/api/user/:telegramId/tap', async (req, res) => {
    try {
        const { coins } = req.body;
        const { data: user } = await supabase.from('users').update({ coins, last_seen: new Date() }).eq('telegram_id', req.params.telegramId).select().single();
        res.json(user);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// BUY CARD
app.post('/api/user/:telegramId/buy-card', async (req, res) => {
    try {
        const { cardId, cost, coinsPerHour } = req.body;
        const { data: user } = await supabase.from('users').select('*').eq('telegram_id', req.params.telegramId).single();
        if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
        if (user.coins < cost) return res.status(400).json({ error: 'Pas assez de coins' });
        const cards = user.cards || [];
        const cardIndex = cards.findIndex(c => c.cardId === cardId);
        if (cardIndex >= 0) cards[cardIndex].level += 1;
        else cards.push({ cardId, level: 1 });
        const { data: updated } = await supabase.from('users').update({
            coins: user.coins - cost,
            coins_per_hour: user.coins_per_hour + coinsPerHour,
            cards
        }).eq('telegram_id', req.params.telegramId).select().single();
        res.json(updated);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// LEADERBOARD
app.get('/api/leaderboard', async (req, res) => {
    try {
        const { data: users } = await supabase.from('users').select('username, coins').order('coins', { ascending: false }).limit(10);
        res.json(users);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET MISSIONS
app.get('/api/missions/:telegramId', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const { data: completed } = await supabase
            .from('missions')
            .select('mission_id')
            .eq('telegram_id', req.params.telegramId)
            .eq('completed_at', today);
        res.json(completed || []);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// COMPLETE MISSION
app.post('/api/missions/:telegramId/complete', async (req, res) => {
    try {
        const { missionId, reward } = req.body;
        const today = new Date().toISOString().split('T')[0];
        const { data: existing } = await supabase
            .from('missions')
            .select('*')
            .eq('telegram_id', req.params.telegramId)
            .eq('mission_id', missionId)
            .eq('completed_at', today)
            .single();
        if (existing) return res.status(400).json({ error: 'Mission déjà complétée' });
        await supabase.from('missions').insert({
            telegram_id: req.params.telegramId,
            mission_id: missionId,
            completed_at: today
        });
        const { data: user } = await supabase.from('users').select('*').eq('telegram_id', req.params.telegramId).single();
        const { data: updated } = await supabase.from('users').update({ coins: user.coins + reward }).eq('telegram_id', req.params.telegramId).select().single();
        res.json(updated);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(process.env.PORT, () => console.log(`✅ Serveur démarré sur le port ${process.env.PORT}`));
console.log('🤖 Bot démarré...');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅' : '❌');
console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY ? '✅' : '❌');
console.log('BOT_TOKEN:', process.env.BOT_TOKEN ? '✅' : '❌');
