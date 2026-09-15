const express = require("express");
const router = express.Router();

function parsePlainText(raw) {
  const text = (raw || "").trim();
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const examples = lines.filter((l) => /^\d+[.)]/.test(l)).slice(0, 5);
  const explanation = lines[0] || text;
  return { explanation, examples };
}

// POST /api/context/explain
router.post("/explain", async (req, res) => {
  try {
    const { word } = req.body;
    if (!word || !word.trim()) {
      return res.json({ explanation: "Word is required", examples: [] });
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
          {
            role: "system",
            content:
              'Respond ONLY with JSON: { "explanation": "...", "examples": ["..."] }',
          },
          {
            role: "user",
            content: `Explain the word "${word}" and give 3-5 example sentences.`,
          },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const rawErr = await response.text().catch(() => "");
      console.error("Groq HTTP error:", response.status, rawErr);
      return res.json({ explanation: "AI service error", examples: [] });
    }

    const envelope = await response.json();

    const content =
      envelope?.choices?.[0]?.message?.content ||
      envelope?.choices?.[0]?.messages?.[0]?.content ||
      envelope?.choices?.[0]?.text ||
      "";

    let result;
    try {
      result = JSON.parse(content.trim());
      if (!result.explanation || !Array.isArray(result.examples)) {
        throw new Error("Invalid structure");
      }
    } catch (err) {
      console.warn("JSON parse failed, using fallback:", err.message);
      result = parsePlainText(content);
    }

    res.json(result);
  } catch (err) {
    console.error("Context explainer fatal error:", err);
    res.json({ explanation: "Context explanation failed", examples: [] });
  }
});

module.exports = router;
