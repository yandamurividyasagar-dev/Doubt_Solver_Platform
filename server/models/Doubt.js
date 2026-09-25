// ============================================
// models/Doubt.js - Doubt Database Schema
// ============================================
// Defines what a "Doubt" record looks like in MongoDB.
// Every time a user asks a question, a Doubt document
// is created and saved here.
//
// Fields:
//   - question    : The user's original question text
//   - imageUrl    : Optional image attached to the doubt
//   - subject     : Subject/topic category (e.g., Math, Science)
//   - answer      : The AI-generated answer
//   - explanation : Step-by-step breakdown from AI
//   - difficulty  : Estimated difficulty level of the question
//   - tags        : Auto-detected topic tags for filtering
//   - createdAt   : Auto-managed timestamp (via mongoose timestamps)
// ============================================

const mongoose = require("mongoose");

const doubtSchema = new mongoose.Schema(
  {
    // The original question submitted by the user
    question: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional: URL or base64 of an image attached with the question
    // (e.g., a photo of a textbook problem or whiteboard)
    imageUrl: {
      type: String,
      default: null,
    },

    // Subject/topic area (e.g., "Mathematics", "Physics", "History")
    subject: {
      type: String,
      trim: true,
      default: "General",
    },

    // The main AI-generated answer to the question
    answer: {
      type: String,
      required: true,
    },

    // Detailed step-by-step explanation from AI
    explanation: {
      type: String,
      default: "",
    },

    // Estimated difficulty level of the doubt
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },

    // Auto-detected topic tags (for filtering/search)
    tags: [
      {
        type: String,
      },
    ],

    // Whether the user marked this answer as helpful
    isHelpful: {
      type: Boolean,
      default: null, // null = not yet rated
    },

    // Follow-up questions (if user asked for clarification)
    followUps: [
      {
        question: { type: String },
        answer: { type: String },
        askedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Doubt", doubtSchema);
