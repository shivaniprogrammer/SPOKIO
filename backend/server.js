require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
app.use(cors()); 
app.use(express.json()); 

// --- ROUTES IMPORTS ---
const authRoutes = require('./routes/auth'); 
const caretakerRoutes = require('./routes/caretaker'); 


const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---


// --- DATABASE CONNECTION ---
// Using the variable from your .env file
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/spokio')
  .then(() => console.log("✅ Connected to MongoDB successfully!"))
  .catch(err => console.error("❌ Database connection error:", err));

// --- API ENDPOINTS ---
app.use('/api/auth', authRoutes);
app.use('/api/caretaker', caretakerRoutes);

app.get('/', (req, res) => {
    res.send("Spokio Backend is active and running!");
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`🚀 Server active on port ${PORT}`);
});