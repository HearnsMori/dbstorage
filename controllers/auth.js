// to signup, login, or refreshtoken
// to do in future: to login through forgetpassword

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "ACCESS_SECRET_KEY";


const REFRESH_SECRET = process.env.REFRESH_SECRET || "REFRESH_SECRET_KEY";

// =====================
// GENERATE TOKENS
// =====================
function generateTokens(user) {
    const accessToken = jwt.sign(
        { userId: user._id, id: user.id },
        JWT_SECRET,
        { expiresIn: "15m" }  // short lifespan (recommended)
    );

    const refreshToken = jwt.sign(
        { userId: user._id, id: user.id },
        REFRESH_SECRET,
        { expiresIn: "7d" }   // long lifespan
    );

    return { accessToken, refreshToken };
}


// =====================
// SIGNUP
// =====================
exports.signup = async (req, res) => {
    try {
        const { id, password, role, contact } = req.body;

        // Check if already exists
        const exists = await User.findOne({ id });
        if (exists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = new User({ id, password, role, contact });
        await user.save();

        return res.status(201).json({
            message: "Signup successful",
            user: { id: user.id }
        });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ message: `Signup failed: ${error}`, error });
    }
};


// =====================
// SIGNIN
// =====================
exports.signin = async (req, res) => {
    try {
        const { id, password } = req.body;

        const user = await User.findOne({ id });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Invalid credentials" });

        // Generate both tokens
        const { accessToken, refreshToken } = generateTokens(user);

        return res.status(200).json({
            message: "Signin successful",
            accessToken,
            refreshToken,
            user: { id: user.id }
        });

    } catch (error) {
        console.error("Signin error:", error);
        return res.status(500).json({ message: "Signin failed", error });
    }
};


// =====================
// REFRESH TOKEN
// =====================
exports.refreshToken = async (req, res) => {
    const { token } = req.body;

    if (!token) return res.status(400).json({ message: "Refresh token missing" });

    try {
        const payload = jwt.verify(token, REFRESH_SECRET);

        // Fetch the user again if needed
        const user = await User.findById(payload.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const { accessToken, refreshToken } = generateTokens(user);

        return res.status(200).json({
            message: "Token refreshed",
            accessToken,
            refreshToken
        });

    } catch (error) {
        console.error("Refresh token error:", error);
        return res.status(401).json({ message: "Invalid refresh token" });
    }
};

//////////////////////// Not yet implemented!
// =====================
// FORGOT ACCOUNT
// =====================
exports.forgotAccount = async (req, res) => {
    try {
        const { id, password } = req.body;

        const user = await User.findOne({ id });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Invalid credentials" });

        // Generate both tokens
        const { accessToken, refreshToken } = generateTokens(user);

        return res.status(200).json({
            message: "Signin successful",
            accessToken,
            refreshToken,
            user: { id: user.id }
        });

    } catch (error) {
        console.error("Signin error:", error);
        return res.status(500).json({ message: "Signin failed", error });
    }
};
