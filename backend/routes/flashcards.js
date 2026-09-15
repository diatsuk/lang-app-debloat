const express = require("express");
const router = express.Router();

const Flashcard = require("../models/FlashCard");
const FlashcardDeck = require("../models/FlashcardDeck");
const SavedWord = require("../models/SavedWord");
const { ensureAuthenticated } = require("../middleware/ensureAuthenticated");

// --- Manual flashcards ---

// POST /api/flashcards/manual
router.post("/manual", ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { front, back } = req.body;

    if (!front || !back) {
      return res.status(400).json({ message: "front and back are required" });
    }

    const card = await Flashcard.create({ userId, front, back, source: "manual" });
    res.json(card);
  } catch (err) {
    console.error("Manual flashcard error:", err);
    res.status(500).json({ message: "Failed to create flashcard" });
  }
});

// GET /api/flashcards/manual
router.get("/manual", ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const cards = await Flashcard.find({ userId, source: "manual" }).sort({ createdAt: -1 });
    res.json(cards);
  } catch (err) {
    console.error("Get manual flashcards error:", err);
    res.status(500).json({ message: "Failed to load flashcards" });
  }
});

// --- AI-generated single flashcard ---

// POST /api/flashcards/ai
router.post("/ai", ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { word } = req.body;

    if (!word || !word.trim()) {
      return res.status(400).json({ message: "word is required" });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: 'Respond ONLY with JSON: { "front": "...", "back": "..." }' },
          { role: "user", content: `Create a flashcard for the word "${word}".` },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const rawErr = await response.text().catch(() => "");
      console.error("Groq HTTP error:", response.status, rawErr);
      return res.status(500).json({ message: "AI service error" });
    }

    const envelope = await response.json();
    const content =
      envelope?.choices?.[0]?.message?.content || envelope?.choices?.[0]?.text || "";

    let cardData;
    try {
      cardData = JSON.parse(content.trim());
      if (!cardData.front || !cardData.back) throw new Error("Invalid structure");
    } catch (err) {
      console.warn("AI JSON parse failed, fallback:", err.message);
      cardData = { front: word, back: content.trim() || "Could not generate definition" };
    }

    const saved = await Flashcard.create({
      userId,
      front: cardData.front,
      back: cardData.back,
      source: "ai",
    });

    res.json(saved);
  } catch (err) {
    console.error("AI flashcard error:", err);
    res.status(500).json({ message: "Failed to generate flashcard" });
  }
});

// GET /api/flashcards/ai
router.get("/ai", ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const cards = await Flashcard.find({ userId, source: "ai" }).sort({ createdAt: -1 });
    res.json(cards);
  } catch (err) {
    console.error("Get AI flashcards error:", err);
    res.status(500).json({ message: "Failed to load flashcards" });
  }
});

// --- Flashcards derived from saved words ---

// GET /api/flashcards/from-saved
router.get("/from-saved", ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const words = await SavedWord.find({ userId }).sort({ createdAt: -1 });

    const flashcards = words.map((w) => ({
      front: w.word,
      back: w.translation || w.notes || "No translation available",
      source: "saved",
      _id: w._id,
    }));

    res.json(flashcards);
  } catch (err) {
    console.error("Saved words flashcards error:", err);
    res.status(500).json({ message: "Failed to load saved words flashcards" });
  }
});

// --- Decks ---

// POST /api/flashcards/create
router.post("/create", async (req, res) => {
  try {
    const { title, cards, ownerId } = req.body;

    const flashcards = await Flashcard.insertMany(cards);
    const deck = await FlashcardDeck.create({
      title,
      ownerId,
      mode: "custom",
      cards: flashcards.map((c) => c._id),
    });

    res.json({ cards: flashcards, deck });
  } catch (err) {
    console.error("Create deck error:", err);
    res.status(500).json({ error: "Failed to create deck" });
  }
});

// POST /api/flashcards/generate
router.post("/generate", async (req, res) => {
  try {
    const { topic, ownerId } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [{ role: "user", content: `Generate 10 flashcards on topic: ${topic}` }],
      }),
    });

    const data = await response.json();
    let raw = data.choices[0].message?.content?.trim();

    if (raw.startsWith("```")) {
      raw = raw.replace(/```json|```/g, "").trim();
    }

    let cardsData;
    try {
      cardsData = JSON.parse(raw);
    } catch (err) {
      console.error("Invalid AI response:", raw);
      return res.status(500).json({ error: "AI did not return valid JSON" });
    }

    if (!Array.isArray(cardsData)) {
      return res.status(500).json({ error: "AI response was not an array" });
    }

    const flashcards = await Flashcard.insertMany(cardsData);
    const deck = await FlashcardDeck.create({
      title: `AI Deck: ${topic}`,
      ownerId,
      mode: "ai",
      cards: flashcards.map((c) => c._id),
    });

    res.json({ cards: flashcards, deck });
  } catch (err) {
    console.error("Generate deck error:", err);
    res.status(500).json({ error: "AI deck generation failed" });
  }
});

// GET /api/flashcards/random/:ownerId
// NOTE: kept as-is from the original — this samples SavedWord across ALL users,
// not just :ownerId. Flagging it here since it looks unintentional, but not
// changing behavior as part of this reorg. Happy to fix it separately if you want.
router.get("/random/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const randomWords = await SavedWord.aggregate([{ $sample: { size: 10 } }]);

    const flashcards = await Flashcard.insertMany(
      randomWords.map((w) => ({
        front: w.word,
        back: w.definition || "No definition available",
        example: w.example || "",
      }))
    );

    const deck = await FlashcardDeck.create({
      title: "Random Dictionary Deck",
      ownerId,
      mode: "dictionary",
      cards: flashcards.map((c) => c._id),
    });

    res.json({ cards: flashcards, deck });
  } catch (err) {
    console.error("Random deck error:", err);
    res.status(500).json({ error: "Failed to generate random deck" });
  }
});

module.exports = router;
