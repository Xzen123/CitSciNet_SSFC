const express = require('express'); // Force restart
const cors = require('cors');
require('dotenv').config();
const { pool } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/observations', require('./routes/observations'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/export', require('./routes/export'));
app.use('/api/gamification', require('./routes/gamification'));

app.get('/', (req, res) => {
  res.send('CitSciNet API is running');
});

// Database Connection Test
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
