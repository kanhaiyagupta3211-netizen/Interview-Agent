import { useState } from "react";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const startInterview = async () => {
    setLoading(true);
    try {
      await fetch("http://localhost:5002/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: "React", level: "Intermediate" })
      });
      const res = await fetch("http://localhost:5002/api/next-question");
      const data = await res.json();
      if (data.question) {
        setQuestion(data.question);
        setAnswer("");
        setFeedback("");
      } else {
        alert("No questions generated. Try again!");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!answer.trim()) {
      alert("Please write an answer.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5002/api/submit-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      setFeedback(data.feedback || "");
      setAnswer("");

      if (data.done) {
        const reportRes = await fetch("http://localhost:5002/api/report");
        const reportData = await reportRes.json();
        alert("🎉 Interview Completed!\n\n" + reportData.report);
        setQuestion("");
        setFeedback("");
      } else if (data.nextQuestion) {
        const qRes = await fetch("http://localhost:5002/api/next-question");
        const qData = await qRes.json();
        setQuestion(qData.question);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="app">
      <header>
        <h1>🤖 AI Interview Agent</h1>
        <p>Practice with AI-powered interview coaching</p>
      </header>
      <main>
        <div className="card">
          <h2>Interview Practice</h2>
          <button onClick={startInterview} disabled={loading}>
            {loading ? "Loading..." : "🎯 Start Interview"}
          </button>
          {question && (
            <div className="question-box">
              <h3>📝 Question</h3>
              <p>{question}</p>
              <textarea
                placeholder="Type your answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows="4"
              />
              <button onClick={handleSubmit} disabled={loading}>
                {loading ? "Submitting..." : "📤 Submit Answer"}
              </button>
              {feedback && (
                <div className="feedback-box">
                  <h3>💡 AI Feedback</h3>
                  <p>{feedback}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;