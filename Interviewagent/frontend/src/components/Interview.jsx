import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";

function Interview({ onBack, onFinish }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  const startInterview = async () => {
    setLoading(true);
    try {
      await fetch(`${API_URL}/api/generate-questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: "React", level: "Intermediate" })
      });
      const res = await fetch(`${API_URL}/api/next-question`);
      const data = await res.json();
      if (data.question) {
        setQuestion(data.question);
        setAnswer("");
        setFeedback("");
        setStarted(true);
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
      const response = await fetch(`${API_URL}/api/submit-answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setFeedback(data.feedback || "");
      setFeedbackType(data.feedbackType || "neutral");
      setAnswer("");
    if (data.done) {
        const reportRes = await fetch(`${API_URL}/api/report`);
        const reportData = await reportRes.json();
        setQuestion("");
        setFeedback("");
        setStarted(false);
        onFinish(reportData.report);
      } else if (data.nextQuestion) {
        const qRes = await fetch(`${API_URL}/api/next-question`);
        const qData = await qRes.json();
        setQuestion(qData.question);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="interview-screen">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <div className="card">
        <h2>Interview Practice</h2>
        {!started && (
          <>
            <button onClick={startInterview} disabled={loading}>
              {loading ? <span className="spinner"></span> : "🎯 Start Interview"}
            </button>
            {loading && (
              <p className="loading-hint">First load can take 20-30 seconds while the AI wakes up ⏳</p>
            )}
          </>
        )}
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
              {loading ? <span className="spinner"></span> : "📤 Submit Answer"}
            </button>
            {feedback && (
              <div className={`feedback-box feedback-${feedbackType}`}>
                <h3>💡 AI Feedback</h3>
                <p>{feedback}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Interview;