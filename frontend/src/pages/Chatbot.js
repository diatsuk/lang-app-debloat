import { useState } from "react";
import { API_URL } from "../api";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      const raw = await res.text();
      console.log("RAW CHAT RESPONSE:", raw);

      let data;
      try {
        data = JSON.parse(raw);
      } catch (err) {
        console.error("JSON PARSE ERROR:", err);
        return;
      }


      const botMessage = { role: "assistant", content: data.reply };
      setMessages(prev => [...prev, botMessage]);

    } catch (err) {
      console.error("CHAT REQUEST FAILED:", err);
    }
  };

  return (
    <div className="chat-container">
      <h1>Chatbot</h1>
      <div className="chat-box">
        {messages.map((msg, i) => (
          <p key={i} className={msg.role}>
            <strong>{msg.role === "user" ? "You" : "Bot"}:</strong> {msg.content}
          </p>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
