const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/authMiddleware');

// @route   GET /api/analytics
// @desc    Get weekly analytics data + sync level
// @access  Private
router.get('/', auth, analyticsController.getAnalytics);

module.exports = router;
