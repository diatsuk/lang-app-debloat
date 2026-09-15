const mongoose = require("mongoose");

const flashcardSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    front: { type: String, required: true },
    back: { type: String, required: true },
    source: { type: String, enum: ["manual", "ai", "saved"], required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Flashcard", flashcardSchema);
