const User = require('../models/user.model')
const tokenBlacklist = require('../utils/tokenblacklist');

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
            return res.status(404).json({ message: "User is not found." });
        }
        const isPasswordValid = await userExist.verifyPassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const token = userExist.generateJWT();

        return res.status(200).json({
            message: "User login successful",
            user: userExist,
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

const updateProfile = async (req, res) => {
    try {
        console.log(req.user);

        const userId = req.user.id;
        const data = req.body;


        // Check if there's any data to update
        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({ message: "No data provided to update." });
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            data,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: updatedUser
        });
    } catch (error) {
        console.error("Update profile error:", error);
        return res.status(500).json({
            message: "An error occurred while updating the profile.",
            error: error.message
        });
    }
};


const logout = (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Authorization token missing" });
        }

        const token = authHeader.split(' ')[2];
        tokenBlacklist.add(token);

        return res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        console.error("Logout error:", err.message);
        return res.status(500).json({ message: "Server error during logout" });
    }
};


module.exports = {
    signUp,
    login,
    updateProfile,
    logout
}