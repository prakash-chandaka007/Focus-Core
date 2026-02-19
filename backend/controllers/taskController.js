const Task = require('../models/Task');

// @desc Create a new task
exports.createTask = async (req, res) => {
    try {
        const { text, priority } = req.body;
        const newTask = new Task({
            user: req.user.id,
            text,
            priority
        });
        const task = await newTask.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc Get all tasks for logged-in user
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc Update task status
exports.updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        let task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ msg: 'Task not found' });
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        task = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: { status } },
            { new: true }
        );
        res.json(task);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @desc Delete task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await task.deleteOne();
        res.json({ msg: 'Task removed' });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
};
