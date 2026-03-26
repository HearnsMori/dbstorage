const mongoose = require('mongoose');

const StorageSchema = new mongoose.Schema(
  {
    storageId: { type: String, required: true, index: true },
    platform: { type: String, required: true, index: true },
    organization: { type: String, required: true, index: true },
    company: { type: String, required: true, index: true },
    app: { type: String, required: true, index: true },
    collection: { type: String, required: true, index: true },
    document: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      required: true,
    },

    // Accessing
    getAccess: { type: [String], default: ['#all'] },
    // For set and remove access was set by default into self in controller
    setAccess: { type: [String], default: [] },
    removeAccess: { type: [String], default: [] },
  },
  { timestamps: true }
);

StorageSchema.index(
  { platform: 1, organization: 1, company: 1, app: 1, collection: 1, key: 1 },
  { unique: true }
);

module.exports = mongoose.model('Storage', StorageSchema);
