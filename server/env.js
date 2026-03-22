require('dotenv').config();

const requiredEnv = [
    'PORT',
    'APP_URL',
    'BOT_TOKEN',
    'BOT_USERNAME',
    'SUPABASE_URL',
    'SUPABASE_KEY',
    'ADMIN_SECRET',
];

function getEnv() {
    return {
        PORT: process.env.PORT,
        APP_URL: process.env.APP_URL,
        BOT_TOKEN: process.env.BOT_TOKEN,
        BOT_USERNAME: process.env.BOT_USERNAME,
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_KEY: process.env.SUPABASE_KEY,
        ADMIN_SECRET: process.env.ADMIN_SECRET,
    };
}

function validateEnv() {
    const missing = requiredEnv.filter((key) => !process.env[key]);
    if (missing.length > 0) {
        throw new Error(`Missing env vars: ${missing.join(', ')}`);
    }
}

module.exports = {
    getEnv,
    validateEnv,
    requiredEnv,
};
