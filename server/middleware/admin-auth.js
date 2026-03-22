function isAdminAuthorized(req, adminSecret) {
    const headerSecret = req.headers['x-admin-secret'];
    const bodySecret = req.body?.password;
    return headerSecret === adminSecret || bodySecret === adminSecret;
}

function requireAdmin(req, res, next, adminSecret) {
    if (!isAdminAuthorized(req, adminSecret)) {
        return res.status(401).json({ error: 'Non autorisé' });
    }
    return next();
}

module.exports = {
    isAdminAuthorized,
    requireAdmin,
};
