const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "ACCESS_SECRET_KEY";

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

/* ======================
   SHARED PASSWORD GUARD
====================== */

const OTHER_PASSWORD = process.env.CLEAR_ALL_KEY;

const requireOtherPassword = (req, res) => {
    if (req.body?.password !== OTHER_PASSWORD) {
        res.status(401).json({ error: 'Invalid password' });
        return false;
    }
    return true;
};

/* ======================
   SELF — READ
   Doesn't Need Payload
   Complete
====================== */

exports.getSelfAll = async (req, res) => {
    const user = await User.findOne({ id: req.user.id }).select('-password');
    res.json(user);
};

exports.getSelfId = async (req, res) => {
    res.json(req.user.id);
};

exports.getSelfPassword = async (req, res) => {
    const user = await User.findOne({ id: req.user.id }).select('password');
    res.json(user.password);
};

exports.getSelfRole = async (req, res) => {
    const user = await User.findOne({ id: req.user.id }).select('role');
    res.json(user.role);
};

exports.getSelfContact = async (req, res) => {
    const user = await User.findOne({ id: req.user.id }).select('contact');
    res.json(user.contact);
};

/* ======================
    SELF — UPDATE
    Need Model Key = Body Key
    Complete
====================== */

exports.setSelfAll = async (req, res) => {
    const user = await User.findOne({ id: req.user.id });
    Object.assign(user, req.body);
    await user.save();
    res.json({ success: true });
};

exports.setSelfId = async (req, res) => {
    const user = await User.findOne({ id: req.body.id });
    if(user) {
        res.status(400).json({ error: `User with value ${req.body.id} already exist.`});
    }

    await User.updateOne({ id: req.user.id }, { id: req.body.id });
    // Generate both tokens
    const { accessToken, refreshToken } = generateTokens(user);
    res.json({ success: true, accessToken, refreshToken, id: req.body.id });
};

exports.setSelfPassword = async (req, res) => {
    const user = await User.findOne({ id: req.user.id });
    user.password = req.body.password;
    await user.save();
    res.json({ success: true });
};

exports.pushSelfRole = async (req, res) => {
    await User.updateOne(
        { id: req.user.id },
        { $addToSet: { role: req.body.role } }
    );
    res.json({ success: true });
};

exports.pushSelfContact = async (req, res) => {
    await User.updateOne(
        { id: req.user.id },
        { $addToSet: { contact: req.body.contact } }
    );
    res.json({ success: true });
};

/* ======================
    SELF — DELETE
    Need Model Key = Body Key
    Complete
====================== */

exports.removeSelfAll = async (req, res) => {
    await User.deleteOne({ id: req.user.id });
    res.json({ success: true });
};

exports.removeSelfId = (req, res) => {
    res.status(400).json({ error: 'Cannot remove id only' });
};

exports.removeSelfPassword = async (req, res) => {
    res.status(400).json({ error: 'Cannot remove password only' });
};

exports.popSelfRole = async (req, res) => {
    await User.updateOne(
        { id: req.user.id },
        { $pull: { role: req.body.role } }
    );
    res.json({ success: true });
};

exports.popSelfContact = async (req, res) => {
    await User.updateOne(
        { id: req.user.id },
        { $pull: { contact: { name: req.body.name } } }
    );
    res.json({ success: true });
};

/* ======================
   OTHER — READ
   Same with Self but with ID
====================== */

exports.getOtherAll = async (req, res) => {
    const user = await User.findOne({ id: req.body.id }).select('-password');
    res.json(user);
};

exports.getOtherId = (req, res) => {
    res.json({ id: req.body.id });
};

exports.getOtherPassword = async (req, res) => {
    if (!requireOtherPassword(req, res)) return;

    const user = await User.findOne({ id: req.body.id }).select('password');
    res.json(user.password);
};

exports.getOtherRole = async (req, res) => {
    if (!requireOtherPassword(req, res)) return;

    const user = await User.findOne({ id: req.body.id }).select('role');
    res.json(user.role);
};

exports.getOtherContact = async (req, res) => {
    if (!requireOtherPassword(req, res)) return;

    const user = await User.findOne({ id: req.body.id }).select('contact');
    res.json(user.contact);
};

/* ======================
   OTHER — UPDATE
   Same with Self but with ID
====================== */

exports.setOtherAll = async (req, res) => {
    res.status(400).json({ error: 'Cannot set other auth info' });
};

exports.setOtherId = async (req, res) => {
    res.status(400).json({ error: 'Cannot set other auth info' });
};

exports.setOtherPassword = async (req, res) => {
    res.status(400).json({ error: 'Cannot set other auth info' });
};

exports.pushOtherRole = async (req, res) => {
    if (!requireOtherPassword(req, res)) return;

    await User.updateOne(
        { id: req.body.id },
        { $addToSet: { role: req.body.role } }
    );
    res.json({ success: true });
};

exports.pushOtherContact = async (req, res) => {
    res.status(400).json({ error: 'Cannot set other auth info' });
};

/* ======================
   OTHER — DELETE
   Same with Self but with ID
====================== */

exports.removeOtherAll = async (req, res) => {
    await User.deleteOne({ id: req.body.id });
    res.json({ success: true });
};

exports.removeOtherId = (_, res) => {
    res.status(400).json({ error: 'Cannot remove id only' });
};

exports.removeOtherPassword = async (req, res) => {
    if (!requireOtherPassword(req, res)) return;

    await User.updateOne(
        { id: req.body.id },
        { $unset: { password: "" } }
    );
    res.json({ success: true });
};

exports.popOtherRole = async (req, res) => {
    if (!requireOtherPassword(req, res)) return;

    await User.updateOne(
        { id: req.body.id },
        { $pull: { role: req.body.role } }
    );
    res.json({ success: true });
};

exports.popOtherContact = async (req, res) => {
    res.status(400).json({ error: 'Cannot set other auth info' });
};
