const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');
const User = require('../models/User'); // Added missing import

// Public routes
router.post('/register', register);
router.post('/login', login);

// Example of a Protected route (returns user data)
router.get('/user', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error("Auth User Fetch Error:", err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
});

module.exports = router;