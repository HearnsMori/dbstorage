const User = require('../models/User');
const Role = require('../models/User');

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
====================== */

exports.getSelfAll = async (req, res) => {
    const user = await User.findOne({ id: req.user.id }).select('-password');
    res.json(user);
};

exports.getSelfId = async (req, res) => {
    res.json({ id: req.user.id });
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
    const user = await User.findOne({ id:  req.user.id }).select('contact');
    res.json(user.contact);
};

/* ======================
   SELF — UPDATE
====================== */

exports.setSelfAll = async (req, res) => {
    const user = await User.findOne({ id:  req.user.id });
    Object.assign(user, req.body);
    await user.save();
    res.json({ success: true });
};

exports.setSelfId = async (req, res) => {
    await User.updateOne({ id:  req.user.id }, { id: req.body.id });
    res.json({ success: true });
};

exports.setSelfPassword = async (req, res) => {
    const user = await User.findOne({ id:  req.user.id });
    user.password = req.body.password;
    await user.save();
    res.json({ success: true });
};

exports.pushSelfRole = async (req, res) => {

    await User.updateOne(
        { id:  req.user.id },
        { $addToSet: { role: req.body.role } }
    );
    res.json({ success: true });
};

exports.pushSelfContact = async (req, res) => {
    await User.updateOne(
        { id:  req.user.id },
        { $push: { contact: req.body } }
    );
    res.json({ success: true });
};

/* ======================
   SELF — DELETE
====================== */

exports.removeSelfAll = async (req, res) => {
    await User.deleteOne({ id:  req.user.id });
    res.json({ success: true });
};

exports.removeSelfId = (_, res) => {
    res.status(400).json({ error: 'Cannot remove id only' });
};

exports.removeSelfPassword = async (req, res) => {
    await User.updateOne(
        { id:  req.user.id },
        { $unset: { password: "" } }
    );
    res.json({ success: true });
};

exports.popSelfRole = async (req, res) => {
    await User.updateOne(
        { id:  req.user.id },
        { $pull: { role: req.body.role } }
    );
    res.json({ success: true });
};

exports.popSelfContact = async (req, res) => {
    await User.updateOne(
        { id:  req.user.id },
        { $pull: { contact: { name: req.body.name } } }
    );
    res.json({ success: true });
};

/* ======================
   OTHER — READ
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
====================== */

exports.setOtherAll = async (req, res) => {
    const user = await User.findOne({ id: req.body.id });
    Object.assign(user, req.body);
    await user.save();
    res.json({ success: true });
};

exports.setOtherId = async (req, res) => {
    await User.updateOne(
        { id: req.body.id },
        { id: req.body.newId }
    );
    res.json({ success: true });
};

exports.setOtherPassword = async (req, res) => {
    if (!requireOtherPassword(req, res)) return;

    const user = await User.findOne({ id: req.body.id });
    user.password = req.body.newPassword;
    await user.save();
    res.json({ success: true });
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
    if (!requireOtherPassword(req, res)) return;

    await User.updateOne(
        { id: req.body.id },
        { $push: { contact: req.body.contact } }
    );
    res.json({ success: true });
};

/* ======================
   OTHER — DELETE
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
    if (!requireOtherPassword(req, res)) return;

    await User.updateOne(
        { id: req.body.id },
        { $pull: { contact: { name: req.body.name } } }
    );
    res.json({ success: true });
};
