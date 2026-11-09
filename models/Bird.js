const mongoose = require('mongoose');

const birdSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Charlie"
  species: { type: mongoose.Schema.Types.ObjectId, ref: 'Species', required: true },
  age: { type: String, required: true }, // e.g., "6 Months"
  price: { type: Number, required: true },
  description: { type: String, required: true },
  images: { type: [String], required: true },
  isSold: { type: Boolean, default: false } // To hide sold birds from the frontend
}, { timestamps: true });

module.exports = mongoose.model('Bird', birdSchema);