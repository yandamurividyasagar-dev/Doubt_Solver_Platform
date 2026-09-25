// ============================================
// Dashboard.jsx - Main Dashboard Page
// ============================================
// Shows a welcome header, stats cards, and the
// list of all conversations. Lets users create
// new chats and delete existing ones.
// ============================================

import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, Plus, BookOpen, BarChart2,
  Clock, Loader2, Brain, Trash2,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { chatAPI } from '../services/api';
import Navbar from '../components/Layout/Navbar';

const SUBJECT_COLORS = {
  Mathematics:       'bg-blue-100 text-blue-700',
  Physics:           'bg-purple-100 text-purple-700',
  Chemistry:         'bg-green-100 text-green-700',
  Biology:           'bg-emerald-100 text-emerald-700',
  History:           'bg-orange-100 text-orange-700',
  Geography:         'bg-yellow-100 text-yellow-700',
  English:           'bg-pink-100 text-pink-700',
  'Computer Science':'bg-indigo-100 text-indigo-700',
  Economics:         'bg-red-100 text-red-700',
  General:           'bg-gray-100 text-gray-700',
  Other:             'bg-gray-100 text-gray-600',
};

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { chats, loadingChats, loadChats, createChat, deleteChat } = useContext(ChatContext);
  const [stats, setStats] = useState(null);
  const [creatingChat, setCreatingChat] = useState(false);
  const navigate = useNavigate();

  // TODO: Add a useEffect that runs on mount and:
  //   1. Calls loadChats() to populate the chats list
  //   2. Calls chatAPI.getStats() and, on success, sets stats with data.stats
  //   (Ignore errors from getStats — dashboard works without them)
  useEffect(() => {
    // TODO: implement
  }, []);

  // TODO: Implement handleNewChat()
  // - Set creatingChat true
  // - Call createChat() from ChatContext
  // - Set creatingChat false
  // - If a chat was returned, navigate to `/chat/${chat._id}`
  const handleNewChat = async () => {
    // TODO: implement
  };

  // handleOpenChat - navigate to the chat detail page
  const handleOpenChat = (chatId) => navigate(`/chat/${chatId}`);

  // TODO: Implement handleDelete(e, chatId)
  // - Call e.stopPropagation() to prevent the row click from firing
  // - Show a window.confirm dialog: 'Delete this conversation?'
  // - If confirmed, call deleteChat(chatId) from ChatContext
  const handleDelete = async (e, chatId) => {
    // TODO: implement
  };

  // Utility: convert a timestamp to a human-readable "time ago" string
  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Hello, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">What would you like to learn today?</p>
          </div>
          <button onClick={handleNewChat} disabled={creatingChat} className="btn-primary">
            {creatingChat
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
              : <><Plus className="w-4 h-4" /> New Chat</>
            }
          </button>
        </div>

        {/* Stats Cards */}
        {/* TODO: Render the three stat cards only when `stats` is not null.
            Card 1 — icon: MessageSquare (blue), value: stats.totalChats,    label: 'Conversations'
            Card 2 — icon: BookOpen (green),     value: stats.totalDoubts,   label: 'Doubts Solved'
            Card 3 — icon: BarChart2 (purple),   value: Object.keys(stats.subjectBreakdown).length,
                     label: 'Subjects Covered'
            Each card uses className="card flex items-center gap-4" with a colored icon wrapper. */}
        {/* TODO: implement stats cards */}

        {/* Conversations List */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            Recent Conversations
          </h2>

          {loadingChats ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">No conversations yet</h3>
              <p className="text-sm text-gray-500 mb-6">Start by asking your first doubt!</p>
              <button onClick={handleNewChat} className="btn-primary">
                <Plus className="w-4 h-4" /> Start New Chat
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {chats.map(chat => (
                <div
                  key={chat._id}
                  onClick={() => handleOpenChat(chat._id)}
                  className="flex items-center gap-4 py-3.5 px-2 -mx-2 rounded-lg hover:bg-gray-50 cursor-pointer group transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-medium text-sm text-gray-900 truncate">{chat.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${SUBJECT_COLORS[chat.subject] || SUBJECT_COLORS.General}`}>
                        {chat.subject}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{chat.lastMessage || 'Empty conversation'}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-400">{timeAgo(chat.lastActivity)}</span>
                    <button
                      onClick={(e) => handleDelete(e, chat._id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
