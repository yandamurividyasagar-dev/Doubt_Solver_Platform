// ============================================
// LoadingSpinner.jsx - Reusable Loading UI
// ============================================
// Renders a pulsing Brain icon as a spinner, styled to
// match the app's notebook theme (paper/ink/teal tokens).
// Pass fullScreen={true} for a full-viewport overlay.
// ============================================

import { Brain } from 'lucide-react';

export default function LoadingSpinner({ fullScreen = false }) {
  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{ background: 'var(--paper)' }}
      >
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse"
            style={{ background: 'var(--study-teal-soft)' }}
          >
            <Brain className="w-9 h-9" style={{ color: 'var(--study-teal)' }} />
          </div>
          <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center animate-pulse"
        style={{ background: 'var(--study-teal-soft)' }}
      >
        <Brain className="w-6 h-6" style={{ color: 'var(--study-teal)' }} />
      </div>
    </div>
  );
}