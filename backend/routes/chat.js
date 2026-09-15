const express = require("express");
const router = express.Router();

// POST /api/chat
router.post("/", async (req, res) => {
  try {
    const { messages } = req.body;
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages,
      }),
    });

    const raw = await response.text();

    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      console.error("Chatbot API returned non-JSON:", raw);
      return res.json({ reply: "chatbot api error" });
    }

    const reply = data.choices?.[0]?.message?.content || "No reply received";
    return res.json({ reply });
  } catch (err) {
    console.error("Chatbot server error:", err);
    return res.json({ reply: "chatbot error" });
  }
});

module.exports = router;
