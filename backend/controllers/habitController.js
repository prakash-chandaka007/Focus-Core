const Habit = require('../models/Habit');

// Helper: today's date as 'YYYY-MM-DD'
const todayStr = () => new Date().toISOString().split('T')[0];

// Helper: check if two dates are on consecutive calendar days
const isConsecutiveDay = (dateA, dateB) => {
    const a = new Date(dateA);
    const b = new Date(dateB);
    a.setHours(0, 0, 0, 0);
    b.setHours(0, 0, 0, 0);
    const diffMs = Math.abs(a - b);
    return diffMs === 86400000; // exactly 1 day apart
};

// @desc  Create a new habit
// @route POST /api/habits
// @access Private
exports.createHabit = async (req, res) => {
    try {
        const { name, category, goalFrequency, targetDays } = req.body;
        if (!name) return res.status(400).json({ msg: 'Habit name is required' });

        // Ensure targetDays is a valid array of integers between 0 and 6
        let validTargetDays = [0, 1, 2, 3, 4, 5, 6];
        if (Array.isArray(targetDays) && targetDays.length > 0) {
            validTargetDays = targetDays.filter(d => Number.isInteger(d) && d >= 0 && d <= 6);
            if (validTargetDays.length === 0) validTargetDays = [0, 1, 2, 3, 4, 5, 6];
        }

        const newHabit = new Habit({
            user: req.user.id,
            name,
            category: category || 'General',
            goalFrequency: goalFrequency || 1,
            targetDays: validTargetDays,
            lastResetDate: todayStr()
        });
        const habit = await newHabit.save();
        res.status(201).json(habit);
    } catch (err) {
        console.error('createHabit error:', err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc  Get all habits for logged-in user
// @route GET /api/habits
// @access Private
exports.getHabits = async (req, res) => {
    try {
        let habits = await Habit.find({ user: req.user.id }).sort({ createdAt: -1 });

        // Daily reset check: if any habit was last reset on a previous day, reset its completedToday
        const today = todayStr();
        const resetPromises = habits.map(async (habit) => {
            if (habit.lastResetDate !== today) {
                habit.completedToday = 0;
                habit.lastResetDate = today;
                return habit.save();
            }
            return habit;
        });
        habits = await Promise.all(resetPromises);

        res.json(habits);
    } catch (err) {
        console.error('getHabits error:', err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc  Increment habit progress for today + update streak
// @route PUT /api/habits/increment/:id
// @access Private
exports.incrementProgress = async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);
        if (!habit) return res.status(404).json({ msg: 'Habit not found' });
        if (habit.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const today = todayStr();

        // Daily reset if needed
        if (habit.lastResetDate !== today) {
            // Streak break check: if last completed was NOT yesterday, reset streak to 0
            if (habit.lastCompleted) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                if (!isConsecutiveDay(habit.lastCompleted, new Date())) {
                    habit.streak = 0;
                }
            }
            habit.completedToday = 0;
            habit.lastResetDate = today;
        }

        // Verify that today is actually an active target day
        const currentDayIndex = new Date().getDay();
        const activeDays = habit.targetDays || [0, 1, 2, 3, 4, 5, 6];
        if (!activeDays.includes(currentDayIndex)) {
            return res.status(400).json({ msg: 'Habit is not scheduled for today' });
        }

        // Only allow incrementing up to goalFrequency
        if (habit.completedToday >= habit.goalFrequency) {
            return res.status(400).json({ msg: 'Daily limit already reached' });
        }

        habit.completedToday += 1;
        habit.lastCompleted = new Date();

        // Streak update: if this increment hits the daily goal, count it as a streak day
        if (habit.completedToday === habit.goalFrequency) {
            habit.streak += 1;
        }

        // Append to log
        habit.logs.push({ date: new Date(), status: 'completed' });

        await habit.save();
        res.json(habit);
    } catch (err) {
        console.error('incrementProgress error:', err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc  Delete a habit
// @route DELETE /api/habits/:id
// @access Private
exports.deleteHabit = async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);
        if (!habit) return res.status(404).json({ msg: 'Habit not found' });
        if (habit.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await habit.deleteOne();
        res.json({ msg: 'Habit removed' });
    } catch (err) {
        console.error('deleteHabit error:', err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};