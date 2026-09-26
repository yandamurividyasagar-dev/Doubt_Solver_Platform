import { Link, useNavigate } from 'react-router-dom';
import { Brain, LogOut, User, LayoutDashboard } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useState, useContext } from 'react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav
      className="sticky top-0 z-20"
      style={{ background: 'var(--paper-raised)', borderBottom: '1px solid var(--rule-line)' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: 'var(--ink)' }}>
            <Brain className="w-4 h-4" style={{ color: 'var(--paper)' }} />
          </div>
          <span
            className="font-semibold hidden sm:block tracking-tight"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
          >
            AI Doubt Solver
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition-colors"
            style={{ color: 'var(--ink-soft)' }}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:block">Dashboard</span>
          </Link>

          <div className="relative">
            <button
              onClick={() => setShowMenu(p => !p)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg transition-colors"
              style={{ background: showMenu ? 'var(--paper)' : 'transparent' }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: 'var(--study-teal-soft)' }}
              >
                <User className="w-4 h-4" style={{ color: 'var(--study-teal)' }} />
              </div>
              <span className="text-sm font-medium hidden sm:block" style={{ color: 'var(--ink)' }}>
                {user?.name?.split(' ')[0]}
              </span>
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div
                  className="absolute right-0 top-full mt-1 rounded-md py-1 w-48 z-20"
                  style={{ background: 'var(--paper-raised)', border: '1px solid var(--rule-line)', boxShadow: 'var(--shadow-card)' }}
                >
                  <div className="px-3 py-2" style={{ borderBottom: '1px solid var(--rule-line)' }}>
                    <p className="font-medium text-sm" style={{ color: 'var(--ink)' }}>{user?.name}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--ink-faint)' }}>{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors"
                    style={{ color: 'var(--error)' }}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}