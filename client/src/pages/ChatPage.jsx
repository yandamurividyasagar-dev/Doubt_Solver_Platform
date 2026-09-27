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

  useEffect(() => {
    if (id) loadChat(id);
  }, [id]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  if (!activeChat) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--paper)' }}>
      <Navbar />

      <div
        className="px-4 py-3 sticky top-16 z-10"
        style={{ background: 'var(--paper-raised)', borderBottom: '1px solid var(--rule-line)' }}
      >
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg"
            style={{ color: 'var(--ink-soft)' }}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-sm truncate" style={{ color: 'var(--ink)' }}>{activeChat.title}</h2>
          </div>
          <span className="subject-chip">{activeChat.subject}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {activeChat.messages.length === 0 ? (
            <div className="text-center py-24">
              <Brain className="w-10 h-10 mx-auto mb-5" style={{ color: 'var(--study-teal)' }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--ink)', fontFamily: 'var(--font-heading)' }}>
                Ask Your First Doubt!
              </h3>
              <p className="text-sm max-w-xs mx-auto" style={{ color: 'var(--ink-soft)' }}>
                Type a question, upload an image, or record your voice. I'm here to help!
              </p>
            </div>
          ) : (
            activeChat.messages.map((msg, i) => (
              <MessageBubble key={msg._id || i} message={msg} />
            ))
          )}

          {sendingMessage && (
            <div className="message-row assistant">
              <div className="bubble bubble-assistant">
                <div className="typing-dots">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div
  className="sticky bottom-0"
  style={{
    background: 'var(--paper-raised)',
    borderTop: '1px solid var(--rule-line)',
    boxShadow: '0 -2px 8px rgba(30,37,48,0.04)',
    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
  }}
>
  <div className="max-w-4xl mx-auto px-4 py-3">
    <InputArea subject={activeChat.subject} />
  </div>
</div>
    </div>
  );
}