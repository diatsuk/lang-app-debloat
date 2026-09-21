import React, { useState, useEffect } from "react";
import { API_URL } from "../api";

export default function Flashcards() {
  const [mode, setMode] = useState("manual");


  const [manualFront, setManualFront] = useState("");
  const [manualBack, setManualBack] = useState("");
  const [manualCards, setManualCards] = useState([]);


  const [aiWord, setAiWord] = useState("");
  const [aiCards, setAiCards] = useState([]);

  const [savedCards, setSavedCards] = useState([]);


  const [studyCards, setStudyCards] = useState([]);
  const [studyIndex, setStudyIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  
  useEffect(() => {
  
  
    if (mode === "manual") {
      const load = async () => {
        try {
          const res = await fetch(`${API_URL}/api/flashcards/manual`, {
            credentials: "include"
          });
          if (!res.ok) throw new Error(`Request failed: ${res.status}`);
          const data = await res.json();
          setManualCards(data);
        } catch (err) {
          console.error("Manual fetch error:", err);
          setManualCards([]);
        }
      };
      load();
    }

    if (mode === "ai") {
      const load = async () => {
        try {
          const res = await fetch(`${API_URL}/api/flashcards/ai`, {
            credentials: "include"
          });
          if (!res.ok) throw new Error(`Request failed: ${res.status}`);
          const data = await res.json();
          setAiCards(data);
        } catch (err) {
          console.error("AI fetch error:", err);
          setAiCards([]);
        }
      };
      load();
    }

    if (mode === "saved") {
      const load = async () => {
        try {
          const res = await fetch(`${API_URL}/api/flashcards/from-saved`, {
            credentials: "include"
          });
          if (!res.ok) throw new Error(`Request failed: ${res.status}`);
          const data = await res.json();
          setSavedCards(data);
        } catch (err) {
          console.error("Saved fetch error:", err);
          setSavedCards([]);
        }
      };
      load();
    }
  }, [mode]);

  const createManualCard = async () => {
    try {
      const res = await fetch(`${API_URL}/api/flashcards/manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ front: manualFront, back: manualBack })
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      const data = await res.json();
      setManualCards(prev => [data, ...prev]);
      setManualFront("");
      setManualBack("");
    } catch (err) {
      console.error("Create manual card error:", err);
    }
  };


  const generateAICard = async () => {
    try {
      const res = await fetch(`${API_URL}/api/flashcards/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ word: aiWord })
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      const data = await res.json();
      setAiCards(prev => [data, ...prev]);
      setAiWord("");
    } catch (err) {
      console.error("Generate AI card error:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Flashcards</h1>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setMode("manual")}>Manual</button>
        <button onClick={() => setMode("ai")}>AI</button>
        <button onClick={() => setMode("saved")}>Saved Words</button>
      </div>

      {mode === "manual" && (
        <div>
          <h2>Create Manual Flashcards</h2>

          <input
            value={manualFront}
            onChange={e => setManualFront(e.target.value)}
            placeholder="Front"
          />
          <input
            value={manualBack}
            onChange={e => setManualBack(e.target.value)}
            placeholder="Back"
          />
          <button onClick={createManualCard}>Add</button>

          <button
            onClick={() => {
              setStudyCards(manualCards);
              setStudyIndex(0);
              setFlipped(false);
            }}
          >
            Start
          </button>

          <h3>Your Manual Flashcards</h3>
          {manualCards.map(card => (
            <div key={card._id} className="flashcard">
              <h3>{card.front}</h3>
              <p>{card.back}</p>
            </div>
          ))}
        </div>
      )}

      {mode === "ai" && (
        <div>
          <h2>AI Flashcards</h2>

          <input
            value={aiWord}
            onChange={e => setAiWord(e.target.value)}
            placeholder="Enter word"
          />
          <button onClick={generateAICard}>Generate</button>

          <button
            onClick={() => {
              setStudyCards(aiCards);
              setStudyIndex(0);
              setFlipped(false);
            }}
          >
            Start
          </button>

          <h3>Generated Flashcards</h3>
          {aiCards.map(card => (
            <div key={card._id} className="flashcard">
              <h3>{card.front}</h3>
              <p>{card.back}</p>
            </div>
          ))}
        </div>
      )}
      {mode === "saved" && (
        <div>
          <h2>Flashcards From Saved Words</h2>

          <button
            onClick={() => {
              setStudyCards(savedCards);
              setStudyIndex(0);
              setFlipped(false);
            }}
          >
           Start
          </button>

          {savedCards.length === 0 && <p>No saved words yet.</p>}

          {savedCards.map(card => (
            <div key={card._id} className="flashcard">
              <h3>{card.front}</h3>
              <p>{card.back}</p>
            </div>
          ))}
        </div>
      )}
      {studyCards.length > 0 && (
        <div style={{ marginTop: "40px" }}>

          <div
            onClick={() => setFlipped(!flipped)}
            style={{
              width: "300px",
              height: "180px",
              border: "1px solid #ccc",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              cursor: "pointer",
              marginBottom: "20px",
              background: "#fafafa"
            }}
          >
            {flipped
              ? studyCards[studyIndex].back
              : studyCards[studyIndex].front}
          </div>

          <div>
            <button
              onClick={() => {
                setFlipped(false);
                setStudyIndex(i => Math.max(i - 1, 0));
              }}
            >
              Previous
            </button>

            <button
              onClick={() => {
                setFlipped(false);
                setStudyIndex(i =>
                  Math.min(i + 1, studyCards.length - 1)
                );
              }}
            >
              Next
            </button>

            <button
              onClick={() => {
                const shuffled = [...studyCards].sort(
                  () => Math.random() - 0.5
                );
                setStudyCards(shuffled);
                setStudyIndex(0);
                setFlipped(false);
              }}
            >
              Shuffle
            </button>

            <button
              onClick={() => {
                setStudyCards([]);
                setStudyIndex(0);
                setFlipped(false);
              }}
            >
              Exit Study Mode
            </button>
          </div>

          <p>
            Card {studyIndex + 1} of {studyCards.length}
          </p>
        </div>
      )}
    </div>
  );
}