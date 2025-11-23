const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the schema for the storage item.
const UserSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contact: { type: [{ name: String, value: mongoose.Schema.Types.Mixed}] },
    access: { type: mongoose.Schema.Types.Mixed,} //app, collectionName, key, method
});

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

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
