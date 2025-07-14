const tokenBlacklist = require('../utils/tokenblacklist');

const isTokenBlacklisted = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(' ')[2];
    if (tokenBlacklist.has(token)) {
        return res.status(401).json({ message: "Token has been blacklisted (expired)" });
    }

    next();
};

module.exports = isTokenBlacklisted
