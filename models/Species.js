const mongoose = require('mongoose');

const speciesSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  image: { type: String, default: '' } // You will upload this later
}, { timestamps: true });

module.exports = mongoose.model('Species', speciesSchema);