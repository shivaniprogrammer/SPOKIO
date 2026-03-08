const mongoose = require('mongoose');

const CaretakerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Links it to a specific user if you have login
});

module.exports = mongoose.model('Caretaker', CaretakerSchema);