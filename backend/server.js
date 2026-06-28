const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database (or initialize local file fallback)
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/notes', require('./routes/notes'));

// Base route for health check
app.get('/', (req, res) => {
  res.json({
    name: 'Zenith Workspace Board API',
    status: 'Running',
    database: process.env.USE_LOCAL_DB === 'true' ? 'Local JSON File' : 'MongoDB Atlas'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Zenith Server booted successfully on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}`);
});
