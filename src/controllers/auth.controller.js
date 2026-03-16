const User = require('../models/user.model')
const tokenBlacklist = require('../utils/tokenblacklist');
const jwt = require('jsonwebtoken');

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
};

const signUp = async (req, res) => {
    try {
        const { name, email, password, isAdmin = false } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email is already registered." });
        }


        const user = await User.create({ name, email, password, isAdmin });

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('accessToken', accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000
        });
        res.cookie('refreshToken', refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            },
            accessToken,
            refreshToken,
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

        const accessToken = userExist.generateAccessToken();
        const refreshToken = userExist.generateRefreshToken();
        userExist.accessToken = accessToken;
        userExist.refreshToken = refreshToken;
        await userExist.save();

        res.cookie('accessToken', accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000
        });
        res.cookie('refreshToken', refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "User login successful",
            user: {
                id: userExist._id,
                name: userExist.name,
                email: userExist.email,
                isAdmin: userExist.isAdmin
            },
            accessToken,
            refreshToken,
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


const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token is required" });
        }

        // verify refresh token
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid or expired refresh token" });
            }

            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            if (!user.refreshToken || user.refreshToken !== refreshToken) {
                return res.status(401).json({ message: "Refresh token does not match or is revoked" });
            }

            const newAccessToken = user.generateAccessToken();
            const newRefreshToken = user.generateRefreshToken();
            user.accessToken = newAccessToken;
            user.refreshToken = newRefreshToken;
            await user.save();

            res.cookie('accessToken', newAccessToken, {
                ...cookieOptions,
                maxAge: 15 * 60 * 1000
            });
            res.cookie('refreshToken', newRefreshToken, {
                ...cookieOptions,
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return res.status(200).json({
                message: "Tokens refreshed successfully",
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            });
        });
    } catch (err) {
        console.error("Refresh token error:", err.message);
        return res.status(500).json({ message: "Server error" });
    }
};

const logout = (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Authorization token missing" });
        }

        const token = authHeader.split(' ')[1];
        tokenBlacklist.add(token);
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

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
    refreshToken,
    logout
}