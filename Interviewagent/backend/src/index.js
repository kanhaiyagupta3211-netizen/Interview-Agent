require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

let interviewState = {
  questions: [],
  currentIndex: 0,
  answers: []
};

// Generate Questions
app.post('/api/generate-questions', async (req, res) => {
  try {
    const { topic, level } = req.body;
    const prompt = `You are a technical interviewer. Generate 5 ${level} level interview questions about ${topic}. Return only the questions, numbered 1 to 5.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const questions = text.split('\n').filter(q => q.trim().length > 0).map(q => q.replace(/^\d+\.\s*/, ''));
    interviewState.questions = questions;
    interviewState.currentIndex = 0;
    interviewState.answers = [];
    res.json({ questions, total: questions.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Next Question
app.get('/api/next-question', (req, res) => {
  if (interviewState.currentIndex < interviewState.questions.length) {
    const question = interviewState.questions[interviewState.currentIndex];
    res.json({ question, index: interviewState.currentIndex, total: interviewState.questions.length });
  } else {
    res.json({ message: "Interview complete!", done: true });
  }
});

// Submit Answer
app.post('/api/submit-answer', async (req, res) => {
  try {
    const { answer } = req.body;
    interviewState.answers.push({
      question: interviewState.questions[interviewState.currentIndex],
      answer: answer
    });
    interviewState.currentIndex++;
    const question = interviewState.questions[interviewState.currentIndex - 1];
    const feedbackPrompt = `You are an interview coach. Give constructive feedback (2-3 lines) on this answer:\nQuestion: ${question}\nAnswer: ${answer}\nFeedback:`;
    const feedbackResult = await model.generateContent(feedbackPrompt);
    const feedbackResponse = await feedbackResult.response;
    const feedback = feedbackResponse.text();
    res.json({
      feedback,
      nextQuestion: interviewState.currentIndex < interviewState.questions.length,
      done: interviewState.currentIndex >= interviewState.questions.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Final Report
app.get('/api/report', async (req, res) => {
  try {
    const transcript = interviewState.answers.map((item, idx) => {
      return `Q${idx + 1}: ${item.question}\nA: ${item.answer}`;
    }).join('\n\n');
    const reportPrompt = `Based on this interview transcript, generate a brief report with:\n1. Overall score (out of 10)\n2. Top 3 strengths\n3. Top 3 areas for improvement\n4. Final recommendation\n\nTranscript:\n${transcript}`;
    const reportResult = await model.generateContent(reportPrompt);
    const reportResponse = await reportResult.response;
    const report = reportResponse.text();
    res.json({ report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});