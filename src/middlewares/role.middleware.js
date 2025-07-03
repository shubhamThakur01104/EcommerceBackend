const jwt = require("jsonwebtoken");

const checkRole = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token not found or invalid format" });
    }
    const token = authHeader.split(" ")[2]
    // console.log("token", token);


    try {
        jwt.verify(token, process.env.JWT_SECRET, (er, user) => {
            if (er) {
                return { status: 404, message: er.message }
            }
            if (!user.isAdmin) {
                return res.status(403).json({ message: "Unauthorized Access while verfiying Admin Access" });
            }
        });
        next();
    }

    catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

module.exports = checkRole