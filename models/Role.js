const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const RoleSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

RoleSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('Role', RoleSchema);
