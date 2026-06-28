const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

// Apply auth protection middleware to all task routes
router.use(protect);

// @route   GET /api/tasks
// @desc    Get all user tasks
// @access  Private
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (error) {
    console.error('Fetch tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/tasks
// @desc    Create a task
// @access  Private
router.post('/', async (req, res) => {
  const { title, description, status, priority, dueDate, subtasks } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    const newTask = await Task.create({
      title,
      description,
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate: dueDate || '',
      userId: req.user.id,
      subtasks: subtasks || []
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', async (req, res) => {
  const { title, description, status, priority, dueDate, subtasks } = req.body;

  try {
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify task ownership
    if (task.userId !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this task' });
    }

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (priority !== undefined) updates.priority = priority;
    if (dueDate !== undefined) updates.dueDate = dueDate;
    if (subtasks !== undefined) updates.subtasks = subtasks;

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, updates);
    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify task ownership
    if (task.userId !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task removed' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
