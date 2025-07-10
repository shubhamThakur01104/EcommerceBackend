const User = require('../models/user.model')

const signUp = async (req, res) => {
    try {
        const { name, email, password, isAdmin = false } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email is already registered." });
        }


        const user = await User.create({ name, email, password, isAdmin });

        const token = user.generateJWT();

        return res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            },
            token,
        });
    } catch (err) {

        return res.status(400).json({ message: "Validation Error", errors: err.errors });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            });

        }

        const userExist = await User.findOne({ email });
        if (!userExist) {
            return res.status(404).json({ message: "Invalid email or password." });
        }
        const isPasswordValid = await userExist.verifyPassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password." });
        }


        const token = userExist.generateJWT();

        return res.status(200).json({
            message: "User login successful",
            token,
        });

    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ message: "Server Error" });
        return res.status(400).json({
            message: "Validation Error",
            errors: err.errors
        });

    }
};

module.exports = {
    signUp,
    login
}