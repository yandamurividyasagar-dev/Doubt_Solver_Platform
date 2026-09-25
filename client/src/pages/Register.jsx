import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Eye, EyeOff, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const GRADES = ['8th', '9th', '10th', '11th', '12th', 'College', 'Other'];
const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'English', 'Computer Science', 'Economics'];

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">AI Doubt Solver</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Start solving doubts with AI</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Your name"
              value={form.name} onChange={handleChange} className="input-field" required />
            <input type="email" name="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange} className="input-field" required />
            <input type={showPw ? 'text' : 'password'} name="password"
              placeholder="Min. 6 characters" value={form.password}
              onChange={handleChange} className="input-field" required />

            <select name="grade" value={form.grade} onChange={handleChange} className="input-field">
              {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subjects (optional)</label>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map(sub => (
                  <button key={sub} type="button" onClick={() => toggleSubject(sub)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      form.subjects.includes(sub)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
                    }`}>
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 mt-2">
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
                : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}