const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const requiredFiles = [
    'bot.js',
    'public/index.html',
    'public/admin.html',
    'public/app-config.js',
    'config/game-config.js',
    'server/register-extra-routes.js',
    'server/env.js',
    'server/middleware/admin-auth.js',
    'server/middleware/rate-limit.js',
    'supabase/schema.sql',
];

const missing = requiredFiles.filter((relativePath) => !fs.existsSync(path.join(root, relativePath)));

if (missing.length > 0) {
    console.error('Missing required project files:', missing.join(', '));
    process.exit(1);
}

console.log('Smoke test passed. Core project files are present.');
