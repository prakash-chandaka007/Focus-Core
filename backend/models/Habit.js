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
    description: {
        type: String
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly'],
        default: 'daily'
    },
    streak: {
        type: Number,
        default: 0
    },
    lastCompleted: {
        type: Date
    },
    // Historical data for Recharts/Chart.js
    logs: [{
        date: { type: Date, default: Date.now },
        status: { type: String, default: 'completed' }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Habit', HabitSchema);