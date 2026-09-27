// ============================================
// Landing.jsx - Public Marketing Page
// Positioned for GATE / IIT JAM / JEE / NEET / CBSE / ICSE
// and Government exam aspirants.
// ============================================

import { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain, MessageSquare, Image, Mic, BookOpen,
  ArrowRight, Sparkles, Clock, Target, Menu, X, Plus,
} from 'lucide-react';

const EXAM_PILLS = ['GATE', 'IIT JAM', 'CBSE', 'ICSE', 'SSC', 'NEET', 'JEE', 'Banking', 'Railways', 'UPSC'];

const NAV_LINKS = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Features', href: '#benefits' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
];

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

const FAQS = [
  { q: 'Which exams does this cover?', a: 'GATE (all major branches), IIT JAM, JEE, NEET, CBSE and ICSE boards, and government exams like SSC, Banking, Railways, UPSC and State PSCs.' },
  { q: 'Is it free to use?', a: 'Yes, creating an account and asking doubts is free to get started.' },
  { q: 'Can I ask a doubt from a photo?', a: 'Yes — upload or photograph a problem, including handwritten notes or diagrams, and the AI reads and solves it.' },
  { q: 'Does it work for voice questions?', a: 'Yes, you can record your doubt out loud and it will be transcribed and answered automatically.' },
];

