// ============================================
// Landing.jsx - Public Marketing Page
// ============================================
// Shown to unauthenticated users at route "/".
// Displays hero, feature cards, CTA, and footer.
// ============================================

import { Link } from 'react-router-dom';
import { Brain, MessageSquare, Image, Mic, BookOpen, Zap, Shield, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: 'Text Doubts',
    desc: 'Type any question and get instant, detailed explanations from your AI tutor.',
  },
  {
    icon: <Image className="w-5 h-5" />,
    title: 'Image Doubts',
    desc: 'Upload photos of problems, diagrams, or equations. Vision AI analyzes them instantly.',
  },
  {
    icon: <Mic className="w-5 h-5" />,
    title: 'Voice Doubts',
    desc: 'Record your question and our AI transcribes and answers it in seconds.',
  },
  {
    icon: <BookOpen className="w-5 h-5" />,
    title: 'All Subjects',
    desc: 'Math, Physics, Chemistry, Biology, History, English, and more — all in one place.',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Instant Answers',
    desc: 'No waiting. Get step-by-step solutions in seconds powered by Groq LLaMA.',
    highlight: true,
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Chat History',
    desc: 'All your doubts are saved. Review previous conversations anytime.',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center"
            style={{ background: 'var(--ink)' }}
          >
            <Brain className="w-4 h-4" style={{ color: 'var(--paper)' }} />
          </div>
          <span
            className="font-semibold text-lg tracking-tight"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
          >
            AI Doubt Solver
          </span>
        </div>
        <div className="flex items-center gap-5">
          <Link
            to="/login"
            className="text-sm font-medium"
            style={{ color: 'var(--ink-soft)' }}
          >
            Login
          </Link>
          <Link to="/register" className="btn btn-primary text-sm">
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="notebook-bg pt-16 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-7">
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: 'var(--study-teal)' }}
            />
            <span className="text-sm font-medium" style={{ color: 'var(--study-teal)' }}>
              Powered by Groq LLaMA &amp; AssemblyAI
            </span>
          </div>

          <h1
            className="mb-6"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', fontSize: '3.25rem', lineHeight: 1.12 }}
          >
            Every doubt deserves
            <br />
            an answer{' '}
            <span
              className="inline-block px-2"
              style={{ background: 'var(--marker-amber-soft)', borderRadius: '3px' }}
            >
              at 2am too
            </span>
          </h1>

          <p className="text-lg mb-9 max-w-xl mx-auto" style={{ color: 'var(--ink-soft)' }}>
            Ask by typing, snapping a photo, or just speaking. A patient AI tutor
            walks you through the steps — for any subject, any time of night.
          </p>

          <div className="flex items-center gap-4 justify-center flex-wrap">
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
              Start solving doubts
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
              Sign in
            </Link>
          </div>

          {/* Demo preview */}
          <div className="card mt-16 max-w-lg mx-auto text-left overflow-hidden" style={{ padding: 0 }}>
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ borderBottom: '1px solid var(--rule-line)' }}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--error)' }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--marker-amber)' }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--study-teal)' }} />
              <span className="text-xs ml-2" style={{ color: 'var(--ink-faint)' }}>
                AI Doubt Solver — Chemistry
              </span>
            </div>
            <div className="p-5 space-y-3">
              <div className="message-row user" style={{ marginBottom: '0.5rem' }}>
                <div className="bubble bubble-user" style={{ fontSize: '0.85rem', padding: '0.6rem 0.9rem' }}>
                  What's the quadratic formula, and when do I use it?
                </div>
              </div>
              <div className="message-row assistant" style={{ marginBottom: 0 }}>
                <div className="bubble bubble-assistant" style={{ fontSize: '0.85rem', padding: '0.6rem 0.9rem' }}>
                  <strong>x = (−b ± √(b²−4ac)) / 2a</strong>
                  <br />
                  Use it whenever you have ax² + bx + c = 0 — just substitute a, b, and c...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', fontSize: '2rem' }}>
            One tutor, every way you learn
          </h2>
          <p className="mt-3 max-w-md mx-auto" style={{ color: 'var(--ink-soft)' }}>
            Multiple input methods, every subject, no waiting around.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="card"
              style={{
                padding: '1.5rem',
                background: f.highlight ? 'var(--marker-amber-soft)' : 'var(--paper-raised)',
                borderColor: f.highlight ? 'var(--marker-amber)' : 'var(--rule-line)',
              }}
            >
              <div
                className="w-10 h-10 rounded-md flex items-center justify-center mb-4"
                style={{
                  background: f.highlight ? 'var(--marker-amber)' : 'var(--study-teal-soft)',
                  color: f.highlight ? 'var(--ink)' : 'var(--study-teal)',
                }}
              >
                {f.icon}
              </div>
              <h3 className="font-semibold mb-1.5" style={{ color: 'var(--ink)', fontFamily: 'var(--font-heading)' }}>
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <div
          className="max-w-2xl mx-auto rounded-lg py-14 px-8"
          style={{ background: 'var(--ink)' }}
        >
          <h2
            className="mb-3"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--paper)', fontSize: '2rem' }}
          >
            Ready to stop guessing?
          </h2>
          <p className="mb-8" style={{ color: 'rgba(245,246,241,0.7)' }}>
            Join students turning 2am panic into a five-minute answer.
          </p>
          <Link to="/register" className="btn btn-accent" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
            Create free account
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-6 text-center text-sm"
        style={{ color: 'var(--ink-faint)', borderTop: '1px solid var(--rule-line)' }}
      >
        Built with React, Node.js, MongoDB, Groq LLaMA &amp; AssemblyAI
      </footer>
    </div>
  );
}