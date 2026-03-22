const fs = require('fs');
let bot = fs.readFileSync('bot.js', 'utf8');

bot = bot.replace(
    `const { data: users } = await supabase
            .from('users')
            .select('username, coins, level, avatar')
            .eq('level', level)
            .order('coins', { ascending: false })
            .limit(20);`,
    `const { data: users } = await supabase
            .from('users')
            .select('username, coins, level, avatar, photo_url, telegram_id')
            .eq('level', level)
            .order('coins', { ascending: false })
            .limit(20);`
);

fs.writeFileSync('bot.js', bot);
console.log('Done!');
