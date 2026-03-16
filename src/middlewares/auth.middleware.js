const jwt = require('jsonwebtoken');

const tokenVerification = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        let token = null;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else if (req.cookies && req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }

        if (!token) {
            return res.status(401).json({ message: "Authorization token missing" });
        }

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
