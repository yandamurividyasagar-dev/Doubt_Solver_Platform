// ============================================
// config/gemini.js - Groq AI Client Setup
// ============================================
// Initializes the Groq SDK client with your API key.
// This client is imported wherever we need to call
// the AI to analyze or answer doubt questions.
//
// How it works:
//   - Reads GROQ_API_KEY from your .env file
//   - Creates a Groq client instance
//   - Exports it so controllers can use it
// ============================================

const Groq = require("groq-sdk");

// Create the Groq client using your API key
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

module.exports = { groq };
