const express = require("express");
const SavedWord = require("../models/SavedWord");
const { ensureAuthenticated } = require("../middleware/ensureAuthenticated");

const router = express.Router();

router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const words = await SavedWord.find({ userId: req.user._id.toString() });
    res.json(words);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", ensureAuthenticated, async (req, res) => {
  try {
    const { word, translation, notes } = req.body;
    const newWord = new SavedWord({
      userId: req.user._id.toString(),
      word,
      translation,
      notes,
    });
    await newWord.save();
    res.json(newWord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", ensureAuthenticated, async (req, res) => {
  try {
    await SavedWord.findOneAndDelete({ _id: req.params.id, userId: req.user._id.toString() });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
