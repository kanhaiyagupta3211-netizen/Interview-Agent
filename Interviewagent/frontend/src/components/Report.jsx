function formatReportText(text) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("### ")) {
      return <h3 key={i}>{trimmed.replace("### ", "")}</h3>;
    }
    if (trimmed.startsWith("## ")) {
      return <h2 key={i}>{trimmed.replace("## ", "")}</h2>;
    }
    if (trimmed === "---") {
      return <hr key={i} />;
    }
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      return <li key={i}>{renderBold(trimmed.slice(2))}</li>;
    }
    if (trimmed === "") {
      return null;
    }
    return <p key={i}>{renderBold(trimmed)}</p>;
  });
}

function renderBold(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      part
    )
  );
}

function Report({ reportText, onBack }) {
  return (
    <div className="report-screen">
      <button className="back-btn" onClick={onBack}>← Back to Home</button>
      <div className="card report-card">
        <h2>🎉 Interview Completed!</h2>
        <div className="report-content">
          {formatReportText(reportText)}
        </div>
      </div>
    </div>
  );
}

export default Report;