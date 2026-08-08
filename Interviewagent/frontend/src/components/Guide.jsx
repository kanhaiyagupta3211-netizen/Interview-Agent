function Guide({ onBack }) {
  const tips = [
    {
      icon: "🎯",
      title: "Understand the Question First",
      desc: "Don't rush into answering. Take a moment to fully understand what's being asked before you respond."
    },
    {
      icon: "🗣️",
      title: "Think Out Loud",
      desc: "Interviewers value your thought process as much as the final answer. Explain your reasoning as you go."
    },
    {
      icon: "📐",
      title: "Structure Your Answers",
      desc: "Use frameworks like STAR (Situation, Task, Action, Result) for behavioral questions to keep answers organized."
    },
    {
      icon: "💡",
      title: "Use Concrete Examples",
      desc: "Back up your points with real examples from your experience — it's more convincing than general statements."
    },
    {
      icon: "❓",
      title: "It's Okay to Ask Questions",
      desc: "If something is unclear, ask for clarification. It shows engagement, not weakness."
    },
    {
      icon: "⏱️",
      title: "Practice Concise Answers",
      desc: "Avoid rambling. Aim for clear, focused answers — you can always elaborate if asked to."
    },
    {
      icon: "🧘",
      title: "Stay Calm Under Pressure",
      desc: "It's normal to not know something. Stay composed, and walk through what you do know."
    },
    {
      icon: "🔁",
      title: "Learn From Feedback",
      desc: "Use the AI feedback after each answer to spot patterns in what you can improve for next time."
    }
  ];

  return (
    <div className="guide-screen">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <h2>📘 Interview Tips & Guide</h2>
      <p className="guide-subtitle">A few things to keep in mind before you start</p>
      <div className="tips-grid">
        {tips.map((tip, i) => (
          <div className="tip-card" key={i}>
            <span className="tip-icon">{tip.icon}</span>
            <h3>{tip.title}</h3>
            <p>{tip.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Guide;