// ============================================
// routes/doubtRoutes.js - Doubt API Routes
// ============================================
// Maps HTTP endpoints to controller functions.
// All routes here are prefixed with /api/doubts
// (as configured in index.js).
//
// Route Summary:
//   POST   /api/doubts/analyze-image      → Extract question from uploaded image
//   POST   /api/doubts/ask                → Ask a new doubt (text or with image)
//   POST   /api/doubts/:id/followup       → Ask a follow-up on an existing doubt
//   GET    /api/doubts/history            → Get all past doubts (with filters)
//   GET    /api/doubts/:id                → Get a single doubt by its ID
//   PATCH  /api/doubts/:id/helpful        → Rate whether the answer was helpful
//   DELETE /api/doubts/:id                → Delete a doubt
// ============================================

const express = require("express");
const router = express.Router();

// Import multer upload middleware for image uploads
const upload = require("../middleware/upload");

// Import all controller functions
const {
  analyzeImage,
  askDoubt,
  askFollowUp,
  getHistory,
  getDoubtById,
  markHelpful,
  deleteDoubt,
} = require("../controllers/doubtController");

// ---- AI Routes ----

// Analyze an image to extract a question from it
// Accepts: multipart/form-data with field name "image"
router.post("/analyze-image", upload.single("image"), analyzeImage);

// Ask a new doubt (submit question text + optional subject/imageUrl)
router.post("/ask", askDoubt);

// Ask a follow-up question on an existing doubt
router.post("/:id/followup", askFollowUp);

// ---- Data Routes ----

// Get all saved doubts (supports ?subject=, ?difficulty=, ?search= filters)
router.get("/history", getHistory);

// Get a single doubt with full details + follow-ups
router.get("/:id", getDoubtById);

// Mark whether the AI answer was helpful
router.patch("/:id/helpful", markHelpful);

// Delete a doubt permanently
router.delete("/:id", deleteDoubt);

module.exports = router;
