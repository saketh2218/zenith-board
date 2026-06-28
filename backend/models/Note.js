const mongoose = require('mongoose');
const { readDB, writeDB } = require('./jsonDbHelper');

const NoteSchema = new mongoose.Schema({
  title: { type: String, default: 'Untitled Note' },
  content: { type: String, default: '' },
  userId: { type: String, required: true },
  color: { type: String, default: '#3b82f6' }
}, { timestamps: true });

const MongooseNote = mongoose.model('Note', NoteSchema);

const Note = {
  find: async (query = {}) => {
    if (process.env.USE_LOCAL_DB === 'true') {
      const db = readDB();
      return db.notes.filter(n => {
        return Object.keys(query).every(key => n[key] === query[key]);
      });
    }
    return MongooseNote.find(query).sort({ updatedAt: -1 });
  },

  findById: async (id) => {
    if (process.env.USE_LOCAL_DB === 'true') {
      const db = readDB();
      return db.notes.find(n => n._id === id) || null;
    }
    return MongooseNote.findById(id);
  },

  create: async (data) => {
    if (process.env.USE_LOCAL_DB === 'true') {
      const db = readDB();
      const newNote = {
        _id: Math.random().toString(36).substr(2, 9),
        title: data.title || 'Untitled Note',
        content: data.content || '',
        userId: data.userId,
        color: data.color || '#3b82f6',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      db.notes.push(newNote);
      writeDB(db);
      return newNote;
    }
    return MongooseNote.create(data);
  },

  findByIdAndUpdate: async (id, updates, options = {}) => {
    if (process.env.USE_LOCAL_DB === 'true') {
      const db = readDB();
      const index = db.notes.findIndex(n => n._id === id);
      if (index === -1) return null;

      const original = db.notes[index];
      const updatedNote = {
        ...original,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      db.notes[index] = updatedNote;
      writeDB(db);
      return updatedNote;
    }
    return MongooseNote.findByIdAndUpdate(id, updates, { new: true });
  },

  findByIdAndDelete: async (id) => {
    if (process.env.USE_LOCAL_DB === 'true') {
      const db = readDB();
      const index = db.notes.findIndex(n => n._id === id);
      if (index === -1) return null;
      const [deleted] = db.notes.splice(index, 1);
      writeDB(db);
      return deleted;
    }
    return MongooseNote.findByIdAndDelete(id);
  }
};

module.exports = Note;
