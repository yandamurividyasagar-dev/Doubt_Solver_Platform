// ============================================
// controllers/doubtController.js - Doubt Controller
// ============================================
// Handles all HTTP requests related to doubts.
// Each function corresponds to one API endpoint.
//
// Flow: Route → Controller → (Groq AI + MongoDB)
//
// Endpoints handled here:
//   POST   /api/doubts/ask           → Submit a question (text or image)
//   POST   /api/doubts/analyze-image → Extract question from an image
//   POST   /api/doubts/:id/followup  → Ask a follow-up question
//   GET    /api/doubts/history       → Get all past doubts
//   GET    /api/doubts/:id           → Get a single doubt by ID
//   PATCH  /api/doubts/:id/helpful   → Mark answer as helpful/not helpful
//   DELETE /api/doubts/:id           → Delete a saved doubt
// ============================================

const { groq } = require("../config/gemini");
const Doubt = require("../models/Doubt");

// ============================================
// analyzeImage
// POST /api/doubts/analyze-image
// ============================================
// Accepts an uploaded image and uses Groq Vision
// to extract the question or problem from it.
// Returns the extracted question text.
const analyzeImage = async (req, res) => {
  try {
    // Make sure an image file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    // Convert image buffer to base64 (required by Groq Vision API)
    const base64Image = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype;

    // Call Groq Vision model to extract the question from the image
    const response = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
            {
              type: "text",
              text: 'Analyze this image carefully. Extract the question, problem, or doubt shown in this image. Return ONLY a JSON object: {"question": "the extracted question", "subject": "detected subject like Math/Physics/Chemistry/Biology/History/etc", "hasEquation": true/false}. If no question is visible, set question to an empty string.',
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const text = response.choices[0].message.content;

    // Parse the JSON response from AI
    const jsonMatch = text.match(/\{[\s\S]*?\}/);
    let result = { question: "", subject: "General", hasEquation: false };

    if (jsonMatch) {
      try {
        result = JSON.parse(jsonMatch[0]);
      } catch {
        result.question = text;
      }
    }

    res.json({ ...result, rawResponse: text });
  } catch (error) {
    console.error("Image analysis error:", error);
    res.status(500).json({ error: "Failed to analyze image" });
  }
};

// ============================================
// askDoubt
// POST /api/doubts/ask
// ============================================
// Accepts a question (and optional image/subject)
// and uses the Groq AI to generate a detailed answer
// with step-by-step explanation.
// Saves the doubt + answer to MongoDB.
const askDoubt = async (req, res) => {
  try {
    const { question, subject, imageUrl } = req.body;

    // Validate that a question was provided
    if (!question || question.trim() === "") {
      return res.status(400).json({ error: "A question is required" });
    }

    // Build the AI prompt — tailor it to the detected subject
    const subjectContext = subject && subject !== "General"
      ? `This question is from the subject: ${subject}.`
      : "";

    const prompt = `You are an expert academic tutor. A student has the following doubt:

"${question}"

${subjectContext}

Please provide a thorough, student-friendly answer. Return ONLY valid JSON (no markdown) in this format:
{
  "answer": "Clear, direct answer to the question",
  "explanation": "Detailed step-by-step explanation or breakdown",
  "difficulty": "Easy | Medium | Hard",
  "tags": ["topic1", "topic2", "topic3"],
  "subject": "detected subject",
  "tips": ["helpful tip 1", "helpful tip 2"]
}`;

    // Call Groq AI to generate the answer
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500,
    });

    const text = response.choices[0].message.content;

    // Extract the JSON response from AI output
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ error: "Failed to parse AI response" });
    }

    const aiResult = JSON.parse(jsonMatch[0]);

    // Save the doubt and AI answer to the database
    const doubt = new Doubt({
      question,
      imageUrl: imageUrl || null,
      subject: aiResult.subject || subject || "General",
      answer: aiResult.answer,
      explanation: aiResult.explanation,
      difficulty: aiResult.difficulty || "Medium",
      tags: aiResult.tags || [],
    });

    const saved = await doubt.save();

    res.status(201).json({ doubt: saved, tips: aiResult.tips });
  } catch (error) {
    console.error("Ask doubt error:", error);
    res.status(500).json({ error: "Failed to process your doubt" });
  }
};

