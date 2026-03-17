require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');

const app = express();
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Serveur pour héberger la Mini App
app.use(express.static(path.join(__dirname, 'public')));

// Commande /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
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
});

app.listen(process.env.PORT, () => {
    console.log(`Serveur démarré sur le port ${process.env.PORT}`);
});

console.log('Bot démarré...');
