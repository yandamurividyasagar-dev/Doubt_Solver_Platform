# AI Doubt Solver — Exam-Focused AI Tutor for GATE, IIT JAM, JEE, NEET, CBSE/ICSE & Government Exams

> Ask a doubt by typing, snapping a photo, or speaking it — get back a step-by-step, exam-focused answer that names the formula, flags the negative-marking traps, and tells you the fastest correct method. Built for Indian competitive exam aspirants.

---

## 🚀 Live Demo

**[➜ Try it live → aidoubtsolver.in](https://aidoubtsolver.in)**

> No installation needed. Register with an email and password, and start asking doubts instantly.

---

## Demo Video

https://github.com/user-attachments/assets/PASTE-YOUR-VIDEO-ASSET-ID-HERE

---

## The Problem That Started This

I kept seeing the same pattern with friends prepping for GATE and government exams: a doubt hits at 1 a.m. the night before a mock test, the coaching class doesn't meet again until next week, and Google returns a generic textbook explanation instead of "here's why option B is wrong too." Competitive exams punish that gap — negative marking means a half-understood concept costs you more than a skipped question.

So I built AI Doubt Solver — a full-stack app that answers doubts the way an exam-focused mentor would: step-by-step, aware of whether the question is MCQ/MSQ/NAT, and blunt about the traps that cost marks.

---

## The Help-When-You-Need-It Gap

Having a doubt ≠ Getting it solved, especially at 1 a.m. before an exam.

| Approach | Limitation |
|---|---|
| Searching online | Generic explanations, no exam-format awareness (MCQ vs MSQ vs NAT) |
| Coaching class doubt sessions | Fixed schedule, once a week at best |
| Asking classmates | They're often stuck on the same doubt |
| Generic AI chatbots | Don't read circuit diagrams/handwriting, no negative-marking awareness |

---

## What You Can Do With It

- **Ask by Text** — Type a doubt from any subject and get a step-by-step, exam-style answer.
- **Ask by Photo** — Snap a circuit diagram, a handwritten note, or a textbook numerical; vision AI reads and solves it.
- **Ask by Voice** — Record the doubt out loud (English or Hindi-English mixed); it's transcribed and answered automatically.
- **Exam-Aware Answers** — Every response identifies MCQ / MSQ / Numerical Answer Type framing and explains why the *other* options are wrong, not just the right one.
- **Subject Auto-Detection** — A lightweight local keyword detector tags the subject instantly, with zero extra API calls.
- **Chat History** — Every conversation is saved to MongoDB, grouped by subject, and revisitable anytime.
- **Markdown Answers** — Responses render with headings, bullet points, and syntax-highlighted code blocks.
- **JWT Authentication** — Secure register/login with bcrypt password hashing.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework with a fast dev server |
| React Router v7 | Client-side routing |
| Tailwind CSS | Utility-first styling |
| Axios | HTTP client with automatic JWT attachment |
| React Markdown + remark-gfm | Renders AI answers with GitHub-flavored markdown |
| React Syntax Highlighter | Syntax-highlighted code blocks in answers |
| React Hot Toast | Notifications |
| Lucide React | Icons |
| MediaRecorder API (native) | In-browser voice recording, no extra library needed |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Users, chats, and embedded message history |
| Groq SDK | Powers text and vision doubt-solving |
| AssemblyAI | Speech-to-text for voice doubts (auto language detection) |
| JSON Web Tokens | Stateless authentication |
| bcryptjs | Password hashing |
| Multer | Image and audio upload handling |
| Helmet + Morgan | Security headers and request logging |
| express-async-errors | Cleaner async error handling in routes |

### AI Models (via Groq)
| Model | Used For |
|---|---|
| `openai/gpt-oss-120b` | Text and voice-doubt answers |
| `qwen/qwen3.8-27b` | Image/vision doubt answers (diagrams, handwriting, equations) |

---

## Project Structure

```
Doubt_Solver_Platform/
├── client/                        # React frontend
│   └── src/
│       ├── components/
│       │   ├── Chat/               # MessageBubble, VoiceInput, InputArea
│       │   ├── Layout/              # Navbar
│       │   └── common/              # LoadingSpinner
│       ├── context/                 # AuthContext, ChatContext
│       ├── pages/                   # Landing, Login, Register, Dashboard, ChatPage
│       └── services/                 # api.js — Axios instance + JWT interceptor
│
└── server/                        # Express backend
    └── src/ ... (config, controllers, middleware, models, routes, services)
        ├── config/                  # db.js — MongoDB connection
        ├── models/                  # User.js, Chat.js
        ├── controllers/              # authController.js, chatController.js
        ├── middleware/                # auth.js (JWT guard), upload.js (Multer)
        ├── routes/                   # authRoutes.js, chatRoutes.js
        └── services/                  # geminiService.js (Groq), speechService.js (AssemblyAI)
```

---

## Running It Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier is fine)
- Groq API key → [console.groq.com/keys](https://console.groq.com/keys)
- AssemblyAI API key → [assemblyai.com](https://www.assemblyai.com/)

---

### 1. Clone the repo

```bash
git clone https://github.com/yandamurividyasagar-dev/Doubt_Solver_Platform.git
cd Doubt_Solver_Platform
```

---

### 2. Backend setup

```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
GROQ_API_KEY=your_groq_api_key
ASSEMBLYAI_API_KEY=your_assemblyai_api_key
NODE_ENV=development
```

```bash
npm run dev
```

If everything is connected, you'll see:
```
MongoDB Connected: cluster0.xxxxx.mongodb.net
Server running on port 5000
```

---

### 3. Frontend setup

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

Visit **http://localhost:5173** and you're good to go.

---

## API Endpoints

All `/chats` routes require `Authorization: Bearer <token>` in the request header.

### Authentication
| Method | Endpoint | What It Does |
|---|---|---|
| POST | `/api/auth/register` | Create account with name, email, password, grade, subjects |
| POST | `/api/auth/login` | Login with email and password |
| GET | `/api/auth/me` | Get current logged-in user's profile |

### Chats & Doubts
| Method | Endpoint | Request Body |
|---|---|---|
| GET | `/api/chats` | — Fetch all chats (summaries + last message) |
| GET | `/api/chats/stats` | — Total chats, doubts solved, subjects covered |
| POST | `/api/chats` | — Create a new chat |
| GET | `/api/chats/:id` | — Fetch a single chat with full message history |
| DELETE | `/api/chats/:id` | — Delete a chat |
| POST | `/api/chats/:id/text` | `{ question, subject }` |
| POST | `/api/chats/:id/image` | `multipart/form-data` — image file + question |
| POST | `/api/chats/:id/voice` | `multipart/form-data` — audio file |

---

## How a Doubt Gets Solved

```
Student types / photographs / records a doubt
        ↓
Frontend sends it (with JWT) to POST /api/chats/:id/{text|image|voice}
        ↓
Auth middleware verifies the token
        ↓
Voice input → AssemblyAI transcribes audio to text first
        ↓
Local keyword detector tags the subject (zero API calls)
        ↓
Groq (text model or vision model) generates a step-by-step,
exam-aware answer using the tutor system prompt
        ↓
User + assistant messages saved to the chat in MongoDB
        ↓
User's total-doubts counter incremented atomically
        ↓
Answer streamed back and rendered as Markdown in the chat
```

---

## How Auth Works

```
User registers or logs in
        ↓
Password hashed with bcrypt before save (Mongoose pre-save hook)
        ↓
JWT issued on successful login
        ↓
Token stored in localStorage
        ↓
Axios interceptor auto-attaches token to every request
        ↓
Auth middleware validates token on every protected route
        ↓
On 401, response interceptor force-logs-out the user
```

---

## What Makes the Answers Different

- **Exam-format aware** — every answer identifies whether a question reads like an MCQ, MSQ, or Numerical Answer Type, and explains why the *wrong* options are wrong (option elimination is a real exam skill).
- **Negative-marking conscious** — the tutor prompt is written to flag sign errors, unit mismatches, and other trap answers that cost marks under negative marking.
- **Fastest-correct-method first** — favors the quickest valid approach over the most exhaustive derivation, because these students are working against a clock.
- **Covers real syllabi** — GATE (CS, EC, EE, ME, CE), IIT JAM (Physics, Chemistry, Maths), JEE, NEET, CBSE/ICSE boards, and government exam sections (Aptitude, Reasoning, General Awareness).

---

## Things I Want to Add Next

- Export a solved doubt as a PDF for offline revision
- Bookmark important answers for quick re-access before an exam
- Subject-wise filtering on the dashboard
- A quiz mode that generates practice MCQs/MSQs/NATs on a chosen topic and grades the attempt

---

## Author

Built by **Vidya Sagar Yandamuri**

If this project helped you or impressed you, drop a ⭐ — it genuinely motivates me to keep building.

[![GitHub](https://img.shields.io/badge/GitHub-yandamurividyasagar--dev-black?style=flat&logo=github)](https://github.com/yandamurividyasagar-dev)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-aidoubtsolver.in-brightgreen?style=flat&logo=render)](https://aidoubtsolver.in)
