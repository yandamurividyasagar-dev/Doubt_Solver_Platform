import { createContext, useState } from 'react';
import { chatAPI } from '../services/api';
import toast from 'react-hot-toast';

export const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [loadingChats, setLoadingChats] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  const loadChats = async () => {
    setLoadingChats(true);
    try {
      const { data } = await chatAPI.getAll();
      setChats(data.chats);
    } catch {
      toast.error('Failed to load conversations');
    } finally {
      setLoadingChats(false);
    }
  };

  const loadChat = async (chatId) => {
    try {
      const { data } = await chatAPI.getById(chatId);
      setActiveChat(data.chat);
      return data.chat;
    } catch {
      toast.error('Failed to load conversation');
      return null;
    }
  };

  const createChat = async (subject = 'General') => {
    try {
      const { data } = await chatAPI.create({ subject });
      setChats(prev => [
        { ...data.chat, messageCount: 0, lastMessage: '' },
        ...prev,
      ]);
      setActiveChat(data.chat);
      return data.chat;
    } catch {
      toast.error('Failed to create conversation');
      return null;
    }
  };

  const sendTextMessage = async (question, subject) => {
    if (!activeChat) return;
    setSendingMessage(true);

    // Optimistically add the user's message
    const tempUserMsg = {
      _id: `temp_${Date.now()}`,
      role: 'user',
      content: question,
      inputType: 'text',
      timestamp: new Date(),
    };
    setActiveChat(prev => ({
      ...prev,
      messages: [...prev.messages, tempUserMsg],
    }));

    try {
      const { data } = await chatAPI.askText(activeChat._id, question, subject);

      setActiveChat(prev => ({
        ...prev,
        subject: data.subject || prev.subject,
        messages: [
          ...prev.messages.filter(m => m._id !== tempUserMsg._id),
          data.userMessage,
          data.assistantMessage,
        ],
      }));

      // Update chat list preview
      setChats(prev => prev.map(c =>
        c._id === activeChat._id
          ? { ...c, subject: data.subject || c.subject, lastMessage: question.substring(0, 100), lastActivity: new Date() }
          : c
      ));
    } catch (err) {
      // Remove the optimistic message on error
      setActiveChat(prev => ({
        ...prev,
        messages: prev.messages.filter(m => m._id !== tempUserMsg._id),
      }));
      toast.error(err.response?.data?.message || 'Failed to get answer');
    } finally {
      setSendingMessage(false);
    }
  };

  const sendImageMessage = async (imageFile, question, subject) => {
    if (!activeChat) return;
    setSendingMessage(true);

    const tempUserMsg = {
      _id: `temp_${Date.now()}`,
      role: 'user',
      content: question || 'Analyzing image...',
      inputType: 'image',
      imageUrl: URL.createObjectURL(imageFile),
      timestamp: new Date(),
    };
    setActiveChat(prev => ({
      ...prev,
      messages: [...prev.messages, tempUserMsg],
    }));

    try {
      const { data } = await chatAPI.askImage(activeChat._id, imageFile, question, subject);

      setActiveChat(prev => ({
        ...prev,
        subject: data.subject || prev.subject,
        messages: [
          ...prev.messages.filter(m => m._id !== tempUserMsg._id),
          data.userMessage,
          data.assistantMessage,
        ],
      }));
    } catch (err) {
      setActiveChat(prev => ({
        ...prev,
        messages: prev.messages.filter(m => m._id !== tempUserMsg._id),
      }));
      toast.error(err.response?.data?.message || 'Failed to analyze image');
    } finally {
      setSendingMessage(false);
    }
  };

  const sendVoiceMessage = async (audioBlob, subject) => {
    if (!activeChat) return;
    setSendingMessage(true);

    const tempUserMsg = {
      _id: `temp_${Date.now()}`,
      role: 'user',
      content: 'Transcribing voice...',
      inputType: 'voice',
      timestamp: new Date(),
    };
    setActiveChat(prev => ({
      ...prev,
      messages: [...prev.messages, tempUserMsg],
    }));

    try {
      const { data } = await chatAPI.askVoice(activeChat._id, audioBlob, subject);

      setActiveChat(prev => ({
        ...prev,
        subject: data.subject || prev.subject,
        messages: [
          ...prev.messages.filter(m => m._id !== tempUserMsg._id),
          data.userMessage,
          data.assistantMessage,
        ],
      }));
      toast.success(`Transcribed: "${data.transcript.substring(0, 50)}..."`);
    } catch (err) {
      setActiveChat(prev => ({
        ...prev,
        messages: prev.messages.filter(m => m._id !== tempUserMsg._id),
      }));
      toast.error(err.response?.data?.message || 'Voice transcription failed');
    } finally {
      setSendingMessage(false);
    }
  };

  const deleteChat = async (chatId) => {
    try {
      await chatAPI.delete(chatId);
      setChats(prev => prev.filter(c => c._id !== chatId));
      if (activeChat?._id === chatId) setActiveChat(null);
      toast.success('Conversation deleted');
    } catch {
      toast.error('Failed to delete conversation');
    }
  };

  return (
    <ChatContext.Provider value={{
      chats, activeChat, loadingChats, sendingMessage,
      loadChats, loadChat, createChat, deleteChat,
      sendTextMessage, sendImageMessage, sendVoiceMessage,
      setActiveChat,
    }}>
      {children}
    </ChatContext.Provider>
  );
};