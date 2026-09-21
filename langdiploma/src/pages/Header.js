import { NavLink } from "react-router-dom";
import "../App.css";
import { useState } from "react";
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="header">

      <nav className="nav-pills">
        <NavLink to="/" end className="nav-pill">Translator</NavLink>
        <NavLink to="/chat" className="nav-pill">Chatbot</NavLink>
        <NavLink to="/SavedWords" className="nav-pill">SavedWords</NavLink>
        <NavLink to="/FlashcardsPage" className="nav-pill">Flashcards</NavLink>
        <NavLink to="/ContextExplainerPage" className="nav-pill">ContextExplainer</NavLink>
        <NavLink to="/Login" className="nav-pill">Sign in</NavLink>
        <NavLink to="/Login" className="nav-pill">Sign out</NavLink>

      </nav>
      
    </header>
  );
}
