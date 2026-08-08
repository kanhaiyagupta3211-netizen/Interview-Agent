import { useState } from "react";
import "./App.css";
import Home from "./components/Home";
import Guide from "./components/Guide";
import Interview from "./components/Interview";

function App() {
  const [screen, setScreen] = useState("home"); // "home" | "guide" | "interview"

  return (
    <div className="app">
      <header>
  <h1><span className="emoji">🤖</span> <span className="gradient-text">AI Interview Agent</span></h1>
  <p>Practice with AI-powered interview coaching</p>
</header>
      <main>
        {screen === "home" && (
          <Home
            onStartInterview={() => setScreen("interview")}
            onShowGuide={() => setScreen("guide")}
          />
        )}
        {screen === "guide" && <Guide onBack={() => setScreen("home")} />}
        {screen === "interview" && <Interview onBack={() => setScreen("home")} />}
      </main>
    </div>
  );
}

export default App;