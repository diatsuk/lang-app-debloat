import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import React, { useEffect, useState } from 'react';
import { API_URL } from "./api";

import Header from "./pages/Header";
import Translator from "./pages/Translator"; 
import Chatbot from "./pages/Chatbot";
import SavedWords from './pages/SavedWords';
import Login from './pages/Login';
import FlashCardsPage from "./pages/Flashcards";
import ContextExplainerPage from "./pages/Context";
function WelcomeBanner({ user }) {
  if (!user) return null;
  return (
    <div style={{ backgroundColor: '#e0f7fa', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
      <h2>Welcome, {user.name || user.email}!</h2>
    </div>
  );
}
function App() { 
  const [user, setUser] = useState(null); 
  const [loadingUser, setLoadingUser] = useState(true); 

useEffect(() => {
  fetch(`${API_URL}/api/current_user`, { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
      console.log("Frontend received user:", data);
      setUser(data);
    })
    .catch(() => setUser(null))
    .finally(() => setLoadingUser(false));
}, []);


  if (loadingUser) return (
    <div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  }}
>
      <p>Loading...</p> 
      <p>Can take up for 30 seconds due to free hosting</p>
      <div class="tenor-gif-embed" data-postid="7983494771722142743" data-share-method="host" data-aspect-ratio="0.809237" data-width="30%"><a href="https://tenor.com/view/cat-sitting-cat-sitting-gif-7983494771722142743">
      Cat Waiting Patiently</a>
      </div> 
      <script type="text/javascript" async src="https://tenor.com/embed.js"></script> 
    </div>);

  return (
    <Router>
      <Header /> 
      <WelcomeBanner user={user} />
    {/* <Login />*/}
      <Routes> 
        <Route path="/" element={<Translator />} /> 
        <Route path="/chat" element={<Chatbot />} />
        <Route path="/FlashCardsPage" element={<FlashCardsPage />} />
        <Route path="/SavedWords" element={<SavedWords />} />
        <Route path="/ContextExplainerPage" element={<ContextExplainerPage />} />
        <Route path="/Login" element={<Login />} />
      </Routes> 
    </Router>
  );
}

export default App;
