// ============================================
// 1. Packages Import
// ============================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

// ============================================
// 2. Server Setup
// ============================================
const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// ============================================
// 3. Gemini AI Setup (AQ. Key Support)
// ============================================
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = "gemini-3.1-flash-lite";

// ============================================
// 4. Interview Memory
// ============================================
let interviewState = {
  questions: [],
  currentIndex: 0,
  answers: []
};

// ============================================
// 5. Generate Questions
// ============================================
app.post('/api/generate-questions', async (req, res) => {
  try {
    const { topic, level } = req.body;
    console.log("📝 Generating questions for:", topic, level);

    const prompt = `Generate 5 ${level} level interview questions about ${topic}. Return ONLY the questions numbered 1 to 5.`;
    const result = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });
    const text = result.text;
    console.log("📄 Raw response:", text);

    const questions = text.split('\n').filter(q => q.trim().length > 0).map(q => q.replace(/^\d+\.\s*/, '')).filter(q => q.trim().length > 0);

    if (questions.length === 0) throw new Error("No questions generated");

    interviewState.questions = questions;
    interviewState.currentIndex = 0;
    interviewState.answers = [];

    res.json({ questions, total: questions.length });
    console.log("✅ Questions generated:", questions.length);
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// 6. Next Question
// ============================================
app.get('/api/next-question', (req, res) => {
  try {
    if (interviewState.currentIndex < interviewState.questions.length) {
      res.json({
        question: interviewState.questions[interviewState.currentIndex],
        index: interviewState.currentIndex,
        total: interviewState.questions.length
      });
    } else {
      res.json({ message: "Interview complete!", done: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// 7. Submit Answer
// ============================================
app.post('/api/submit-answer', async (req, res) => {
  try {
    const { answer } = req.body;
    if (!answer || answer.trim() === '') {
      return res.status(400).json({ error: 'Answer is required' });
    }

    const currentQ = interviewState.questions[interviewState.currentIndex];
    interviewState.answers.push({ question: currentQ, answer });
    interviewState.currentIndex++;

    const feedbackPrompt = `Give 2-line feedback on this answer:\nQuestion: ${currentQ}\nAnswer: ${answer}`;
    const fbResult = await ai.models.generateContent({
      model: MODEL,
      contents: feedbackPrompt,
    });
    const feedback = fbResult.text;

    const done = interviewState.currentIndex >= interviewState.questions.length;
    res.json({ feedback, nextQuestion: !done, done });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// 8. Final Report
// ============================================
app.get('/api/report', async (req, res) => {
  try {
    if (interviewState.answers.length === 0) {
      return res.status(400).json({ error: 'No answers to generate report' });
    }

    const transcript = interviewState.answers.map((a, i) => `Q${i+1}: ${a.question}\nA: ${a.answer}`).join('\n\n');
    const reportPrompt = `Generate interview report with:\n1. Score/10\n2. Top 3 strengths\n3. Top 3 improvements\n4. Recommendation\n\nTranscript:\n${transcript}`;

    const rResult = await ai.models.generateContent({
      model: MODEL,
      contents: reportPrompt,
    });
    res.json({ report: rResult.text });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// 9. Server Start
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API URL: http://localhost:${PORT}/api`);
});