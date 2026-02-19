const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    // Gamification fields
    experiencePoints: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    badges: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

// Built-in Mongoose middleware to hash password before saving
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', UserSchema);