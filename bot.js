require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/User');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connecté !'))
    .catch(err => console.log('❌ Erreur MongoDB:', err));

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Commande /start
bot.onText(/\/start (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const referrerId = match[1];
    await registerUser(msg, referrerId);
    sendWelcome(chatId);
});

bot.onText(/\/start$/, async (msg) => {
    const chatId = msg.chat.id;
    await registerUser(msg, null);
    sendWelcome(chatId);
});

async function registerUser(msg, referrerId) {
    const telegramId = msg.chat.id.toString();
    let user = await User.findOne({ telegramId });
    if (!user) {
        user = new User({
            telegramId,
            username: msg.chat.username || msg.chat.first_name || 'Joueur',
            referredBy: referrerId || null
        });
        await user.save();
        if (referrerId) {
            await User.findOneAndUpdate(
                { telegramId: referrerId },
                { $inc: { referrals: 1, coins: 500 } }
            );
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
        let user = await User.findOne({ telegramId: req.params.telegramId });
        if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

        // Calcul revenus passifs
        const now = Date.now();
        const lastSeen = new Date(user.lastSeen).getTime();
        const diffHours = (now - lastSeen) / (1000 * 60 * 60);
        const earned = Math.floor(diffHours * user.coinsPerHour);
        if (earned > 0) {
            user.coins += earned;
            user.lastSeen = now;
            await user.save();
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
        const user = await User.findOneAndUpdate(
            { telegramId: req.params.telegramId },
            { coins, lastSeen: Date.now() },
            { new: true }
        );
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API - Acheter une carte
app.post('/api/user/:telegramId/buy-card', async (req, res) => {
    try {
        const { cardId, cost, coinsPerHour } = req.body;
        const user = await User.findOne({ telegramId: req.params.telegramId });
        if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
        if (user.coins < cost) return res.status(400).json({ error: 'Pas assez de coins' });

        user.coins -= cost;
        user.coinsPerHour += coinsPerHour;

        const card = user.cards.find(c => c.cardId === cardId);
        if (card) card.level += 1;
        else user.cards.push({ cardId, level: 1 });

        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API - Classement
app.get('/api/leaderboard', async (req, res) => {
    try {
        const users = await User.find().sort({ coins: -1 }).limit(10);
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`✅ Serveur démarré sur le port ${process.env.PORT}`);
});

console.log('🤖 Bot démarré...');
