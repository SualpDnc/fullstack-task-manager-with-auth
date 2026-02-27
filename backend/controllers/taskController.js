const Task = require('../models/task');

// @desc    Get all tasks
// @route   GET /api/tasks
// Get Tasks (only for the logged-in user)
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({ where: { UserId: req.user.id } });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Create a new task
// @route   POST /api/tasks
// Create Task (with User ID)
exports.createTask = async (req, res) => {
    try {
        const newTask = await Task.create({
            ...req.body,
            UserId: req.user.id // Token'dan gelen kullanıcı ID'sini ekliyoruz
        });
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Update task status
// @route   PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByPk(id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Toggle the completion status
        task.isCompleted = !task.isCompleted;
        await task.save();

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByPk(id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await task.destroy();
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};