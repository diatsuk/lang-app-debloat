const mongoose = require('mongoose');

const contextExplainerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  highlightedWord: String,
  explanation: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ContextExplainer', contextExplainerSchema);
