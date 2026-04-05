const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// 1. Load Config early
dotenv.config();

// 2. Import Routes (Moved up for clarity)
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const habitRoutes = require('./routes/habitRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

// 3. Essential Middleware
app.use(express.json());
app.use(cors({ 
    origin: '*', 
    credentials: true,
    allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization']
}));

// Request Logger (Helpful for debugging)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// 4. Database Connection Logic
// Refactored to handle modern Mongoose connection patterns
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected Successfully to Compass");
    } catch (err) {
        console.error("❌ Database Connection Error:", err.message);
        process.exit(1); // Stop the server if DB fails
    }
};
connectDB();

// 5. Routes
app.get('/ping', (req, res) => res.json({ msg: 'Pong', time: new Date().toISOString() }));
app.get('/health', (req, res) => res.status(200).json({ status: 'UP' }));
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/analytics', analyticsRoutes);

// 6. Global Error Handling Middleware
// This catches any error thrown in your routes so the server doesn't crash
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/health`);
});