const express = require("express");
const router = express.Router();

// POST /api/translate
router.post("/", async (req, res) => {
  const { text, targetLang, sourceLang } = req.body;

  try {
    const params = new URLSearchParams();
    params.append("text", text);
    params.append("target_lang", targetLang);
    params.append("source_lang", sourceLang);

    const response = await fetch("https://api-free.deepl.com/v2/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
      },
      body: params,
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Translate error:", error);
    res.json({ translations: [] });
  }
});

module.exports = router;
