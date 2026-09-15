const mongoose = require('mongoose');

const deckSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mode: { type: String, enum: ['custom', 'ai', 'dictionary'], required: true },
  cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Flashcard' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FlashcardDeck', deckSchema);
