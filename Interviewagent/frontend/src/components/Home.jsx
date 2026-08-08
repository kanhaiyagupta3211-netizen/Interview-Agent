import { useState } from "react";

function Home({ onStartInterview, onShowGuide }) {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleContinue = () => {
    if (name.trim()) {
      setSubmitted(true);
    }
  };

  if (!submitted) {
    return (
      <div className="welcome-screen">
        <h2>👋 Welcome!</h2>
        <p>Enter your name to get started</p>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleContinue()}
        />
        <button onClick={handleContinue} disabled={!name.trim()}>
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="home-menu">
      <h2>Welcome, {name}! 🎯</h2>
      <p>What would you like to do?</p>
      <div className="menu-options">
        <button className="menu-card" onClick={onStartInterview}>
          <span className="menu-icon">🎤</span>
          <span className="menu-title">Start Interview</span>
          <span className="menu-desc">Practice with AI-powered mock interview</span>
        </button>
        <button className="menu-card" onClick={onShowGuide}>
          <span className="menu-icon">📘</span>
          <span className="menu-title">Tips & Guide</span>
          <span className="menu-desc">Learn how to ace your interview</span>
        </button>
      </div>
    </div>
  );
}

export default Home;