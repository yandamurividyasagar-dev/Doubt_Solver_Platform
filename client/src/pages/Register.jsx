import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const EXAMS = ['GATE', 'IIT JAM', 'SSC', 'Banking', 'Railways', 'UPSC', 'State PSC', 'Other'];
const SUBJECTS = [
  'General Aptitude', 'Engineering Mathematics', 'Computer Science & IT',
  'Electronics & Communication', 'Electrical Engineering', 'Mechanical Engineering',
  'Civil Engineering', 'Physics', 'Chemistry', 'Mathematics',
  'Quantitative Aptitude', 'Reasoning & Logical Ability', 'General Awareness', 'English Language',
];

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', grade: 'Other', subjects: [],
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const toggleSubject = (sub) => {
    setForm(p => ({
      ...p,
      subjects: p.subjects.includes(sub)
        ? p.subjects.filter(s => s !== sub)
        : [...p.subjects, sub],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome aboard!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--paper)' }}>
      {/* Slim top bar, consistent with the rest of the app */}
      <div
        className="px-4 sm:px-6 py-3.5"
        style={{ background: 'var(--paper-raised)', borderBottom: '1px solid var(--rule-line)' }}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium"
          style={{ color: 'var(--ink-soft)' }}
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 py-10 notebook-bg">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ background: 'var(--ink)' }}>
                <Brain className="w-5 h-5" style={{ color: 'var(--paper)' }} />
              </div>
              <span className="font-semibold text-lg tracking-tight" style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}>
                AI Doubt Solver
              </span>
            </Link>
            <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', fontSize: '1.75rem' }}>Create your account</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--ink-soft)' }}>Start solving doubts with AI</p>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="field-label">Name</label>
                <input type="text" name="name" placeholder="Your name"
                  value={form.name} onChange={handleChange} className="field" required />
              </div>
              <div>
                <label className="field-label">Email</label>
                <input type="email" name="email" placeholder="you@example.com"
                  value={form.email} onChange={handleChange} className="field" required />
              </div>
              <div>
                <label className="field-label">Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} name="password"
                    placeholder="Min. 6 characters" value={form.password}
                    onChange={handleChange} className="field" style={{ paddingRight: '2.5rem' }} required />
                  <button type="button" onClick={() => setShowPw(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--ink-faint)' }}>
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="field-label">Which exam are you preparing for?</label>
                <select name="grade" value={form.grade} onChange={handleChange} className="field">
                  {EXAMS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label className="field-label">Subjects / papers (optional)</label>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS.map(sub => (
                    <button key={sub} type="button" onClick={() => toggleSubject(sub)}
                      className="subject-chip"
                      data-selected={form.subjects.includes(sub)}
                      style={{ border: 'none', cursor: 'pointer' }}>
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center mt-2">
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
                  : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm mt-5" style={{ color: 'var(--ink-soft)' }}>
              Already have an account?{' '}
              <Link to="/login" className="font-medium" style={{ color: 'var(--study-teal)' }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}