const mongoose = require('mongoose');

// Define the schema for the storage item.
const StorageSchema = new mongoose.Schema({
    // Primary fields, often used together as a unique key
    app: { type: String, required: true, index: true },
    collectionName: { type: String, required: true, index: true },
    collectionKey: { type: String, required: true, index: true },
    key: { type: String, required: true, index: true },

    // The value stored, allowing any type
    value: { type: mongoose.Schema.Types.Mixed, required: true },

    // Can be ['all', 'self', 'id'] 
    getAccess: { type: [String], required: true, default: ['all'] },
    setAccess: { type: [String], required: true, default: ['self'] },
    removeAccess: { type: [String], required: true, default: ['self'] },
    
}, {
    timestamps: true,
    // Ensure the combination of app, collectionName, collectionKey and key is unique
    // This is crucial for update it setItem
    indexes: [{ unique: true, fields: ['app', 'collectionName', 'collectionKey', 'key'] }]
});

StorageSchema.pre('save', async (next) => {
    //Encrypt data here
    //this.isModified('schema');
});


// Export the Mongoose model
module.exports = mongoose.model('Storage', StorageSchema);
