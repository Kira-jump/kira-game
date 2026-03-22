const { validateEnv } = require('../server/env');

try {
    validateEnv();
    console.log('Environment looks complete.');
} catch (error) {
    console.error(error.message);
    process.exit(1);
}
