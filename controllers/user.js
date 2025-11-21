// to read/update id, password
// to read/add contact, access
// to remove contact, access
// to delete account
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// =====================
// READ USER DATA (GENERAL)
// Requires: JWT authentication middleware
// =====================
exports.readUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        // Use .select('-password') to exclude the sensitive password hash
        const user = await User.findById(userId).select('-password'); 
        
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({ user });
    } catch (error) {
        console.error("Read user error:", error);
        return res.status(500).json({ message: "Failed to read user data", error });
    }
};

// =====================
// READ USER ID
// =====================
exports.readId = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select('id');
        
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({ id: user.id });
    } catch (error) {
        console.error("Read ID error:", error);
        return res.status(500).json({ message: "Failed to read ID", error });
    }
};

// =====================
// READ USER CONTACTS
// =====================
exports.readContact = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select('contact');
        
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({ contact: user.contact });
    } catch (error) {
        console.error("Read contact error:", error);
        return res.status(500).json({ message: "Failed to read contacts", error });
    }
};

// =====================
// READ USER ACCESS
// =====================
exports.readAccess = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select('access');
        
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({ access: user.access });
    } catch (error) {
        console.error("Read access error:", error);
        return res.status(500).json({ message: "Failed to read access rules", error });
    }
};

// =====================
// UPDATE USER ID (Existing logic preserved)
// =====================
exports.updateId = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { newId } = req.body;

        if (!newId || newId.trim() === "") {
            return res.status(400).json({ message: "New ID is required" });
        }

        const exists = await User.findOne({ id: newId });
        if (exists) {
            return res.status(400).json({ message: "ID already taken" });
        }

        await User.findByIdAndUpdate(userId, { id: newId });
        return res.status(200).json({ message: "ID updated successfully" });
    } catch (error) {
        console.error("Update ID error:", error);
        return res.status(500).json({ message: "Failed to update ID", error });
    }
};

// =====================
// UPDATE PASSWORD (Existing logic preserved)
// =====================
exports.updatePassword = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { newPassword } = req.body;

        if (!newPassword || newPassword.trim() === "") {
            return res.status(400).json({ message: "New password required" });
        }

        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        // Security check before allowing password change
        const hasId = user.id && user.id.trim() !== "";
        const hasContact = user.contact && user.contact.length > 0;

        if (!hasId && !hasContact) {
            return res.status(403).json({
                message: "Cannot change password. User must have at least 1 linked ID or contact."
            });
        }

        // Hash new password manually
        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        await user.save(); 

        return res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        console.error("Update password error:", error);
        return res.status(500).json({ message: "Failed to update password", error });
    }
};

// =====================
// ADD CONTACT (Array Push)
// =====================
exports.addContact = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, value } = req.body; // Expects { name: String, value: Mixed }

        if (!name || !value) {
            return res.status(400).json({ message: "Contact name and value are required" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { contact: { name, value } } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        
        return res.status(200).json({ 
            message: "Contact added successfully",
            contact: updatedUser.contact 
        });
    } catch (error) {
        console.error("Add contact error:", error);
        return res.status(500).json({ message: "Failed to add contact", error });
    }
};

// =====================
// REMOVE CONTACT (Array Pull)
// =====================
exports.removeContact = async (req, res) => {
    try {
        const userId = req.user.userId;
        // Allows removal by either name, value, or both
        const { name, value } = req.body; 

        if (!name && !value) {
            return res.status(400).json({ message: "Either contact name or value is required for removal criteria" });
        }

        const criteria = {};
        if (name) criteria.name = name;
        if (value) criteria.value = value;
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { contact: criteria } }, // Removes all entries matching the criteria
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({ 
            message: "Contact(s) removed successfully",
            contact: updatedUser.contact 
        });
    } catch (error) {
        console.error("Remove contact error:", error);
        return res.status(500).json({ message: "Failed to remove contact", error });
    }
};

// =====================
// ADD ACCESS (Array Push)
// =====================
exports.addAccess = async (req, res) => {
    try {
        const userId = req.user.userId;
        // Expects the access array structure: [app, collectionName, key, [method, ...]]
        const { accessEntry } = req.body; 

        // Basic validation for array structure
        if (!Array.isArray(accessEntry) || accessEntry.length !== 4 || !Array.isArray(accessEntry[3])) {
             return res.status(400).json({ message: "Invalid access entry format. Expected [app, collectionName, key, [methods...]]" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { access: accessEntry } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({ 
            message: "Access rule added successfully",
            access: updatedUser.access 
        });
    } catch (error) {
        console.error("Add access error:", error);
        return res.status(500).json({ message: "Failed to add access rule", error });
    }
};

// =====================
// REMOVE ACCESS (Array Pull)
// =====================
exports.removeAccess = async (req, res) => {
    try {
        const userId = req.user.userId;
        // The client must send the exact access entry they want to remove.
        const { accessEntry } = req.body; 

        if (!Array.isArray(accessEntry) || accessEntry.length !== 4) {
             return res.status(400).json({ message: "Invalid access entry format for removal. Expected [app, collectionName, key, [methods...]]" });
        }
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            // $pull removes any entry that exactly matches accessEntry
            { $pull: { access: accessEntry } }, 
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({ 
            message: "Access rule(s) removed successfully",
            access: updatedUser.access 
        });
    } catch (error) {
        console.error("Remove access error:", error);
        return res.status(500).json({ message: "Failed to remove access rule", error });
    }
};

// =====================
// DELETE ACCOUNT (Existing logic preserved)
// =====================
exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.userId;

        const deletedUser = await User.findByIdAndDelete(userId);
        
        if (!deletedUser) {
             return res.status(404).json({ message: "User not found or already deleted." });
        }

        return res.status(200).json({ message: "Account deleted successfully" });

    } catch (error) {
        console.error("Delete account error:", error);
        return res.status(500).json({ message: "Failed to delete account", error });
    }
};