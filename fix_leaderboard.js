const fs = require('fs');
let bot = fs.readFileSync('bot.js', 'utf8');

// Remplace la route leaderboard
bot = bot.replace(
    `// LEADERBOARD
app.get('/api/leaderboard', async (req, res) => {
    try {
        const { data: users } = await supabase.from('users').select('username, coins').order('coins', { ascending: false }).limit(10);
        res.json(users);
    } catch (err) { res.status(500).json({ error: err.message }); }
});`,
    `// LEADERBOARD PAR NIVEAU
app.get('/api/leaderboard', async (req, res) => {
    try {
        const level = req.query.level || 'Bronze';
        const { data: users } = await supabase
            .from('users')
            .select('username, coins, level, avatar')
            .eq('level', level)
            .order('coins', { ascending: false })
            .limit(20);
        res.json(users || []);
    } catch (err) { res.status(500).json({ error: err.message }); }
});`
);

fs.writeFileSync('bot.js', bot);
console.log('Done!');
