const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { protect } = require('../middleware/auth');

// Apply auth protection middleware to all note routes
router.use(protect);

// @route   GET /api/notes
// @desc    Get all user notes
// @access  Private
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error('Fetch notes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/notes
// @desc    Create a note
// @access  Private
router.post('/', async (req, res) => {
  const { title, content, color } = req.body;

  try {
    const newNote = await Note.create({
      title: title || 'Untitled Note',
      content: content || '',
      color: color || '#3b82f6',
      userId: req.user.id
    });

    res.status(201).json(newNote);
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/notes/:id
// @desc    Update a note
// @access  Private
router.put('/:id', async (req, res) => {
  const { title, content, color } = req.body;

  try {
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Verify note ownership
    if (note.userId !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this note' });
    }

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content;
    if (color !== undefined) updates.color = color;

    const updatedNote = await Note.findByIdAndUpdate(req.params.id, updates);
    res.json(updatedNote);
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/notes/:id
// @desc    Delete a note
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Verify note ownership
    if (note.userId !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this note' });
    }

    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note removed' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
