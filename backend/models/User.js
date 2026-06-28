const mongoose = require('mongoose');
const { readDB, writeDB } = require('./jsonDbHelper');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

const MongooseUser = mongoose.model('User', UserSchema);

const User = {
  findOne: async (query) => {
    if (process.env.USE_LOCAL_DB === 'true') {
      const db = readDB();
      return db.users.find(u => {
        return Object.keys(query).every(key => u[key] === query[key]);
      }) || null;
    }
    return MongooseUser.findOne(query);
  },

  findById: async (id) => {
    if (process.env.USE_LOCAL_DB === 'true') {
      const db = readDB();
      return db.users.find(u => u._id === id) || null;
    }
    return MongooseUser.findById(id);
  },

  create: async (data) => {
    if (process.env.USE_LOCAL_DB === 'true') {
      const db = readDB();
      
      // Email unique check
      const existing = db.users.find(u => u.email === data.email);
      if (existing) {
        throw new Error('User with this email already exists');
      }

      const newUser = {
        _id: Math.random().toString(36).substr(2, 9),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      db.users.push(newUser);
      writeDB(db);
      return newUser;
    }
    return MongooseUser.create(data);
  }
};

module.exports = User;
