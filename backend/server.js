require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

// --- STATIC FILES ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- ROUTES ---
const authRoutes      = require('./routes/auth');
const caretakerRoutes = require('./routes/caretaker');
const communityRoutes = require('./routes/community');

app.use('/api/auth',      authRoutes);
app.use('/api/caretaker', caretakerRoutes);
app.use('/api/community', communityRoutes);

app.get('/', (req, res) => {
  res.send('Spokio Backend is active and running!');
});

// --- DATABASE + SERVER START ---
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/spokio')
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
    app.listen(PORT, () => {
      console.log(`🚀 Server active on port ${PORT}`);
    });
  })
  .catch(err => console.error('❌ Database connection error:', err));