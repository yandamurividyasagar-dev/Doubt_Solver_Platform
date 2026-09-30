import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Plus,
  BookOpen,
  BarChart2,
  Clock,
  Loader2,
  Brain,
  Trash2,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { chatAPI } from '../services/api';
import Navbar from '../components/Layout/Navbar';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  const {
    chats,
    loadingChats,
    loadChats,
    createChat,
    deleteChat,
  } = useContext(ChatContext);

  const [stats, setStats] = useState(null);
  const [creatingChat, setCreatingChat] = useState(false);

  const navigate = useNavigate();

  // -------------------------
  // Load Dashboard Data
  // -------------------------
  const loadDashboard = async () => {
    try {
      await loadChats();

      const { data } = await chatAPI.getStats();

      setStats(data.stats);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // -------------------------
  // New Chat
  // -------------------------
  const handleNewChat = async () => {
    setCreatingChat(true);

    const chat = await createChat();

    setCreatingChat(false);

    if (chat) {
      loadDashboard();
      navigate(`/chat/${chat._id}`);
    }
  };

  // -------------------------
  // Delete Chat
  // -------------------------
  const handleDelete = async (e, chatId) => {
    e.stopPropagation();

    if (!window.confirm('Delete this conversation?')) return;

    await deleteChat(chatId);

    // Reload chats + stats immediately
    await loadDashboard();
  };

  // -------------------------
  // Time Ago
  // -------------------------
  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();

    const mins = Math.floor(diff / 60000);

    if (mins < 1) return 'just now';

    if (mins < 60) return `${mins}m ago`;

    const hrs = Math.floor(mins / 60);

    if (hrs < 24) return `${hrs}h ago`;

    return `${Math.floor(hrs / 24)}d ago`;
  };

  const statTiles = stats
    ? [
        {
          icon: <MessageSquare className="w-5 h-5" />,
          value: stats.totalChats,
          label: 'Conversations',
        },
        {
          icon: <BookOpen className="w-5 h-5" />,
          value: stats.totalDoubts,
          label: 'Doubts Solved',
        },
        {
          icon: <BarChart2 className="w-5 h-5" />,
          value: Object.keys(stats.subjectBreakdown || {}).length,
          label: 'Subjects Covered',
        },
      ]
    : [];

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--paper)' }}
    >
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">

          <div>

            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--ink)',
                fontSize: '1.75rem',
              }}
            >
              Hello, {user?.name?.split(' ')[0]}!
            </h1>

            <p
              className="text-sm mt-1"
              style={{ color: 'var(--ink-soft)' }}
            >
              What would you like to learn today?
            </p>

          </div>

          <button
            onClick={handleNewChat}
            disabled={creatingChat}
            className="btn btn-primary"
          >
            {creatingChat ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                New Chat
              </>
            )}
          </button>

        </div>

        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

            {statTiles.map((item, index) => (
              <div
                key={index}
                className="stat-tile flex items-center gap-4"
              >
                <div
                  className="w-11 h-11 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'var(--study-teal-soft)',
                    color: 'var(--study-teal)',
                  }}
                >
                  {item.icon}
                </div>

                <div>
                  <p className="stat-number leading-none">
                    {item.value}
                  </p>

                  <p className="stat-label mt-1">
                    {item.label}
                  </p>
                </div>
              </div>
            ))}

          </div>
        )}

        <div
          className="card"
          style={{ padding: '1.25rem 1.5rem' }}
        >

          <h2
            className="font-semibold mb-4 flex items-center gap-2"
            style={{
              color: 'var(--ink)',
              fontFamily: 'var(--font-heading)',
              fontSize: '1.05rem',
            }}
          >
            <Clock
              className="w-4 h-4"
              style={{ color: 'var(--ink-faint)' }}
            />
            Recent Conversations
          </h2>

          {loadingChats ? (
            <div className="flex items-center justify-center py-12">
              <Loader2
                className="w-6 h-6 animate-spin"
                style={{ color: 'var(--study-teal)' }}
              />
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-16">

              <Brain
                className="w-8 h-8 mx-auto mb-4"
                style={{ color: 'var(--study-teal)' }}
              />

              <h3
                className="font-medium mb-2"
                style={{ color: 'var(--ink)' }}
              >
                No conversations yet
              </h3>

              <p
                className="text-sm mb-6"
                style={{ color: 'var(--ink-soft)' }}
              >
                Start by asking your first doubt!
              </p>

              <button
                onClick={handleNewChat}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4" />
                Start New Chat
              </button>

            </div>
          ) : (
            <div>

              {chats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => navigate(`/chat/${chat._id}`)}
                  className="flex items-center gap-4 py-3.5 px-2 -mx-2 rounded-lg cursor-pointer group transition-colors"
                  style={{
                    borderBottom: '1px solid var(--rule-line)',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'var(--study-teal-soft)',
                    }}
                  >
                    <MessageSquare
                      className="w-5 h-5"
                      style={{
                        color: 'var(--study-teal)',
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">

                    <div className="flex items-center gap-2 mb-0.5">

                      <p
                        className="font-medium text-sm truncate"
                        style={{ color: 'var(--ink)' }}
                      >
                        {chat.title}
                      </p>

                      <span className="subject-chip">
                        {chat.subject}
                      </span>

                    </div>

                    <p
                      className="text-xs truncate"
                      style={{ color: 'var(--ink-faint)' }}
                    >
                      {chat.lastMessage || 'Empty conversation'}
                    </p>

                  </div>

                  <div className="flex items-center gap-2">

                    <span
                      className="text-xs"
                      style={{ color: 'var(--ink-faint)' }}
                    >
                      {timeAgo(chat.lastActivity)}
                    </span>

                    <button
                      onClick={(e) =>
                        handleDelete(e, chat._id)
                      }
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
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
