const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const speciesRoutes = require('./routes/speciesRoutes');
const birdRoutes = require('./routes/birdRoutes');
const { seedSpecies } = require('./controllers/speciesController');

const app = express();
app.use(cors());
app.use(express.json());

// Auto-seed species on start
seedSpecies();

// Simple Login for Dashboard
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'buba' && password === 'buba2026') {
    res.status(200).json({ message: 'Login successful', token: 'fake-jwt-token' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.use('/api/species', speciesRoutes);
app.use('/api/birds', birdRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => console.log(`🚀 BubaPet Server on port ${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB error:', err));