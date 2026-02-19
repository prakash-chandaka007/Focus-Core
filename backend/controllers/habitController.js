const Habit = require('../models/Habit');

// @desc Create a new habit
exports.createHabit = async (req, res) => {
    try {
        const { name, description, frequency } = req.body;
        const newHabit = new Habit({
            user: req.user.id, // Linked to the logged-in user
            name,
            description,
            frequency
        });
        const habit = await newHabit.save();
        res.json(habit);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// @desc Get all habits for logged-in user
exports.getHabits = async (req, res) => {
    try {
        const habits = await Habit.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(habits);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};