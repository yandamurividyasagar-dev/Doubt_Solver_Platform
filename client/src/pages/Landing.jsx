// ============================================
// Landing.jsx - Public Marketing Page
// Positioned for GATE / IIT JAM / Government exam aspirants
// (a less crowded, underserved niche vs. the JEE/NEET/CBSE
// doubt-solving apps that already dominate that space)
// ============================================

import { Link } from 'react-router-dom';
import {
  Brain, MessageSquare, Image, Mic, BookOpen, Shield,
  ArrowRight, Sparkles, Clock, Target,
} from 'lucide-react';

const EXAM_PILLS = ['GATE', 'IIT JAM', 'CBSE', 'ICSE', 'SSC', 'NEET', 'JEE', 'Banking', 'Railways', 'UPSC'];

const SPOTLIGHTS = [
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: 'Type it out',
    desc: "Ask exactly what's confusing you — a GATE PYQ, a JEE/NEET concept, a CBSE/ICSE board topic, or a govt-exam aptitude trick. The tutor answers the way it would appear in the actual exam, not a generic textbook explanation.",
    mock: (
      <>
        <div className="message-row user" style={{ marginBottom: '0.5rem' }}>
          <div className="bubble bubble-user" style={{ fontSize: '0.82rem', padding: '0.55rem 0.85rem' }}>
            In GATE, is there negative marking on MSQ questions?
          </div>
        </div>
        <div className="message-row assistant" style={{ marginBottom: 0 }}>
          <div className="bubble bubble-assistant" style={{ fontSize: '0.82rem', padding: '0.55rem 0.85rem' }}>
            No — <mark style={{ background: 'var(--marker-amber-soft)', padding: '0 0.2rem' }}>MSQ questions carry zero negative marking</mark>, unlike single-answer MCQs where a wrong pick costs 1/3rd...
          </div>
        </div>
      </>
    ),
  },
  {
    icon: <Image className="w-5 h-5" />,
    title: 'Snap a photo',
    desc: "Stuck on a circuit diagram, a numerical from your GATE mathematics book, a NEET biology diagram, or a handwritten note from a coaching class? Photograph it — vision AI reads diagrams, equations, and handwriting.",
    mock: (
      <div className="flex items-center gap-3">
        <div
          className="w-16 h-16 rounded-md flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--paper)', border: '1px dashed var(--rule-line)' }}
        >
          <Image className="w-6 h-6" style={{ color: 'var(--ink-faint)' }} />
        </div>
        <div className="bubble bubble-assistant" style={{ fontSize: '0.82rem', padding: '0.55rem 0.85rem', flex: 1 }}>
          This is a Thevenin equivalent circuit problem — <mark style={{ background: 'var(--marker-amber-soft)', padding: '0 0.2rem' }}>V_th = 6V, R_th = 4Ω</mark>. Here's how to find them...
        </div>
      </div>
    ),
  },
  {
    icon: <Mic className="w-5 h-5" />,
    title: 'Just say it',
    desc: "Revising on a walk, or too tired to type after a long study session? Say the doubt out loud in English or a mix of Hindi-English — it's transcribed and answered in seconds.",
    mock: (
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--error)' }}
        >
          <Mic className="w-4 h-4" style={{ color: '#fff' }} />
        </div>
        <div className="flex items-center gap-1 flex-1">
          {[6, 14, 9, 18, 7, 12, 5].map((h, i) => (
            <span key={i} style={{ width: 3, height: h * 2, background: 'var(--rule-line)', borderRadius: 2 }} />
          ))}
        </div>
        <span className="text-xs" style={{ color: 'var(--ink-faint)' }}>0:14</span>
      </div>
    ),
  },
];

const EXTRAS = [
  { icon: <Target className="w-5 h-5" />, title: 'Exam-aware answers', desc: 'Every response is aware of MCQ, MSQ and Numerical Answer Type formats, and calls out the negative-marking traps specific to the concept.' },
  { icon: <BookOpen className="w-5 h-5" />, title: 'Built for your papers', desc: 'GATE branches (CS, EC, EE, ME, CE), IIT JAM (Physics, Chemistry, Maths), JEE and NEET syllabi, CBSE/ICSE boards, and govt-exam sections — Aptitude, Reasoning, GA — all in one place.' },
  { icon: <Sparkles className="w-5 h-5" />, title: 'The fastest correct method', desc: "You're working against a clock in the real exam, so answers favor the quickest valid approach, not the longest possible derivation." },
];

