const mongoose = require('mongoose');

const ProcessSchema = new mongoose.Schema(
  {
    processId: { type: String, required: true, unique: true, index: true },
    getAccess: { type: [String], default: [] },
    setAccess: { type: [String], default: [] },
    removeAccess: { type: [String], default: [] },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Process', ProcessSchema);
