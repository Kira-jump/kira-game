function createRateLimiter() {
    const store = new Map();

    function applyRateLimit(key, limit, windowMs) {
        const now = Date.now();
        const current = store.get(key) || { count: 0, resetAt: now + windowMs };

        if (current.resetAt <= now) {
            current.count = 0;
            current.resetAt = now + windowMs;
        }

        current.count += 1;
        store.set(key, current);

        return current.count <= limit;
    }

    return { applyRateLimit };
}

module.exports = {
    createRateLimiter,
};
