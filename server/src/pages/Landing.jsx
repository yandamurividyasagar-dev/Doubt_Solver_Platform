// ============================================
// Landing.jsx - Public Marketing Page
// ============================================
// Shown to unauthenticated users at route "/".
// Displays hero, feature cards, CTA, and footer.
// No TODOs — this page is fully provided.
// ============================================

import { Link } from 'react-router-dom';
import { Brain, MessageSquare, Image, Mic, BookOpen, Zap, Shield, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: <MessageSquare className="w-6 h-6 text-blue-500" />,
    title: 'Text Doubts',
    desc: 'Type any question and get instant, detailed explanations from your AI tutor.',
  },
  {
    icon: <Image className="w-6 h-6 text-purple-500" />,
    title: 'Image Doubts',
    desc: 'Upload photos of problems, diagrams, or equations. Vision AI analyzes them instantly.',
  },
  {
    icon: <Mic className="w-6 h-6 text-green-500" />,
    title: 'Voice Doubts',
    desc: 'Record your question and our AI transcribes and answers it in seconds.',
  },
  {
    icon: <BookOpen className="w-6 h-6 text-orange-500" />,
    title: 'All Subjects',
    desc: 'Math, Physics, Chemistry, Biology, History, English, and more — all in one place.',
  },
  {
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    title: 'Instant Answers',
    desc: 'No waiting. Get step-by-step solutions in seconds powered by Groq LLaMA.',
  },
  {
    icon: <Shield className="w-6 h-6 text-red-500" />,
    title: 'Chat History',
    desc: 'All your doubts are saved. Review previous conversations anytime.',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-gray-900">AI Doubt Solver</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2">
            Login
          </Link>
          <Link to="/register" className="btn-primary text-sm px-5 py-2">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-20 px-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <Zap className="w-4 h-4" />
          Powered by Groq LLaMA & AssemblyAI
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Your Personal AI Tutor <br />
          <span className="text-blue-600">Available 24/7</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Ask doubts via text, image, or voice. Get instant step-by-step explanations
          for any subject. Perfect for students from Grade 8 to College.
        </p>
        <div className="flex items-center gap-4 justify-center flex-wrap">
          <Link to="/register" className="btn-primary text-base px-8 py-3">
            Start Solving Doubts
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/login" className="btn-secondary text-base px-8 py-3">
            Sign In
          </Link>
        </div>

        {/* Demo preview */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="text-xs text-gray-400 ml-2">AI Doubt Solver Chat</span>
          </div>
          <div className="space-y-3 text-left">
            <div className="flex justify-end">
              <div className="bg-blue-600 text-white rounded-2xl rounded-br-sm px-4 py-2 text-sm max-w-xs">
                What is the quadratic formula and how do I use it?
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4 text-blue-600" />
              </div>
              <div className="bg-gray-50 rounded-2xl rounded-bl-sm px-4 py-2 text-sm text-gray-700 max-w-sm">
                The quadratic formula is: <strong>x = (-b ± √(b²-4ac)) / 2a</strong>
                <br /><br />
                For ax² + bx + c = 0, simply substitute the values of a, b, and c...
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Everything You Need to Clear Doubts
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-xl mx-auto">
          Multiple input methods, all subjects, instant AI-powered answers.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="card hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center">
        <div className="bg-blue-600 rounded-2xl py-12 px-6 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to ace your exams?</h2>
          <p className="text-blue-100 mb-6">Join students already using AI to clear their doubts instantly.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Create Free Account
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500 border-t border-gray-100">
        Built with React, Node.js, MongoDB, Groq LLaMA & AssemblyAI
      </footer>
    </div>
  );
}
