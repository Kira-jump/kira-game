const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    telegramId: { type: String, required: true, unique: true },
    username: { type: String, default: 'Joueur' },
    coins: { type: Number, default: 0 },
    coinsPerTap: { type: Number, default: 1 },
    coinsPerHour: { type: Number, default: 0 },
    lastSeen: { type: Date, default: Date.now },
    referredBy: { type: String, default: null },
    referrals: { type: Number, default: 0 },
    cards: [
        {
            cardId: String,
            level: { type: Number, default: 0 }
        }
    ]
});

module.exports = mongoose.model('User', UserSchema);
