import { useState, useEffect } from "react";
import "./App.css";
import Home from "./components/Home";
import Guide from "./components/Guide";
import Interview from "./components/Interview";
import Report from "./components/Report";

function App() {
  const [screen, setScreen] = useState("home");
  const [userName, setUserName] = useState("");
  const [reportText, setReportText] = useState("");

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";
    fetch(`${API_URL}/api/next-question`).catch(() => {});
  }, []);

  return (
    <div className="app">
      <header>
        <h1><span className="emoji">🤖</span> <span className="gradient-text">AI Interview Agent</span></h1>
        <p>Practice with AI-powered interview coaching</p>
      </header>
      <main>
        {screen === "home" && (
          <Home
            userName={userName}
            setUserName={setUserName}
            onStartInterview={() => setScreen("interview")}
            onShowGuide={() => setScreen("guide")}
          />
        )}
        {screen === "guide" && <Guide onBack={() => setScreen("home")} />}
        {screen === "interview" && (
          <Interview
            onBack={() => setScreen("home")}
            onFinish={(report) => {
              setReportText(report);
              setScreen("report");
            }}
          />
        )}
        {screen === "report" && (
          <Report reportText={reportText} onBack={() => setScreen("home")} />
        )}
      </main>
    </div>
  );
}

export default App;