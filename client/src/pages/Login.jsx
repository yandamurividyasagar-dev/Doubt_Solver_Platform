import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 notebook-bg" style={{ background: 'var(--paper)' }}>
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
          <div style={{ position: 'relative' }}>
  <button
    onClick={() => navigate('/')}
    style={{
      position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
      padding: '6px', borderRadius: '8px', color: 'var(--ink-soft)', lineHeight: 0,
    }}
    aria-label="Back to home"
  >
    <ArrowLeft className="w-5 h-5" />
  </button>
  <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', fontSize: '1.75rem' }}>Welcome back!</h1>
</div>
          <p className="text-sm mt-1" style={{ color: 'var(--ink-soft)' }}>Sign in to continue learning</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="field-label">Email</label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="you@example.com"
                className="field" required autoComplete="email"
              />
            </div>

            <div>
              <label className="field-label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'} name="password"
                  value={form.password} onChange={handleChange}
                  placeholder="Your password" className="field" style={{ paddingRight: '2.5rem' }} required
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--ink-faint)' }}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center mt-2">
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
                : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm mt-5" style={{ color: 'var(--ink-soft)' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-medium" style={{ color: 'var(--study-teal)' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}