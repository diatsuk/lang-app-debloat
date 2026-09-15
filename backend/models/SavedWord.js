const mongoose = require('mongoose');

const savedWordSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // store as string
  word: { type: String, required: true },
  translation: String,
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('SavedWord', savedWordSchema);
