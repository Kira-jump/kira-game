const { BOOSTS, MISSIONS, CARDS } = require('../config/game-config');

function safeJson(value, fallback) {
    if (Array.isArray(value) || (value && typeof value === 'object')) {
        return value;
    }
    return fallback;
}

function todayIso() {
    return new Date().toISOString().split('T')[0];
}

function calcCardCost(card, level) {
    return Math.floor(card.baseCost * Math.pow(1.6, Math.max(0, level - 1)));
}

function buildCardState(card, owned) {
    const level = owned?.level || 0;
    return {
        ...card,
        level,
        nextCost: calcCardCost(card, level + 1),
    };
}

module.exports = function registerExtraRoutes(app, deps) {
    const { supabase, bot, sendNotification, getLevel, features, adminSecret } = deps;

    app.get('/api/user/:telegramId/state', async (req, res) => {
        try {
            const { data: user } = await supabase
                .from('users')
                .select('*')
                .eq('telegram_id', req.params.telegramId)
                .single();

            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }

            const cards = safeJson(user.cards, []);
            const boosts = safeJson(user.boosts, []);
            const catalog = CARDS.map((card) => buildCardState(card, cards.find((entry) => entry.cardId === card.id)));

            res.json({
                user,
                features,
                cards: catalog,
                boosts,
                missions: MISSIONS,
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.get('/api/referrals/:telegramId', async (req, res) => {
        try {
            const { data: referrals } = await supabase
                .from('users')
                .select('telegram_id, username, coins, created_at')
                .eq('referred_by', req.params.telegramId)
                .order('created_at', { ascending: false });

            res.json({
                inviteLink: `https://t.me/${process.env.BOT_USERNAME || 'your_bot'}?start=${req.params.telegramId}`,
                referrals: referrals || [],
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.post('/api/daily/:telegramId/claim', async (req, res) => {
        try {
            const today = todayIso();
            const { data: existing } = await supabase
                .from('daily_rewards')
                .select('*')
                .eq('telegram_id', req.params.telegramId)
                .eq('claimed_date', today)
                .single();

            if (existing) {
                return res.status(400).json({ error: 'Reward déjà récupéré aujourd’hui' });
            }

            const { data: user } = await supabase
                .from('users')
                .select('*')
                .eq('telegram_id', req.params.telegramId)
                .single();

            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }

            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            const streak = user.last_daily_claim === yesterday ? (user.daily_streak || 1) + 1 : 1;
            const reward = Math.min(5000, 500 * streak);

            const { data: updated } = await supabase
                .from('users')
                .update({
                    coins: (user.coins || 0) + reward,
                    total_coins: (user.total_coins || 0) + reward,
                    daily_streak: streak,
                    last_daily_claim: today,
                })
                .eq('telegram_id', req.params.telegramId)
                .select()
                .single();

            await supabase.from('daily_rewards').insert({
                telegram_id: req.params.telegramId,
                day_streak: streak,
                reward,
                claimed_date: today,
            });

            res.json({ reward, streak, user: updated });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.get('/api/boosts/:telegramId', async (req, res) => {
        try {
            const { data: rows } = await supabase
                .from('boosts_usage')
                .select('*')
                .eq('telegram_id', req.params.telegramId)
                .order('started_at', { ascending: false });

            res.json({
                catalog: BOOSTS,
                active: rows || [],
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.post('/api/boosts/:telegramId/activate', async (req, res) => {
        try {
            const { boostId } = req.body;
            const boost = BOOSTS.find((entry) => entry.id === boostId);
            if (!boost) {
                return res.status(404).json({ error: 'Boost invalide' });
            }

            const now = new Date();
            const { data: cooldownRow } = await supabase
                .from('boosts_usage')
                .select('*')
                .eq('telegram_id', req.params.telegramId)
                .eq('boost_id', boostId)
                .order('started_at', { ascending: false })
                .limit(1)
                .single();

            if (cooldownRow?.cooldown_until && new Date(cooldownRow.cooldown_until) > now) {
                return res.status(429).json({ error: 'Boost en cooldown' });
            }

            const expiresAt = new Date(now.getTime() + boost.durationSec * 1000).toISOString();
            const cooldownUntil = new Date(now.getTime() + boost.cooldownSec * 1000).toISOString();

            const { data: inserted } = await supabase
                .from('boosts_usage')
                .insert({
                    telegram_id: req.params.telegramId,
                    boost_id: boostId,
                    started_at: now.toISOString(),
                    expires_at: expiresAt,
                    cooldown_until: cooldownUntil,
                })
                .select()
                .single();

            res.json({ boost, usage: inserted });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.get('/api/clans', async (_req, res) => {
        try {
            const { data } = await supabase
                .from('clans')
                .select('*')
                .order('total_points', { ascending: false })
                .limit(50);
            res.json(data || []);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.post('/api/clans/:telegramId/create', async (req, res) => {
        try {
            const { name, slug, description } = req.body;
            if (!name || !slug) {
                return res.status(400).json({ error: 'Nom et slug requis' });
            }

            const normalizedSlug = String(slug).trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
            const { data: clan } = await supabase
                .from('clans')
                .insert({
                    name: String(name).trim(),
                    slug: normalizedSlug,
                    description: description || '',
                    owner_telegram_id: req.params.telegramId,
                    members_count: 1,
                })
                .select()
                .single();

            await supabase.from('clan_members').insert({
                clan_id: clan.id,
                telegram_id: req.params.telegramId,
                role: 'owner',
            });

            await supabase
                .from('users')
                .update({ clan_slug: normalizedSlug })
                .eq('telegram_id', req.params.telegramId);

            res.json(clan);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.post('/api/clans/:telegramId/join', async (req, res) => {
        try {
            const { slug } = req.body;
            const { data: clan } = await supabase
                .from('clans')
                .select('*')
                .eq('slug', slug)
                .single();

            if (!clan) {
                return res.status(404).json({ error: 'Clan introuvable' });
            }

            const { data: existing } = await supabase
                .from('clan_members')
                .select('*')
                .eq('clan_id', clan.id)
                .eq('telegram_id', req.params.telegramId)
                .single();

            if (!existing) {
                await supabase.from('clan_members').insert({
                    clan_id: clan.id,
                    telegram_id: req.params.telegramId,
                    role: 'member',
                });
                await supabase
                    .from('clans')
                    .update({ members_count: (clan.members_count || 0) + 1 })
                    .eq('id', clan.id);
            }

            await supabase
                .from('users')
                .update({ clan_slug: clan.slug })
                .eq('telegram_id', req.params.telegramId);

            res.json({ success: true, clan });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.post('/api/user/:telegramId/withdrawals', async (req, res) => {
        try {
            const { amount, walletAddress } = req.body;
            const coinsAmount = Number(amount);
            if (!Number.isFinite(coinsAmount) || coinsAmount < 100000) {
                return res.status(400).json({ error: 'Montant minimum 100000 coins' });
            }

            const { data: user } = await supabase
                .from('users')
                .select('*')
                .eq('telegram_id', req.params.telegramId)
                .single();

            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }

            if ((user.coins || 0) < coinsAmount) {
                return res.status(400).json({ error: 'Pas assez de coins' });
            }

            const { data: created } = await supabase
                .from('withdrawals')
                .insert({
                    telegram_id: req.params.telegramId,
                    wallet_address: walletAddress || user.wallet_address,
                    amount: coinsAmount,
                    status: 'pending',
                })
                .select()
                .single();

            await supabase
                .from('users')
                .update({ coins: (user.coins || 0) - coinsAmount })
                .eq('telegram_id', req.params.telegramId);

            res.json(created);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.get('/api/user/:telegramId/withdrawals', async (req, res) => {
        try {
            const { data } = await supabase
                .from('withdrawals')
                .select('*')
                .eq('telegram_id', req.params.telegramId)
                .order('created_at', { ascending: false })
                .limit(20);
            res.json(data || []);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.post('/api/admin/withdrawals/:id/process', async (req, res) => {
        try {
            const { secret, status } = req.body;
            if (secret !== adminSecret) {
                return res.status(401).json({ error: 'Non autorisé' });
            }

            const { data: updated } = await supabase
                .from('withdrawals')
                .update({
                    status: status || 'approved',
                    processed_at: new Date().toISOString(),
                })
                .eq('id', req.params.id)
                .select()
                .single();

            if (updated && bot) {
                await sendNotification(updated.telegram_id, `withdrawal_${updated.id}`, `💸 Retrait ${updated.status} pour ${updated.amount} coins.`);
            }

            res.json(updated);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.get('/api/admin/health', async (req, res) => {
        const secret = req.headers['x-admin-secret'];
        if (secret !== adminSecret) {
            return res.status(401).json({ error: 'Non autorisé' });
        }

        try {
            const { count: usersCount } = await supabase.from('users').select('*', { head: true, count: 'exact' });
            const { count: withdrawalsCount } = await supabase.from('withdrawals').select('*', { head: true, count: 'exact' });
            res.json({
                ok: true,
                users: usersCount || 0,
                withdrawals: withdrawalsCount || 0,
                features,
                timestamp: new Date().toISOString(),
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
};
