const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');
const Task = require('../models/Task');
const Habit = require('../models/Habit');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);

// Protected route (returns user data with dynamically calculated Gamification stats)
router.get('/user', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        // --- Calculate Dynamic Global Streak & Level ---
        const tasks = await Task.find({ user: req.user.id, status: 'completed' }).select('updatedAt');
        const habits = await Habit.find({ user: req.user.id }).select('logs');

        const activeDates = new Set();
        tasks.forEach(t => activeDates.add(t.updatedAt.toISOString().split('T')[0]));
        habits.forEach(h => {
            h.logs.forEach(l => activeDates.add(new Date(l.date).toISOString().split('T')[0]));
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let currentStreak = 0;
        let checkDate = new Date(today);
        let checkStr = checkDate.toISOString().split('T')[0];

        // If they were active today, count it and move to yesterday
        if (activeDates.has(checkStr)) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            // If not active today, check if they were active yesterday to keep streak alive
            checkDate.setDate(checkDate.getDate() - 1);
        }

        // Count consecutive days backward
        while (checkDate) {
            checkStr = checkDate.toISOString().split('T')[0];
            if (activeDates.has(checkStr)) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break; // streak broken
            }
        }

        // Calculate XP and dynamic Level Title
        const totalLogs = habits.reduce((acc, h) => acc + h.logs.length, 0);
        const totalXP = (tasks.length * 10) + (totalLogs * 15);
        
        let levelTitle = 'Novice';
        let nextLevelXP = 100;
        let currentLevelBaseXP = 0;

        if (totalXP >= 1000) {
            levelTitle = 'Master';
            nextLevelXP = 2500; 
            currentLevelBaseXP = 1000;
        } else if (totalXP >= 500) {
            levelTitle = 'Pro';
            nextLevelXP = 1000;
            currentLevelBaseXP = 500;
        } else if (totalXP >= 250) {
            levelTitle = 'Adept';
            nextLevelXP = 500;
            currentLevelBaseXP = 250;
        } else if (totalXP >= 100) {
            levelTitle = 'Initiate';
            nextLevelXP = 250;
            currentLevelBaseXP = 100;
        }

        const xpTowardNextLevel = totalXP - currentLevelBaseXP;
        const xpRequiredForLevel = nextLevelXP - currentLevelBaseXP;
        const progressPercentage = Math.min(Math.round((xpTowardNextLevel / xpRequiredForLevel) * 100), 100);

        // Override user object properties with analytics results
        const userObj = user.toObject();
        userObj.currentStreak = currentStreak;
        userObj.levelTitle = levelTitle;
        userObj.totalXP = totalXP;
        userObj.xpProgress = {
            current: xpTowardNextLevel,
            required: xpRequiredForLevel,
            percent: progressPercentage,
            nextThreshold: nextLevelXP
        };

        res.json(userObj);
    } catch (err) {
        console.error("Auth User Fetch Error:", err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
});

module.exports = router;