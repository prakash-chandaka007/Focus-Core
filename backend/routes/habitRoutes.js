const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habitController');
const auth = require('../middleware/authMiddleware');

// @route   POST /api/habits
// @desc    Create a habit
// @access  Private
router.post('/', auth, habitController.createHabit);

// @route   GET /api/habits
// @desc    Get all user habits (with daily reset check)
// @access  Private
router.get('/', auth, habitController.getHabits);

// @route   PUT /api/habits/increment/:id
// @desc    Increment today's habit progress + update streak
// @access  Private
router.put('/increment/:id', auth, habitController.incrementProgress);

// @route   DELETE /api/habits/:id
// @desc    Delete a habit
// @access  Private
router.delete('/:id', auth, habitController.deleteHabit);

module.exports = router;