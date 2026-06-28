const mongoose = require('mongoose');
const { readDB, writeDB } = require('./jsonDbHelper');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: { type: String, default: '' },
  userId: { type: String, required: true },
  subtasks: [{
    _id: String,
    title: String,
    completed: Boolean
  }]
}, { timestamps: true });

const MongooseTask = mongoose.model('Task', TaskSchema);

const Task = {
  find: async (query = {}) => {
    if (process.env.USE_LOCAL_DB === 'true') {
      const db = readDB();
      return db.tasks.filter(t => {
        return Object.keys(query).every(key => t[key] === query[key]);
      });
    }
    return MongooseTask.find(query).sort({ updatedAt: -1 });
  },

  findById: async (id) => {
    if (process.env.USE_LOCAL_DB === 'true') {
      const db = readDB();
      return db.tasks.find(t => t._id === id) || null;
    }
    return MongooseTask.findById(id);
  },

  create: async (data) => {
    if (process.env.USE_LOCAL_DB === 'true') {
      const db = readDB();
      
      // Generate clean subtasks
      const subtasks = (data.subtasks || []).map(st => ({
        _id: st._id || Math.random().toString(36).substr(2, 9),
        title: st.title || '',
        completed: st.completed || false
      }));

      const newTask = {
        _id: Math.random().toString(36).substr(2, 9),
        title: data.title,
        description: data.description || '',
        status: data.status || 'todo',
        priority: data.priority || 'medium',
        dueDate: data.dueDate || '',
        userId: data.userId,
        subtasks,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      db.tasks.push(newTask);
      writeDB(db);
      return newTask;
    }
    return MongooseTask.create(data);
  },

  findByIdAndUpdate: async (id, updates, options = {}) => {
    if (process.env.USE_LOCAL_DB === 'true') {
      const db = readDB();
      const index = db.tasks.findIndex(t => t._id === id);
      if (index === -1) return null;
      
      const original = db.tasks[index];
      
      // Apply updates
      const updatedTask = {
        ...original,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      db.tasks[index] = updatedTask;
      writeDB(db);
      return updatedTask;
    }
    return MongooseTask.findByIdAndUpdate(id, updates, { new: true });
  },

  findByIdAndDelete: async (id) => {
    if (process.env.USE_LOCAL_DB === 'true') {
      const db = readDB();
      const index = db.tasks.findIndex(t => t._id === id);
      if (index === -1) return null;
      const [deleted] = db.tasks.splice(index, 1);
      writeDB(db);
      return deleted;
    }
    return MongooseTask.findByIdAndDelete(id);
  }
};

module.exports = Task;
