const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('----------------------------------------------------');
    console.log('WARNING: No MONGODB_URI environment variable detected.');
    console.log('SYSTEM ACTION: Falling back to local JSON database.');
    console.log('To connect to live MongoDB, set MONGODB_URI in .env');
    console.log('----------------------------------------------------');
    process.env.USE_LOCAL_DB = 'true';
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    process.env.USE_LOCAL_DB = 'false';
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('SYSTEM ACTION: Falling back to local JSON database due to connection failure.');
    process.env.USE_LOCAL_DB = 'true';
  }
};

module.exports = connectDB;
