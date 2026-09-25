// ============================================
// LoadingSpinner.jsx - Reusable Loading UI
// ============================================
// Renders a pulsing Brain icon as a spinner.
// Pass fullScreen={true} for a full-viewport
// overlay (used during route guard checks).
// No TODOs — fully provided.
// ============================================

import { Brain } from 'lucide-react';

export default function LoadingSpinner({ fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Brain className="w-9 h-9 text-blue-600" />
          </div>
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center animate-pulse">
        <Brain className="w-6 h-6 text-blue-600" />
      </div>
    </div>
  );
}
