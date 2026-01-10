const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ContactSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: [String], default: [] },
  contact: { type: [ContactSchema], default: [] }
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('User', UserSchema);
