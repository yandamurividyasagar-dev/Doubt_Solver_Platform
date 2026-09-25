// ============================================
// index.js - Entry Point
// ============================================
// This is where the server starts. It:
//   1. Loads environment variables from .env
//   2. Connects to MongoDB
//   3. Starts the Express server on the given PORT
// ============================================

// Load environment variables FIRST (before anything else uses them)
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

// Import database connection helper
const connectDB = require("./config/db");

// Import all API routes
const doubtRoutes = require("./routes/doubtRoutes");

// ---- Create the Express App ----
const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// STEP 1: Connect to MongoDB
// ============================================
// Wait for database to connect before handling requests
connectDB();

// ============================================
// MIDDLEWARE (runs on every incoming request)
// ============================================

// 1. CORS: Allow the React frontend to talk to this backend
//    Without this, browsers will block cross-origin requests
app.use(cors());

// 2. Body Parser: Parse incoming JSON request bodies
//    10mb limit to handle base64-encoded images in doubt submissions
app.use(express.json({ limit: "10mb" }));

// 3. URL-encoded body parser (for form submissions)
app.use(express.urlencoded({ extended: true }));

// ============================================
// ROUTES
// ============================================

// Mount all doubt-related routes under /api/doubts
// /api/doubts/ask        → Submit a new doubt question
// /api/doubts/history    → Get past doubts
// /api/doubts/:id        → Get a specific doubt by ID
app.use("/api/doubts", doubtRoutes);

// ============================================
// HEALTH CHECK
// ============================================
// Simple endpoint to verify the server is running
app.get("/api/health", (req, res) => {
  res.json({ status: "AI Doubt Solver server is running", timestamp: new Date() });
});

// ============================================
// GLOBAL ERROR HANDLER (must be AFTER routes)
// ============================================
// Catches any errors thrown by route handlers
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Something went wrong!" });
});

// ---- Start Listening for Requests ----
app.listen(PORT, () => {
  console.log(`\n AI Doubt Solver server running on port ${PORT}`);
  console.log(` URL: http://localhost:${PORT}\n`);
});
