const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        default: 'General'
    },
    goalFrequency: {
        type: Number,
        default: 1,
        min: 1
    },
    targetDays: {
        type: [Number], // 0 (Sun) to 6 (Sat)
        default: [0, 1, 2, 3, 4, 5, 6]
    },
    completedToday: {
        type: Number,
        default: 0
    },
    lastResetDate: {
        type: String, // stored as 'YYYY-MM-DD'
        default: null
    },
    streak: {
        type: Number,
        default: 0
    },
    lastCompleted: {
        type: Date,
        default: null
    },
    // Historical data — one entry per increment
    logs: [{
        date: { type: Date, default: Date.now },
        status: { type: String, default: 'completed' }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Habit', HabitSchema);