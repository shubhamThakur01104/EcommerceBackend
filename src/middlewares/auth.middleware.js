const jwt = require('jsonwebtoken');

const tokenVerification = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Authorization token missing" });
        }

        const token = authHeader.split(' ')[2];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(401).json({ message: "Invalid or expired token" });
            }

            req.user = user; 
            next();
        });

    } catch (err) {
        console.error("Token verification error:", err.message);
        return res.status(401).json({ message: "Unauthorized Access" });
    }
};

module.exports = tokenVerification;
