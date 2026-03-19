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

const LEVELS = [
    { name: 'Bronze', icon: '🥉', min: 0, tapBonus: 1 },
    { name: 'Silver', icon: '🥈', min: 50000, tapBonus: 2 },
    { name: 'Gold', icon: '🥇', min: 500000, tapBonus: 3 },
    { name: 'Platinum', icon: '💠', min: 2000000, tapBonus: 4 },
    { name: 'Diamond', icon: '💎', min: 10000000, tapBonus: 5 },
    { name: 'Legend', icon: '👑', min: 50000000, tapBonus: 10 },
];

function getLevel(totalCoins) {
    let level = LEVELS[0];
    for (const l of LEVELS) {
        if (totalCoins >= l.min) level = l;
    }
    return level;
}

async function checkLevelUp(telegramId, totalCoins) {
    const level = getLevel(totalCoins);
    const { data: user } = await supabase.from('users').select('level').eq('telegram_id', telegramId).single();
    if (user && user.level !== level.name) {
        await supabase.from('users').update({ level: level.name, coins_per_tap: level.tapBonus }).eq('telegram_id', telegramId);
        sendNotification(telegramId, 'levelup_' + level.name, level.icon + ' Félicitations ! Tu es passé niveau ' + level.name + ' ! Ton tap est maintenant x' + level.tapBonus + ' ! 🎉');
    }
}

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
    const { data: existing } = await supabase.from('users').select('*').eq('telegram_id', telegramId).single();
    if (!existing) {
        await supabase.from('users').insert({ telegram_id: telegramId, username, referred_by: referrerId || null });
        if (referrerId) {
            const { data: ref } = await supabase.from('users').select('*').eq('telegram_id', referrerId).single();
            if (ref) {
                await supabase.from('users').update({ coins: ref.coins + 500, referrals: ref.referrals + 1 }).eq('telegram_id', referrerId);
                // Notifie le parrain
                sendNotification(referrerId, 'referral', '👥 Un ami vient de rejoindre Kira Game grâce à toi ! Tu as reçu 500 coins ! 🎉');
            }
        }
        // Notification de bienvenue
        setTimeout(() => {
            bot.sendMessage(telegramId, '🎮 Bienvenue sur Kira Game !\n\n✅ Missions quotidiennes\n⚡ Boosts temporaires\n🃏 Cartes à collecter\n💎 Wallet TON\n\nTape /start pour jouer !');
        }, 2000);
    }
}

function sendWelcome(chatId) {
    bot.sendMessage(chatId, '🎮 Bienvenue sur Kira Game !', {
        reply_markup: { inline_keyboard: [[{ text: '🎮 Jouer', web_app: { url: process.env.APP_URL } }]] }
    });
}

async function sendNotification(telegramId, type, message) {
    try {
        const today = new Date().toISOString().split('T')[0];
        const { data: existing } = await supabase
            .from('notifications')
            .select('*')
            .eq('telegram_id', telegramId)
            .eq('type', type)
            .eq('sent_date', today)
            .single();
        if (!existing) {
            await bot.sendMessage(telegramId, message, {
                reply_markup: { inline_keyboard: [[{ text: '🎮 Jouer', web_app: { url: process.env.APP_URL } }]] }
            });
            await supabase.from('notifications').insert({ telegram_id: telegramId, type, sent_date: today });
        }
    } catch(e) { console.log('Notification error:', e); }
}

// NOTIFICATIONS AUTOMATIQUES
async function sendDailyNotifications() {
    try {
        const { data: users } = await supabase.from('users').select('telegram_id, coins, coins_per_hour');
        if (!users) return;
        for (const user of users) {
            const earned = Math.floor(user.coins_per_hour * 8);
            const message = earned > 0
                ? `🌅 Bonjour ! Tu as gagné ${earned} coins pendant ton absence !\n💰 Viens collecter tes récompenses et accomplir tes missions du jour !`
                : `🌅 Bonjour ! Tes missions quotidiennes t'attendent !\n🎯 Connecte-toi pour gagner des coins !`;
            await sendNotification(user.telegram_id, 'daily', message);
            await new Promise(r => setTimeout(r, 100));
        }
        console.log('✅ Notifications quotidiennes envoyées !');
    } catch(e) { console.log('Daily notif error:', e); }
}

// Lance les notifications toutes les 8 heures
setInterval(sendDailyNotifications, 8 * 60 * 60 * 1000);

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
            // Notifie des revenus passifs
            if (earned >= 100) {
                sendNotification(telegramId, 'passive_income', `💰 Tu as gagné ${earned} coins en revenus passifs ! Continue à améliorer tes cartes !`);
            }
        }
        res.json(user);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// SAVE COINS
app.post('/api/user/:telegramId/tap', async (req, res) => {
    try {
        const { coins } = req.body;
        const { data: currentUser } = await supabase.from('users').select('total_coins').eq('telegram_id', req.params.telegramId).single();
        const totalCoins = (currentUser?.total_coins || 0) + 1;
        const { data: user } = await supabase.from('users').update({ coins, last_seen: new Date(), total_coins: totalCoins }).eq('telegram_id', req.params.telegramId).select().single();
        await checkLevelUp(req.params.telegramId, totalCoins);
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
        const { data: completed } = await supabase.from('missions').select('mission_id').eq('telegram_id', req.params.telegramId).eq('completed_at', today);
        res.json(completed || []);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// COMPLETE MISSION
app.post('/api/missions/:telegramId/complete', async (req, res) => {
    try {
        const { missionId, reward } = req.body;
        const today = new Date().toISOString().split('T')[0];
        const { data: existing } = await supabase.from('missions').select('*').eq('telegram_id', req.params.telegramId).eq('mission_id', missionId).eq('completed_at', today).single();
        if (existing) return res.status(400).json({ error: 'Mission déjà complétée' });
        await supabase.from('missions').insert({ telegram_id: req.params.telegramId, mission_id: missionId, completed_at: today });
        const { data: user } = await supabase.from('users').select('*').eq('telegram_id', req.params.telegramId).single();
        const { data: updated } = await supabase.from('users').update({ coins: user.coins + reward }).eq('telegram_id', req.params.telegramId).select().single();
        // Notifie
        sendNotification(req.params.telegramId, 'mission_' + missionId, `🎯 Mission accomplie ! Tu as gagné ${reward} coins ! 🎉`);
        res.json(updated);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// SAVE WALLET
app.post('/api/user/:telegramId/wallet', async (req, res) => {
    try {
        const { walletAddress } = req.body;
        const { data: user } = await supabase.from('users').update({ wallet_address: walletAddress }).eq('telegram_id', req.params.telegramId).select().single();
        sendNotification(req.params.telegramId, 'wallet_connected', '💎 Ton wallet TON est connecté à Kira Game ! Tu es prêt pour recevoir tes tokens ! 🚀');
        res.json(user);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// SEND MANUAL NOTIFICATION
app.post('/api/notify/:telegramId', async (req, res) => {
    try {
        const { message } = req.body;
        await bot.sendMessage(req.params.telegramId, message, {
            reply_markup: { inline_keyboard: [[{ text: '🎮 Jouer', web_app: { url: process.env.APP_URL } }]] }
        });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(process.env.PORT, () => console.log(`✅ Serveur démarré sur le port ${process.env.PORT}`));
console.log('🤖 Bot démarré...');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅' : '❌');
console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY ? '✅' : '❌');
console.log('BOT_TOKEN:', process.env.BOT_TOKEN ? '✅' : '❌');
