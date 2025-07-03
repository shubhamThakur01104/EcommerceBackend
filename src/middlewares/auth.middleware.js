const jwt = require('jsonwebtoken');

const tokenVerification = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
     

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Authorization token missing" });
        }
    
        const token = authHeader.split(' ')[2];

        jwt.verify(token, process.env.JWT_SECRET,(er,user)=>{
            if(er){
                return {status:404,message:er.message}
            }
        });


        next();
    } catch (err) {
        console.error("Token verification error:", err.message);
        return res.status(401).json({ message: "Unauthorized Access" });
    }
};

module.exports = tokenVerification;