const TESTIMONIALS = [
  { initials: 'RK', grade: 'GATE CSE aspirant', quote: "I asked it a PYQ from Computer Networks at 1am before my mock test and it explained the elimination logic for every wrong option, not just the right one." },
  { initials: 'SN', grade: 'IIT JAM Physics aspirant', quote: 'Photographing a problem from my coaching notes and getting a worked solution back in seconds beats waiting for the next doubt-clearing class.' },
  { initials: 'MP', grade: 'SSC CGL aspirant', quote: "It actually pointed out where I'd lose marks on a reasoning puzzle, not just given the answer. That changed how I check my own work now." },
];

export default function Landing() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
      {/* Navbar */}
      <nav
        className="flex items-center justify-between px-6 py-4 sticky top-0 z-30"
        style={{ background: 'var(--paper-raised)', borderBottom: '1px solid var(--rule-line)' }}
      >
        <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: 'var(--ink)' }}>
              <Brain className="w-4 h-4" style={{ color: 'var(--paper)' }} />
            </div>
            <span className="font-semibold text-lg tracking-tight" style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}>
              AI Doubt Solver
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/login" className="text-sm font-medium" style={{ color: 'var(--ink-soft)' }}>
              Login
            </Link>
            <Link to="/register" className="btn btn-primary text-sm">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-dark pt-16 pb-24 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <span className="subject-pill mb-6">
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--study-teal-bright)' }} />
              Built for GATE, IIT JAM, JEE, NEET, CBSE/ICSE &amp; Government exam aspirants
            </span>

            <h1
              className="mb-6"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--paper)', fontSize: '3rem', lineHeight: 1.12 }}
            >
              Every doubt deserves an answer{' '}
              <span className="inline-block px-2" style={{ background: 'var(--marker-amber)', color: 'var(--ink)', borderRadius: '3px' }}>
                at 2am too
              </span>
            </h1>

            <p className="text-lg mb-8 max-w-lg" style={{ color: 'rgba(245,246,241,0.68)' }}>
              One AI tutor for every stage — CBSE and ICSE boards, JEE and NEET,
              GATE, IIT JAM, and government exams like SSC, Banking, Railways and UPSC.
              Ask by typing, photo, or voice, and get an exam-focused, step-by-step answer.
            </p>

            <div className="flex items-center gap-4 flex-wrap mb-10">
              <Link to="/register" className="btn btn-accent" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
                Start solving doubts
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="btn"
                style={{ padding: '0.85rem 1.75rem', fontSize: '1rem', background: 'transparent', color: 'var(--paper)', border: '1px solid var(--rule-line-dark)' }}
              >
                Sign in
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {EXAM_PILLS.map(s => (
                <span key={s} className="subject-pill">{s}</span>
              ))}
              <span className="subject-pill">+ State PSC exams</span>
            </div>
          </div>

          {/* Demo preview */}
          <div className="card overflow-hidden" style={{ padding: 0, boxShadow: '0 24px 60px -20px rgba(0,0,0,0.55)' }}>
            <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--rule-line)' }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--error)' }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--marker-amber)' }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--study-teal)' }} />
              <span className="text-xs ml-2" style={{ color: 'var(--ink-faint)' }}>AI Doubt Solver — GATE Engineering Mathematics</span>
            </div>
            <div className="p-5 space-y-3">
              <div className="message-row user" style={{ marginBottom: '0.5rem' }}>
                <div className="bubble bubble-user" style={{ fontSize: '0.85rem', padding: '0.6rem 0.9rem' }}>
                  Find the eigenvalues of [[2,1],[1,2]] — fastest way for the exam?
                </div>
              </div>
              <div className="message-row assistant" style={{ marginBottom: 0 }}>
                <div className="bubble bubble-assistant" style={{ fontSize: '0.85rem', padding: '0.6rem 0.9rem' }}>
                  <strong>λ = 1, 3</strong> — for a 2×2 symmetric matrix, use trace and determinant directly instead of expanding the characteristic polynomial...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
            {/* Feature spotlights: three ways to ask */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="max-w-xl mb-16">
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', fontSize: '2rem' }}>
            Ask however it's easiest right now
          </h2>
          <p className="mt-3" style={{ color: 'var(--ink-soft)' }}>
            Some doubts are quick to type. Others are easier to photograph from your notes or say out loud between revision sessions.
          </p>
        </div>

        <div className="space-y-16">
          {SPOTLIGHTS.map((s, i) => (
            <div key={i} className={`grid md:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}>
              <div>
                <div
                  className="w-10 h-10 rounded-md flex items-center justify-center mb-4"
                  style={{ background: 'var(--study-teal-soft)', color: 'var(--study-teal)' }}
                >
                  {s.icon}
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--ink)', fontFamily: 'var(--font-heading)', fontSize: '1.3rem' }}>
                  {s.title}
                </h3>
                <p className="leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                  {s.desc}
                </p>
              </div>
              <div className="card" style={{ padding: '1.25rem' }}>
                {s.mock}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Secondary benefits — plain, not another card grid */}
      <section className="py-20 px-6" style={{ background: 'var(--paper-raised)', borderTop: '1px solid var(--rule-line)', borderBottom: '1px solid var(--rule-line)' }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          {EXTRAS.map((e, i) => (
            <div key={i} className="flex gap-4">
              <div
                className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--marker-amber-soft)', color: 'var(--ink)' }}
              >
                {e.icon}
              </div>
              <div>
                <h3 className="font-semibold mb-1.5" style={{ color: 'var(--ink)', fontFamily: 'var(--font-heading)' }}>
                  {e.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                  {e.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats band */}
      <section className="py-16 px-6" style={{ background: 'var(--ink-deep)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="stat-lg">14</p>
            <p className="text-sm mt-1" style={{ color: 'rgba(245,246,241,0.6)' }}>Exams &amp; boards covered</p>
          </div>
          <div>
            <p className="stat-lg">3</p>
            <p className="text-sm mt-1" style={{ color: 'rgba(245,246,241,0.6)' }}>Ways to ask a doubt</p>
          </div>
          <div>
            <p className="stat-lg">24/7</p>
            <p className="text-sm mt-1" style={{ color: 'rgba(245,246,241,0.6)' }}>Available, any hour</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', fontSize: '2rem' }}>
            Ask alongside other aspirants
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="testimonial-card">
              <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--ink)' }}>
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3 mt-auto">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                  style={{ background: 'var(--study-teal-soft)', color: 'var(--study-teal)' }}
                >
                  {t.initials}
                </div>
                <span className="text-xs" style={{ color: 'var(--ink-faint)' }}>{t.grade}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 px-6 text-center">
        <div className="max-w-2xl mx-auto rounded-lg py-14 px-8" style={{ background: 'var(--ink)' }}>
          <h2 className="mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--paper)', fontSize: '2rem' }}>
            Ready to stop guessing?
          </h2>
          <p className="mb-8" style={{ color: 'rgba(245,246,241,0.7)' }}>
            Join aspirants turning 2am panic into a five-minute, exam-ready answer.
          </p>
          <Link to="/register" className="btn btn-accent" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
            Create free account
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-dark px-6 pt-16 pb-8">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: 'var(--paper)' }}>
                <Brain className="w-4 h-4" style={{ color: 'var(--ink-deep)' }} />
              </div>
              <span className="font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--paper)' }}>
                AI Doubt Solver
              </span>
            </div>
            <p className="text-sm max-w-xs">An exam-focused AI tutor for CBSE, ICSE, JEE, NEET, GATE, IIT JAM and government exam aspirants — day or night.</p>
          </div>
          <div>
            <p className="footer-heading">Product</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register">Get started</Link></li>
              <li><Link to="/login">Sign in</Link></li>
            </ul>
          </div>
          <div>
            <p className="footer-heading">Exams covered</p>
            <ul className="space-y-2 text-sm">
              <li>CBSE &amp; ICSE Boards</li>
              <li>JEE &amp; NEET</li>
              <li>GATE (CS, EC, EE, ME, CE)</li>
              <li>IIT JAM (Physics, Chemistry, Maths)</li>
              <li>SSC, Banking, Railways, UPSC</li>
            </ul>
          </div>
          <div>
            <p className="footer-heading">Built with</p>
            <ul className="space-y-2 text-sm">
              <li>React &amp; Node.js</li>
              <li>MongoDB</li>
              <li>Groq LLaMA &amp; AssemblyAI</li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ borderTop: '1px solid var(--rule-line-dark)' }}>
          <span>© {new Date().getFullYear()} AI Doubt Solver. All rights reserved.</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Built for the night before the exam</span>
        </div>
      </footer>
    </div>
  );
}