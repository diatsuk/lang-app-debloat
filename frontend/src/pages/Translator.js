import React, { useState } from "react";
import { API_URL } from "../api";

function Translator() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const [sourceLang, setSourceLang] = useState("PL");
  const [targetLang, setTargetLang] = useState("EN");

  const languages = [
    { code: "EN", name: "English" },
    { code: "PL", name: "Polish" },
    { code: "DE", name: "German" },
    { code: "FR", name: "French" },
    { code: "ES", name: "Spanish" },
    { code: "IT", name: "Italian" },
    { code: "UK", name: "Ukrainian" }, 
  ];

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInput(output);
    setOutput(input);
  };

  const translate = async () => {
    try {
      const res = await fetch(`${API_URL}/api/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: input,
          targetLang,
          sourceLang,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Server error:", res.status, errText);
        setOutput("Translation failed (server error).");
        return;
      }

      let data;
      try {
        data = await res.json();
      } catch (err) {
        console.error("JSON parse error:", err);
        const raw = await res.text();
        setOutput(raw || "Invalid response from server.");
        return;
      }

      if (data.translations && data.translations.length > 0) {
        setOutput(data.translations[0].text);
      } else {
        console.error("Unexpected response:", data);
        setOutput("Translation failed or no result.");
      }
    } catch (err) {
      console.error("Request failed:", err);
      setOutput("Could not reach translation server.");
    }
  };

  return (
    <div className="translator-container">
      <h1>Translator</h1>

      <div className="language-row">
        <select
          value={sourceLang}
          onChange={(e) => setSourceLang(e.target.value)}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>

        <button className="swap-btn" onClick={swapLanguages}>
          ⇆
        </button>

        <select
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <div className="textareas">
        <textarea
          placeholder="Type text here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <textarea
          placeholder="Translation appears here..."
          value={output}
          readOnly
        />
      </div>

      <button className="translate-btn" onClick={translate}>  
        Translate
      </button>
    </div>
  );
}

export default Translator;
