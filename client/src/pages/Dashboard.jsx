import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Plus, BookOpen, BarChart2, Clock, Loader2, Brain, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { chatAPI } from '../services/api';
import Navbar from '../components/Layout/Navbar';

const SUBJECT_COLORS = {
  Mathematics: 'bg-blue-100 text-blue-700',
  Physics: 'bg-purple-100 text-purple-700',
  Chemistry: 'bg-green-100 text-green-700',
  Biology: 'bg-emerald-100 text-emerald-700',
  General: 'bg-gray-100 text-gray-700',
};

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { chats, loadingChats, loadChats, createChat, deleteChat } = useContext(ChatContext);
  const [stats, setStats] = useState(null);
  const [creatingChat, setCreatingChat] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadChats();
    chatAPI.getStats().then(({ data }) => setStats(data.stats)).catch(() => {});
  }, []);

  const handleNewChat = async () => {
    setCreatingChat(true);
    const chat = await createChat();
    setCreatingChat(false);
    if (chat) navigate(`/chat/${chat._id}`);
  };

  const handleDelete = async (e, chatId) => {
    e.stopPropagation();
    if (window.confirm('Delete this conversation?')) {
      await deleteChat(chatId);
    }
  };

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hello, {user?.name?.split(' ')[0]}!</h1>
            <p className="text-gray-500 text-sm mt-0.5">What would you like to learn today?</p>
          </div>
          <button onClick={handleNewChat} disabled={creatingChat} className="btn-primary">
            {creatingChat
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
              : <><Plus className="w-4 h-4" /> New Chat</>}
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="card flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalChats}</p>
                <p className="text-sm text-gray-500">Conversations</p>
              </div>
            </div>
            <div className="card flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDoubts}</p>
                <p className="text-sm text-gray-500">Doubts Solved</p>
              </div>
            </div>
            <div className="card flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <BarChart2 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.keys(stats.subjectBreakdown).length}
                </p>
                <p className="text-sm text-gray-500">Subjects Covered</p>
              </div>
            </div>
          </div>
        )}

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
              <Brain className="w-8 h-8 text-blue-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No conversations yet</h3>
              <p className="text-sm text-gray-500 mb-6">Start by asking your first doubt!</p>
              <button onClick={handleNewChat} className="btn-primary">
                <Plus className="w-4 h-4" /> Start New Chat
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {chats.map(chat => (
                <div key={chat._id} onClick={() => navigate(`/chat/${chat._id}`)}
                  className="flex items-center gap-4 py-3.5 px-2 -mx-2 rounded-lg hover:bg-gray-50 cursor-pointer group transition-colors">
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
                    <button onClick={(e) => handleDelete(e, chat._id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
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