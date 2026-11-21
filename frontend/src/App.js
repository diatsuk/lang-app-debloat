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
import Reader from './pages/Reader';
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
  var [loadingAnimation, setLoadingAnimation] = useState("Loading");
  useEffect(() =>
{
  const LoadingDots = ["Loading", "Loading.", "Loading..","Loading..."];
  let cycle = 0;
  const intervalId = setInterval(() => {
    setLoadingAnimation(LoadingDots[cycle]);
    cycle++;
    if (cycle === LoadingDots.length)
      cycle = 0;
  }, 1000);
  return () => {
    clearInterval(intervalId);
  };
}, []);

useEffect(() => {
  fetch(`${API_URL}/api/current_user`, { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
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
      <p><b>{loadingAnimation}</b></p> 
      <p>Can take up for 60 seconds due to inactivity</p>
      <div class="tenor-gif-embed" data-postid="7983494771722142743" data-share-method="host" data-aspect-ratio="0.809237" data-width="30%">
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
        <Route path="/Reader" element={<Reader />} />
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
