const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: String,
  createdAt: { type: Date, default: Date.now },
  progress: {
    flashcards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Flashcard' }],
    dictionary: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SavedWord' }],
    chatbotHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChatbotLog' }],
    contextExplainers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ContextExplainer' }]
  }
});

module.exports = mongoose.model('User', userSchema);