const mongoose = require('mongoose');

const StorageSchema = new mongoose.Schema(
  {
    app: { type: String, required: true, index: true },
    collectionName: { type: String, required: true, index: true },
    collectionKey: { type: String, required: true, index: true },
    key: { type: String, required: true, index: true },

    value: { type: mongoose.Schema.Types.Mixed, required: true },

    getAccess: { type: [String], default: ['#all'] },
    //For set and remove access was set by default into self in controller
    setAccess: { type: [String], default: [] },
    removeAccess: { type: [String], default: [] },
  },
  { timestamps: true }
);

StorageSchema.index(
  { app: 1, collectionName: 1, collectionKey: 1, key: 1 },
  { unique: true }
);

module.exports = mongoose.model('Storage', StorageSchema);
