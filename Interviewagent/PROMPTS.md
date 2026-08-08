# PROMPTS.md — AI Interview Agent

## Project
AI-powered mock interview platform built for CodeFusion Hackathon — Problem Statement #2: "The Interview Agent."

## AI Tools Used
- **Google Gemini API** (`gemini-3.1-flash-lite`) — powers the interviewer: generates questions, analyses answers, gives feedback, and produces the final report.
- **Claude (Anthropic)** — used to debug backend/API issues, fix deployment configuration (Render + Vercel), and set up environment variables securely.

## Core Prompts Sent to Gemini

### 1. Question Generation
```
Generate 5 {level} level interview questions about {topic}. Return ONLY the questions numbered 1 to 5.
```
Used in `/api/generate-questions` to dynamically create a question set based on the candidate's chosen topic and difficulty level.

### 2. Answer Feedback
```
Give 2-line feedback on this answer:
Question: {question}
Answer: {answer}
```
Used in `/api/submit-answer` right after each answer is submitted, so the candidate gets instant, targeted feedback like a real interviewer would give.

### 3. Final Report Generation
```
Generate interview report with:
1. Score/10
2. Top 3 strengths
3. Top 3 improvements
4. Recommendation

Transcript:
{full Q&A transcript}
```
Used in `/api/report` after all questions are answered, to produce a structured, holistic evaluation instead of just a list of individual answers.

## How This Solves the Problem Statement
Instead of a static quiz form, the app behaves like an interviewer: it asks questions one at a time, reacts to each answer with feedback before moving on, and synthesizes the whole conversation into one final evaluation — mirroring how a real interview unfolds.

## Debugging Notes (for transparency)
- Initial setup used a deprecated Gemini SDK (`@google/generative-ai`) and a retired model (`gemini-1.5-flash`), which caused silent failures. Migrated to the current `@google/genai` SDK and an active model (`gemini-3.1-flash-lite`).
- Used Claude to identify and fix a GitHub secret-scanning block caused by an accidentally committed `.env` file, and to configure environment variables correctly on Render (backend) and Vercel (frontend).