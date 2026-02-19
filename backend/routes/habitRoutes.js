const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habitController');
const auth = require('../middleware/authMiddleware');

// @route   POST api/habits
// @desc    Create a habit
// @access  Private
router.post('/', auth, habitController.createHabit);

// @route   GET api/habits
// @desc    Get all user habits
// @access  Private
router.get('/', auth, habitController.getHabits);

// @route   PUT api/habits/complete/:id
// @desc    Mark habit as done (You'll need to add this method to your controller)
// router.put('/complete/:id', auth, habitController.completeHabit);

module.exports = router;