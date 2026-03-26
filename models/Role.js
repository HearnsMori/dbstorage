const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  roleId: { type: String, required: true, unique: true },
  owner: { type: String, required: true},
  members: { type: [String], required: true },
  allowedToPushUser: { type: [String], default: [] },
  allowedToPopUser: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Role', RoleSchema);