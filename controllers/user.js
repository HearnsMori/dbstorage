const User = require('../models/User');
const bcrypt = require('bcryptjs');

// =====================
// UPDATE USER ID
// =====================
exports.updateId = async (req, res) => {
    try {
        const { newId } = req.body;
        const userId = req.user.userId;

        if (!newId) {
            return res.status(400).json({ message: "New ID is required" });
        }

        const exists = await User.findOne({ id: newId });
        if (exists) {
            return res.status(400).json({ message: "ID already taken" });
        }

        await User.findByIdAndUpdate(userId, { id: newId });
        return res.status(200).json({ message: "ID updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to update ID", error });
    }
};


// =====================
// UPDATE USER CONTACT
// =====================
exports.updateContact = async (req, res) => {
    try {
        const { contact } = req.body;
        const userId = req.user.userId;

        if (!contact) {
            return res.status(400).json({ message: "Contact is required" });
        }

        await User.findByIdAndUpdate(userId, { contact });
        return res.status(200).json({ message: "Contact updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to update contact", error });
    }
};


// =====================
// UPDATE USER ACCESS
// =====================
exports.updateAccess = async (req, res) => {
    try {
        const { access } = req.body;
        const userId = req.user.userId;

        if (!access) {
            return res.status(400).json({ message: "Access data required" });
        }

        await User.findByIdAndUpdate(userId, { access });
        return res.status(200).json({ message: "Access updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to update access", error });
    }
};


// =====================
// UPDATE PASSWORD
// MUST HAVE: at least 1 ID or 1 contact linked
// =====================
exports.updatePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const userId = req.user.userId;

        if (!newPassword) {
            return res.status(400).json({ message: "New password required" });
        }

        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        // Must have ID or Contact before changing password
        const hasId = user.id && user.id.trim() !== "";
        const hasContact = user.contact && user.contact.length > 0;

        if (!hasId && !hasContact) {
            return res.status(403).json({
                message: "Cannot change password. User must have at least 1 linked ID or contact."
            });
        }

        // Hash new password
        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        await user.save();

        return res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Failed to update password", error });
    }
};


// =====================
// DELETE ACCOUNT
// =====================
exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.userId;

        await User.findByIdAndDelete(userId);
        return res.status(200).json({ message: "Account deleted successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Failed to delete account", error });
    }
};
