const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ContactSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  userPasswordHash: { type: String, required: true, unique: true },
  mfa: { type: Boolean, required: true },
  links: { type: [String], default: [] },
  userRole: { type: [String], default: [] },
  userData: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true,
  },
  status: { type: String, enum: ["active", "deleted", "deactivated", "offline"] },
  lastLogin: { type: mongoose.Schema.Types.Mixed },
  publicKey: { type: String },
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('userPasswordHash')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.userPasswordHash = await bcrypt.hash(this.userPasswordHash, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', UserSchema);
