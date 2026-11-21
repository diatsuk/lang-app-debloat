import React, { useState } from "react";
import { API_URL } from "../api";

export default function ContextExplainerPage() {
  const [word, setWord] = useState("");
  const [result, setResult] = useState(null);

  const explainWord = async () => {
    try {
      // IMPORTANT: use full backend URL if no proxy is set up
      const res = await fetch(`${API_URL}/api/context/explain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word })
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Server error:", res.status, errText);
        setResult({
          explanation: "⚠️ Backend error",
          examples: []
        });
        return;
      }

      let data;
      try {
        data = await res.json();
      } catch (err) {
        console.error("JSON parse error:", err);
        const raw = await res.text();
        setResult({
          explanation: raw || "⚠️ Invalid response format",
          examples: []
        });
        return;
      }

      // Ensure consistent shape
      setResult({
        explanation: data.explanation || "⚠️ No explanation available",
        examples: Array.isArray(data.examples) ? data.examples : []
      });

    } catch (err) {
      console.error("Request failed:", err);
      setResult({
        explanation: "⚠️ Could not reach backend",
        examples: []
      });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Context Explainer</h1>
      <input
        type="text"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="Enter a word"
      />
      <button onClick={explainWord}>Explain</button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h2>Explanation</h2>
          <p>{result.explanation}</p>
          <h3>Examples</h3>
          <ul>
            {(result.examples || []).map((ex, i) => (
              <li key={i}>{ex}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
