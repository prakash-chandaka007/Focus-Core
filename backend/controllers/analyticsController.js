const Task = require('../models/Task');
const Habit = require('../models/Habit');

// Helper: get date string 'YYYY-MM-DD' for N days ago
const daysAgoStr = (n) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split('T')[0];
};

// Helper: day label (Mon, Tue, …)
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// @desc  Get analytics data for the logged-in user
// @route GET /api/analytics
// @access Private
exports.getAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;

        // ── 1. Build the 7-day window ──────────────────────────────────────
        const days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i)); // oldest first
            d.setHours(0, 0, 0, 0);
            return d;
        });

        // ── 2. Fetch tasks in the last 7 days ─────────────────────────────
        const sevenDaysAgo = new Date(days[0]);
        const allTasks = await Task.find({
            user: userId,
            createdAt: { $gte: sevenDaysAgo }
        });

        // ── 3. Build weeklyTaskData ────────────────────────────────────────
        const weeklyTaskData = days.map((day) => {
            const dayStr = day.toISOString().split('T')[0];
            const nextDay = new Date(day);
            nextDay.setDate(nextDay.getDate() + 1);

            const dayTasks = allTasks.filter(t => {
                const created = new Date(t.createdAt);
                return created >= day && created < nextDay;
            });

            const total = dayTasks.length;
            const completed = dayTasks.filter(t => t.status === 'completed').length;

            return {
                day: DAY_LABELS[day.getDay()],
                date: dayStr,
                total,
                completed,
                efficiency: total > 0 ? Math.round((completed / total) * 100) : 0
            };
        });

        // ── 4. Fetch habits ────────────────────────────────────────────────
        const allHabits = await Habit.find({ user: userId });

        // ── 5. Build weeklyHabitData from logs ────────────────────────────
        const weeklyHabitData = days.map((day) => {
            const nextDay = new Date(day);
            nextDay.setDate(nextDay.getDate() + 1);

            let totalGoal = 0;
            let totalHit = 0;

            allHabits.forEach(habit => {
                const dayLogs = habit.logs.filter(log => {
                    const logDate = new Date(log.date);
                    return logDate >= day && logDate < nextDay;
                });
                totalGoal += habit.goalFrequency;
                totalHit += Math.min(dayLogs.length, habit.goalFrequency);
            });

            const habitRate = totalGoal > 0 ? Math.round((totalHit / totalGoal) * 100) : 0;

            return {
                day: DAY_LABELS[day.getDay()],
                rate: habitRate
            };
        });

        // ── 6. Sync Level (today's composite score) ───────────────────────
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayTasks = allTasks.filter(t => {
            const c = new Date(t.createdAt);
            return c >= today && c < tomorrow;
        });
        const taskPct = todayTasks.length > 0
            ? (todayTasks.filter(t => t.status === 'completed').length / todayTasks.length) * 100
            : 0;

        const habitTotal = allHabits.reduce((sum, h) => sum + h.goalFrequency, 0);
        const habitDone = allHabits.reduce((sum, h) => sum + Math.min(h.completedToday, h.goalFrequency), 0);
        const habitPct = habitTotal > 0 ? (habitDone / habitTotal) * 100 : 0;

        const syncLevel = Math.round(taskPct * 0.6 + habitPct * 0.4);

        res.json({
            weeklyTaskData,
            weeklyHabitData,
            syncLevel,
            taskPct: Math.round(taskPct),
            habitPct: Math.round(habitPct)
        });

    } catch (err) {
        console.error('getAnalytics error:', err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};
