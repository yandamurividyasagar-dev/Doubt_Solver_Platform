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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-16 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-gray-900 text-sm truncate">{activeChat.title}</h2>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-gray-100 text-gray-600">
            {activeChat.subject}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-1">
          {activeChat.messages.length === 0 ? (
            <div className="text-center py-24">
              <Brain className="w-10 h-10 text-blue-400 mx-auto mb-5" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ask Your First Doubt!</h3>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">
                Type a question, upload an image, or record your voice. I'm here to help!
              </p>
            </div>
          ) : (
            activeChat.messages.map((msg, i) => (
              <MessageBubble key={msg._id || i} message={msg} />
            ))
          )}

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

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-gray-100 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <InputArea subject={activeChat.subject} />
        </div>
      </div>
    </div>
  );
}