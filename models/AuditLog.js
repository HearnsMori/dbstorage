const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema(
  {
    auditId: { type: String, required: true, unique: true, index: true },
    model: { type: String, enum: ['User', 'Storage', 'Role'], required: true },
    platform: { type: String },
    organization: { type: String },
    app: { type: String },
    collection: { type: String },
    storageId: { type: String },
    userId: { type: String },
    action: { type: String, required: true, enum: ['create', 'read', 'update', 'delete', 'login', 'logout', 'other'] },
    changedFields: { type: [String], default: [] },
    before: { type: mongoose.Schema.Types.Mixed },
    after: { type: mongoose.Schema.Types.Mixed },
    performedBy: { type: String },
    reason: { type: String },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AuditLog', AuditLogSchema);
