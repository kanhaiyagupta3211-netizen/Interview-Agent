import { useState } from "react";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const startInterview = () => {
    setQuestion("Tell me about yourself.");
    setAnswer("");
  };
  const handleSubmit = async () => {
  if (!answer.trim()) {
    alert("Please enter an answer first.");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5001/api/submit-answer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answer }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to submit answer");
    }

    setFeedback(data.feedback || "");
    setAnswer("");

    if (data.nextQuestion) {
      setQuestion(data.nextQuestion);
    }

    if (data.done) {
      alert("Interview completed!");
    }
  } catch (error) {
    console.error("Submit error:", error);
    alert("Could not submit answer: " + error.message);
  }
};

  return (
    <div className="app">
      <header>
        <h1>AI Interview Agent</h1>
        <p>Practice your interview with an AI assistant</p>
      </header>

      <main>
        <div className="card">
          <h2>Interview Practice</h2>

          <button onClick={startInterview}>
            Start Interview
          </button>

          {question && (
            <div className="question-box">
              <h3>Question</h3>
              <p>{question}</p>

              <textarea
                placeholder="Type your answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />

              <button onClick={handleSubmit}>Submit Answer</button>
              {feedback && (
  <div className="feedback-box">
    <h3>AI Feedback</h3>
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