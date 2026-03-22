const LEVELS = [
    { name: 'Bronze', icon: '🥉', min: 0, tapBonus: 1 },
    { name: 'Silver', icon: '🥈', min: 50000, tapBonus: 2 },
    { name: 'Gold', icon: '🥇', min: 500000, tapBonus: 3 },
    { name: 'Platinum', icon: '💠', min: 2000000, tapBonus: 4 },
    { name: 'Diamond', icon: '💎', min: 10000000, tapBonus: 5 },
    { name: 'Legend', icon: '👑', min: 50000000, tapBonus: 10 },
];

const BOOSTS = [
    { id: 'turbo_tap', name: 'Turbo Tap', icon: '⚡', multiplier: 5, durationSec: 30, cooldownSec: 3600 },
    { id: 'auto_bot', name: 'Auto Bot', icon: '🤖', multiplier: 1, durationSec: 600, cooldownSec: 7200 },
    { id: 'mega_mining', name: 'Mega Mining', icon: '⛏️', multiplier: 3, durationSec: 180, cooldownSec: 10800 },
];

const MISSIONS = [
    { id: 'daily_login', name: 'Connexion quotidienne', icon: '📅', reward: 1000, repeat: 'daily' },
    { id: 'first_taps', name: 'Faire 500 taps', icon: '👆', reward: 1500, repeat: 'daily', target: 500 },
    { id: 'buy_card', name: 'Acheter une carte', icon: '🃏', reward: 2000, repeat: 'daily', target: 1 },
    { id: 'invite_friend', name: 'Inviter un ami', icon: '👥', reward: 5000, repeat: 'daily', target: 1 },
    { id: 'connect_wallet', name: 'Connecter un wallet', icon: '💎', reward: 2500, repeat: 'once' },
];

const CARDS = [
    { id: 'farm_cpu', name: 'CPU Farm', category: 'Infrastructure', baseCost: 1000, incomePerHour: 25, icon: '🖥️' },
    { id: 'quantum_rig', name: 'Quantum Rig', category: 'Infrastructure', baseCost: 15000, incomePerHour: 320, icon: '⚛️' },
    { id: 'guild_manager', name: 'Guild Manager', category: 'Social', baseCost: 30000, incomePerHour: 640, icon: '🏰' },
    { id: 'trade_bot', name: 'Trade Bot', category: 'Economy', baseCost: 70000, incomePerHour: 1600, icon: '📈' },
    { id: 'ai_lab', name: 'AI Lab', category: 'Research', baseCost: 150000, incomePerHour: 3800, icon: '🧠' },
];

const WHEEL_REWARDS = [
    { id: 'coins_500', label: '500 coins', type: 'coins', amount: 500, chance: 28 },
    { id: 'coins_1000', label: '1000 coins', type: 'coins', amount: 1000, chance: 24 },
    { id: 'coins_5000', label: '5000 coins', type: 'coins', amount: 5000, chance: 12 },
    { id: 'nitro_boost', label: 'Boost', type: 'boost', boostId: 'turbo_tap', chance: 10 },
    { id: 'energy_pack', label: 'Energie', type: 'energy', amount: 100, chance: 18 },
    { id: 'jackpot', label: 'Jackpot', type: 'coins', amount: 20000, chance: 8 },
];

const FEATURES = {
    taps: true,
    energy: true,
    passiveIncome: true,
    cards: true,
    missions: true,
    referrals: true,
    wheel: true,
    boosts: true,
    leaderboard: true,
    clans: true,
    chat: true,
    wallet: true,
    withdrawals: true,
    adminPanel: true,
    promoCodes: true,
    antiAbuse: true,
};

module.exports = {
    LEVELS,
    BOOSTS,
    MISSIONS,
    CARDS,
    WHEEL_REWARDS,
    FEATURES,
};
