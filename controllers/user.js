const User = require('../models/User');

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

exports.getSelfAll = async (req, res) => {
    try {
        const selfId = req.user.userId;
        const user = await User.findById(selfId);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Read user error:", error);
        return res.status(500).json({ message: "User route failed: ", error });
    }
};

exports.getSelfId = async (req, res) => {
    try {
        const selfId = req.user.userId;
        const user = await User.findById(selfId);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Read user error:", error);
        return res.status(500).json({ message: "User route failed: ", error });
    }
};

exports.getSelfPassword = async (req, res) => {
    try {
        const selfId = req.user.userId;
        const user = await User.findById(selfId);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Read user error:", error);
        return res.status(500).json({ message: "User route failed: ", error });
    }
};

exports.getSelfRole = async (req, res) => {
    try {
        const selfId = req.user.userId;
        const user = await User.findById(selfId);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Read user error:", error);
        return res.status(500).json({ message: "User route failed: ", error });
    }
};

exports.getSelfContact = async (req, res) => {
    try {
        const selfId = req.user.userId;
        const user = await User.findById(selfId);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Read user error:", error);
        return res.status(500).json({ message: "User route failed: ", error });
    }
};

exports.setSelfAll = async (req, res) => {
    try {
        const selfId = req.user.userId;
        const user = await User.findById(selfId);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Read user error:", error);
        return res.status(500).json({ message: "User route failed: ", error });
    }
};

exports.setSelfId = async (req, res) => {
    try {
        const selfId = req.user.userId;
        const user = await User.findById(selfId);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Read user error:", error);
        return res.status(500).json({ message: "User route failed: ", error });
    }
};

exports.setSelfPassword = async (req, res) => {
    try {
        const selfId = req.user.userId;
        const user = await User.findById(selfId);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Read user error:", error);
        return res.status(500).json({ message: "User route failed: ", error });
    }
};

exports.pushSelfRole = async (req, res) => {
    try {
        const selfId = req.user.userId;
        const user = await User.findById(selfId);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Read user error:", error);
        return res.status(500).json({ message: "User route failed: ", error });
    }
};

exports.pushSelfContact = async (req, res) => {
    try {
        const selfId = req.user.userId;
        const user = await User.findById(selfId);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Read user error:", error);
        return res.status(500).json({ message: "User route failed: ", error });
    }
};

exports.removeSelfAll = async (req, res) => {
    try {
        const selfId = req.user.userId;
        const user = await User.findById(selfId);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Read user error:", error);
        return res.status(500).json({ message: "User route failed: ", error });
    }
};

exports.removeSelfId = async (req, res) => {
    try {
        const selfId = req.user.userId;
        const user = await User.findById(selfId);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Read user error:", error);
        return res.status(500).json({ message: "User route failed: ", error });
    }
};

exports.removeSelfPassword = async (req, res) => {
    try {
        const selfId = req.user.userId;
        const user = await User.findById(selfId);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Read user error:", error);
        return res.status(500).json({ message: "User route failed: ", error });
    }
};

exports.popSelfRole = async (req, res) => {
    try {
        const selfId = req.user.userId;
        const user = await User.findById(selfId);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Read user error:", error);
        return res.status(500).json({ message: "User route failed: ", error });
    }
};

exports.popSelfContact = async (req, res) => {
    try {
        const selfId = req.user.userId;
        const user = await User.findById(selfId);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Read user error:", error);
        return res.status(500).json({ message: "User route failed: ", error });
    }
};

exports.getOtherAll = async (req, res) => {
    try {
        const selfId = req.user.userId;
        const user = await User.findById(selfId);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Read user error:", error);
        return res.status(500).json({ message: "User route failed: ", error });
    }
};

exports.getOtherId = async (req, res) => {
    try {
        const selfId = req.user.userId;
        const user = await User.findById(selfId);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Read user error:", error);
        return res.status(500).json({ message: "User route failed: ", error });
    }
};

exports.getOtherPassword = async (req, res) => {
    try {
        const selfId = req.user.userId;
        const user = await User.findById(selfId);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Read user error:", error);
        return res.status(500).json({ message: "User route failed: ", error });
    }
};

exports.getOtherRole = async (req, res) => {
    try {
        const selfId = req.user.userId;
        const user = await User.findById(selfId);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Read user error:", error);
        return res.status(500).json({ message: "User route failed: ", error });
    }
};

exports.getOtherContact = async (req, res) => {
    try {
        const selfId = req.user.userId;
        const user = await User.findById(selfId);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Read user error:", error);
        return res.status(500).json({ message: "User route failed: ", error });
    }
};

exports.setOtherAll = async (req, res) => {
    try {
        const selfId = req.user.userId;
        const user = await User.findById(selfId);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Read user error:", error);
        return res.status(500).json({ message: "User route failed: ", error });
    }
};

exports.setOtherId = async (req, res) => {
    try {
        const selfId = req.user.userId;
        const user = await User.findById(selfId);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Read user error:", error);
        return res.status(500).json({ message: "User route failed: ", error });
    }
};

exports.setOtherPassword = async (req, res) => {
    try {
        const selfId = req.user.userId;
        const user = await User.findById(selfId);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Read user error:", error);
        return res.status(500).json({ message: "User route failed: ", error });
    }
};

exports.pushOtherRole = async (req, res) => {
    try {
        const selfId = req.user.userId;
        const user = await User.findById(selfId);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Read user error:", error);
        return res.status(500).json({ message: "User route failed: ", error });
    }
};

exports.pushOtherContact = async (req, res) => {
    try {
        const selfId = req.user.userId;
        const user = await User.findById(selfId);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Read user error:", error);
        return res.status(500).json({ message: "User route failed: ", error });
    }
};

exports.removeOtherAll = async (req, res) => {
    try {
        const selfId = req.user.userId;
        const user = await User.findById(selfId);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Read user error:", error);
        return res.status(500).json({ message: "User route failed: ", error });
    }
};

exports.removeOtherId = async (req, res) => {
    try {
        const selfId = req.user.userId;
        const user = await User.findById(selfId);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Read user error:", error);
        return res.status(500).json({ message: "User route failed: ", error });
    }
};

exports.removeOtherPassword = async (req, res) => {
    try {
        const selfId = req.user.userId;
        const user = await User.findById(selfId);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Read user error:", error);
        return res.status(500).json({ message: "User route failed: ", error });
    }
};

exports.popOtherRole = async (req, res) => {
    try {
        const selfId = req.user.userId;
        const user = await User.findById(selfId);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Read user error:", error);
        return res.status(500).json({ message: "User route failed: ", error });
    }
};

exports.popOtherContact = async (req, res) => {
    try {
        const selfId = req.user.userId;
        const user = await User.findById(selfId);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Read user error:", error);
        return res.status(500).json({ message: "User route failed: ", error });
    }
};
