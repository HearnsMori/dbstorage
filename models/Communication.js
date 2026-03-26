const mongoose = require('mongoose');

const CommunicationSchema = new mongoose.Schema(
  {
    communicationId: { type: String, required: true, unique: true, index: true },
    getAccess: { type: [String], default: [] },
    setAccess: { type: [String], default: [] },
    removeAccess: { type: [String], default: [] },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Communication', CommunicationSchema);
