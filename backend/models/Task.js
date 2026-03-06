const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    category: {
        type: String,
        default: 'General'
    },
    duration: {
        type: Number,
        default: 30
    },
    scheduledDate: {
        type: String, // 'YYYY-MM-DD'
        default: null
    },
    startTime: {
        type: String, // 'HH:mm'
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
