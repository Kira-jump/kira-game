const fs = require('fs');
let bot = fs.readFileSync('bot.js', 'utf8');

// Ajoute la fonction de niveau après les imports
bot = bot.replace(
    "const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });",
    `const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

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
}`
);

// Mets à jour le tap pour incrementer total_coins
bot = bot.replace(
    "const { data: user } = await supabase.from('users').update({ coins, last_seen: new Date() }).eq('telegram_id', req.params.telegramId).select().single();",
    `const { data: currentUser } = await supabase.from('users').select('total_coins').eq('telegram_id', req.params.telegramId).single();
        const totalCoins = (currentUser?.total_coins || 0) + 1;
        const { data: user } = await supabase.from('users').update({ coins, last_seen: new Date(), total_coins: totalCoins }).eq('telegram_id', req.params.telegramId).select().single();
        await checkLevelUp(req.params.telegramId, totalCoins);`
);

fs.writeFileSync('bot.js', bot);
console.log('Done!');
