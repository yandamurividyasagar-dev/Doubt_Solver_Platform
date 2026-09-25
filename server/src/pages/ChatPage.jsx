// ============================================
// ChatPage.jsx - Chat Detail Page
// ============================================
// Loads the active chat by URL param, renders
// all messages, shows a typing indicator while
// the AI is responding, and auto-scrolls to
// the latest message.
// ============================================

import { useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain } from 'lucide-react';
import { ChatContext } from '../context/ChatContext';
import MessageBubble from '../components/Chat/MessageBubble';
import InputArea from '../components/Chat/InputArea';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Navbar from '../components/Layout/Navbar';

export default function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeChat, loadChat, sendingMessage } = useContext(ChatContext);
  const messagesEndRef = useRef(null);

  // TODO: Add a useEffect that calls loadChat(id) whenever `id` changes.
  useEffect(() => {
    // TODO: implement
  }, [id]);

  // TODO: Add a useEffect that scrolls messagesEndRef into view (smooth)
  // whenever activeChat?.messages changes.
  useEffect(() => {
    // TODO: implement
  }, [activeChat?.messages]);

  // Show spinner while the chat is loading
  if (!activeChat) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  const SUBJECT_COLORS = {
    Mathematics:       'bg-blue-100 text-blue-700',
    Physics:           'bg-purple-100 text-purple-700',
    Chemistry:         'bg-green-100 text-green-700',
    Biology:           'bg-emerald-100 text-emerald-700',
    General:           'bg-gray-100 text-gray-600',
  };
  const subjectColor = SUBJECT_COLORS[activeChat.subject] || 'bg-gray-100 text-gray-600';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Chat header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-16 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-gray-900 text-sm truncate">{activeChat.title}</h2>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${subjectColor}`}>
            {activeChat.subject}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-1">
          {activeChat.messages.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <Brain className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ask Your First Doubt!</h3>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">
                Type a question, upload an image, or record your voice. I'm here to help!
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-6">
                {['What is photosynthesis?', 'Solve x² + 5x + 6 = 0', "Explain Newton's laws"].map(q => (
                  <div key={q} className="bg-blue-50 text-blue-600 text-xs px-3 py-1.5 rounded-full">
                    "{q}"
                  </div>
                ))}
              </div>
            </div>
          ) : (
            activeChat.messages.map((msg, i) => (
              <MessageBubble key={msg._id || i} message={msg} />
            ))
          )}

          {/* Typing indicator - shown while AI is generating a response */}
          {sendingMessage && (
            <div className="flex items-start gap-3 mt-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-100">
                <div className="flex gap-1.5 items-center h-5">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - sticky at bottom */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <InputArea subject={activeChat.subject} />
        </div>
      </div>
    </div>
  );
}