// ============================================
// askFollowUp
// POST /api/doubts/:id/followup
// ============================================
// Allows the user to ask a follow-up or clarification
// question on an existing doubt.
// The AI gets the context of the original question + answer.
const askFollowUp = async (req, res) => {
  try {
    const { question } = req.body;
    const doubtId = req.params.id;

    if (!question || question.trim() === "") {
      return res.status(400).json({ error: "A follow-up question is required" });
    }

    // Fetch the original doubt for context
    const doubt = await Doubt.findById(doubtId);
    if (!doubt) {
      return res.status(404).json({ error: "Doubt not found" });
    }

    // Build the AI prompt with full context
    const prompt = `You are an expert academic tutor. A student previously asked:

Original question: "${doubt.question}"
Your previous answer: "${doubt.answer}"

Now the student has a follow-up question:
"${question}"

Please provide a clear and concise answer to the follow-up. Return only plain text (no JSON).`;

    // Call Groq AI
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 800,
    });

    const followUpAnswer = response.choices[0].message.content;

    // Append the follow-up Q&A to the doubt record
    doubt.followUps.push({ question, answer: followUpAnswer });
    await doubt.save();

    res.json({ question, answer: followUpAnswer });
  } catch (error) {
    console.error("Follow-up error:", error);
    res.status(500).json({ error: "Failed to process follow-up question" });
  }
};

// ============================================
// getHistory
// GET /api/doubts/history
// ============================================
// Returns all past doubts, sorted by most recent.
// Supports optional query filters: subject, difficulty, search
const getHistory = async (req, res) => {
  try {
    const { subject, difficulty, search } = req.query;

    // Build a filter object based on query params
    const filter = {};

    if (subject) filter.subject = subject;
    if (difficulty) filter.difficulty = difficulty;
    if (search) filter.question = { $regex: search, $options: "i" };

    // Fetch doubts from DB, newest first
    const doubts = await Doubt.find(filter).sort({ createdAt: -1 });
    res.json(doubts);
  } catch (error) {
    console.error("Get history error:", error);
    res.status(500).json({ error: "Failed to fetch doubt history" });
  }
};

// ============================================
// getDoubtById
// GET /api/doubts/:id
// ============================================
// Returns a single doubt and all its details
// including follow-ups.
const getDoubtById = async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) {
      return res.status(404).json({ error: "Doubt not found" });
    }
    res.json(doubt);
  } catch (error) {
    console.error("Get doubt error:", error);
    res.status(500).json({ error: "Failed to fetch doubt" });
  }
};

// ============================================
// markHelpful
// PATCH /api/doubts/:id/helpful
// ============================================
// Lets the user mark whether the AI answer was helpful.
// Stores true or false on the doubt record.
const markHelpful = async (req, res) => {
  try {
    const { isHelpful } = req.body;

    if (typeof isHelpful !== "boolean") {
      return res.status(400).json({ error: "isHelpful must be true or false" });
    }

    const doubt = await Doubt.findByIdAndUpdate(
      req.params.id,
      { isHelpful },
      { new: true }
    );

    if (!doubt) {
      return res.status(404).json({ error: "Doubt not found" });
    }

    res.json({ message: "Feedback saved", doubt });
  } catch (error) {
    console.error("Mark helpful error:", error);
    res.status(500).json({ error: "Failed to update feedback" });
  }
};

// ============================================
// deleteDoubt
// DELETE /api/doubts/:id
// ============================================
// Permanently deletes a doubt from the database.
const deleteDoubt = async (req, res) => {
  try {
    const doubt = await Doubt.findByIdAndDelete(req.params.id);
    if (!doubt) {
      return res.status(404).json({ error: "Doubt not found" });
    }
    res.json({ message: "Doubt deleted successfully" });
  } catch (error) {
    console.error("Delete doubt error:", error);
    res.status(500).json({ error: "Failed to delete doubt" });
  }
};

module.exports = {
  analyzeImage,
  askDoubt,
  askFollowUp,
  getHistory,
  getDoubtById,
  markHelpful,
  deleteDoubt,
};