// Guided tour steps — each points at a real ref on an actual navbar
// element so the coachmark highlights the live button, not a mockup.
const TOUR_STEPS = [
  { refKey: 'logo', title: 'AI Doubt Solver', desc: 'Your AI tutor for GATE, JEE, NEET, CBSE, ICSE and government exams. Let\u2019s walk through the top bar.' },
  { refKey: 'nav-0', title: 'How it works', desc: 'Click this to jump to the section explaining the three ways you can ask a doubt — type, photo, or voice.' },
  { refKey: 'nav-1', title: 'Features', desc: 'Click this to see what makes the answers exam-focused — negative-marking traps, fastest methods, and more.' },
  { refKey: 'nav-2', title: 'Testimonials', desc: 'Click this to read what other aspirants preparing for these exams are saying.' },
  { refKey: 'nav-3', title: 'FAQ', desc: 'Click this for quick answers to common questions about the app.' },
  { refKey: 'login', title: 'Login', desc: 'Already have an account? Click here anytime to sign back in.' },
  { refKey: 'getstarted', title: 'Get started', desc: 'Click this button to create your free account and start asking doubts right away.' },
];

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // ── Guided tour state ──────────────────────────────
  const [tourStep, setTourStep] = useState(null); // null = not running
  const [highlightRect, setHighlightRect] = useState(null);

  const logoRef = useRef(null);
  const navLinkRefs = useRef([]);
  const loginRef = useRef(null);
  const getStartedRef = useRef(null);

  const getTargetEl = useCallback((refKey) => {
    if (refKey === 'logo') return logoRef.current;
    if (refKey === 'login') return loginRef.current;
    if (refKey === 'getstarted') return getStartedRef.current;
    if (refKey?.startsWith('nav-')) {
      const idx = parseInt(refKey.split('-')[1], 10);
      return navLinkRefs.current[idx];
    }
    return null;
  }, []);

  const measure = useCallback(() => {
    if (tourStep === null) return;
    const el = getTargetEl(TOUR_STEPS[tourStep].refKey);
    if (!el) return;
    const r = el.getBoundingClientRect();
    setHighlightRect({ top: r.top, left: r.left, width: r.width, height: r.height });
  }, [tourStep, getTargetEl]);

  useLayoutEffect(() => { measure(); }, [measure]);

  useEffect(() => {
    if (tourStep === null) return;
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [tourStep, measure]);

  useEffect(() => {
    const seen = localStorage.getItem('ads_tour_seen');
    if (!seen) {
      const timer = setTimeout(() => setTourStep(0), 700);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = tourStep !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [tourStep]);

  const endTour = () => {
    localStorage.setItem('ads_tour_seen', 'true');
    setTourStep(null);
    setHighlightRect(null);
  };

  const nextTourStep = () => {
    if (tourStep < TOUR_STEPS.length - 1) setTourStep(s => s + 1);
    else endTour();
  };
  const prevTourStep = () => {
    if (tourStep > 0) setTourStep(s => s - 1);
  };

  // Tooltip position: below the target, clamped to viewport width
  const tooltipStyle = (() => {
    if (!highlightRect) return { display: 'none' };
    const width = 300;
    let left = highlightRect.left + highlightRect.width / 2 - width / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - width - 12));
    const top = highlightRect.top + highlightRect.height + 14;
    return { position: 'fixed', top: `${top}px`, left: `${left}px`, width: `${width}px`, zIndex: 102 };
  })();

  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>

      {/* Guided tour overlay */}
      {tourStep !== null && highlightRect && (
        <>
          {/* Dimmed backdrop */}
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(16,20,28,0.55)', zIndex: 99 }} />

          {/* Highlight ring around the live element */}
          <div
            style={{
              position: 'fixed',
              top: highlightRect.top - 6,
              left: highlightRect.left - 8,
              width: highlightRect.width + 16,
              height: highlightRect.height + 12,
              borderRadius: '10px',
              boxShadow: '0 0 0 4px var(--study-teal-bright), 0 0 0 9999px rgba(16,20,28,0.55)',
              zIndex: 100,
              pointerEvents: 'none',
              transition: 'top 0.2s ease, left 0.2s ease, width 0.2s ease, height 0.2s ease',
            }}
          />

          {/* Tooltip card */}
          <div className="card" style={{ ...tooltipStyle, padding: '1.1rem 1.25rem' }}>
            <p className="font-semibold mb-1.5" style={{ color: 'var(--ink)', fontFamily: 'var(--font-heading)', fontSize: '1rem' }}>
              {TOUR_STEPS[tourStep].title}
            </p>
            <p className="text-sm mb-4" style={{ color: 'var(--ink-soft)' }}>
              {TOUR_STEPS[tourStep].desc}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: 'var(--ink-faint)' }}>
                {tourStep + 1} / {TOUR_STEPS.length}
              </span>
              <div className="flex items-center gap-2">
                <button onClick={endTour} className="text-xs font-medium" style={{ color: 'var(--ink-faint)' }}>
                  Skip
                </button>
                {tourStep > 0 && (
                  <button onClick={prevTourStep} className="btn btn-secondary text-xs" style={{ padding: '0.4rem 0.8rem' }}>
                    Back
                  </button>
                )}
                <button onClick={nextTourStep} className="btn btn-primary text-xs" style={{ padding: '0.4rem 0.8rem' }}>
                  {tourStep === TOUR_STEPS.length - 1 ? 'Done' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Navbar — evenly spaced, three distinct zones like a classic e-commerce top bar */}
      <nav
        className="px-6 py-4 sticky top-0 z-30"
        style={{ background: 'var(--paper-raised)', borderBottom: '1px solid var(--rule-line)' }}
      >
        <div className="max-w-6xl w-full mx-auto flex items-center justify-between gap-6">
          {/* Zone 1: brand */}
          <div className="flex items-center gap-2.5 flex-shrink-0" ref={logoRef}>
            <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: 'var(--ink)' }}>
              <Brain className="w-4 h-4" style={{ color: 'var(--paper)' }} />
            </div>
            <span className="font-semibold text-lg tracking-tight" style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}>
              AI Doubt Solver
            </span>
          </div>

          {/* Zone 2: nav links — generously spaced, centered */}
          <div className="hidden md:flex items-center justify-evenly flex-1 px-8">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                ref={el => { navLinkRefs.current[i] = el; }}
                className="text-sm font-medium"
                style={{ color: 'var(--ink-soft)', letterSpacing: '0.01em' }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Zone 3: auth actions */}
          <div className="hidden md:flex items-center gap-6 flex-shrink-0">
            <Link ref={loginRef} to="/login" className="text-sm font-medium" style={{ color: 'var(--ink-soft)' }}>
              Login
            </Link>
            <Link ref={getStartedRef} to="/register" className="btn btn-primary text-sm">
              Get started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            style={{ color: 'var(--ink)' }}
            onClick={() => setMobileMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden max-w-6xl mx-auto pt-4 flex flex-col gap-3">
            {NAV_LINKS.map(link => (
              <a
                key={link.href} href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium py-1"
                style={{ color: 'var(--ink-soft)' }}
              >
                {link.label}
              </a>
            ))}
            <div className="flex items-center gap-4 pt-2" style={{ borderTop: '1px solid var(--rule-line)' }}>
              <Link to="/login" className="text-sm font-medium py-2" style={{ color: 'var(--ink-soft)' }}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary text-sm">
                Get started
              </Link>
            </div>
          </div>
        )}
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
      <section id="how-it-works" className="py-24 px-6 max-w-6xl mx-auto">
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
      <section id="benefits" className="py-20 px-6" style={{ background: 'var(--paper-raised)', borderTop: '1px solid var(--rule-line)', borderBottom: '1px solid var(--rule-line)' }}>
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
      <section id="testimonials" className="py-24 px-6 max-w-6xl mx-auto">
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

      {/* FAQ */}
      <section id="faq" className="py-24 px-6" style={{ background: 'var(--paper-raised)', borderTop: '1px solid var(--rule-line)', borderBottom: '1px solid var(--rule-line)' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center mb-10" style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', fontSize: '2rem' }}>
            Frequently asked questions
          </h2>
          <div>
            {FAQS.map((f, i) => (
              <div key={i} className="faq-item">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ all: 'unset', display: 'block', width: '100%', cursor: 'pointer' }}
                >
                  <div
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
                      fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: 'var(--ink)',
                    }}
                  >
                    {f.q}
                    <Plus
                      className="faq-icon"
                      style={{
                        flexShrink: 0, color: 'var(--ink-faint)',
                        transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                      }}
                    />
                  </div>
                </button>
                {openFaq === i && (
                  <p className="mt-2.5" style={{ color: 'var(--ink-soft)', maxWidth: '62ch' }}>{f.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 px-6 text-center pt-24">
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
              <li><a href="#how-it-works">How it works</a></li>
              <li><a href="#benefits">Features</a></li>
              <li><a href="#faq">FAQ</a></li>
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