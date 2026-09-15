import { Link } from "react-router-dom";
import "../App.css";

export default function Header() {
  return (
    <header className="header">

      <nav>
        <Link to="/">Translator</Link>
        <Link to="/chat">Chatbot</Link>
        <Link to="/SavedWords">SavedWords</Link>
        <Link to="/FlashcardsPage">Flashcards</Link>
        <Link to="/ContextExplainerPage">ContextExplainer</Link>
      </nav>
    </header>
  );
}
