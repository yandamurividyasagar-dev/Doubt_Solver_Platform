// ============================================
// ChatContext.jsx - Global Chat State
// ============================================
// Manages the list of chats, the currently open
// chat, and all message-sending logic (text,
// image, voice) with optimistic UI updates.
// ============================================

import { createContext, useState } from 'react';
import { chatAPI } from '../services/api';
import toast from 'react-hot-toast';

export const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [loadingChats, setLoadingChats] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  // ── loadChats ──────────────────────────────────────────────
  // TODO: Implement loadChats()
  // - Set loadingChats true
  // - Call chatAPI.getAll()
  // - On success: setChats(data.chats)
  // - On error: show toast 'Failed to load conversations'
  // - Always set loadingChats false in finally
  const loadChats = async () => {
    // TODO: implement
  };

  // ── loadChat ───────────────────────────────────────────────
  // TODO: Implement loadChat(chatId)
  // - Call chatAPI.getById(chatId)
  // - On success: setActiveChat(data.chat), return the chat
  // - On error: show toast 'Failed to load conversation', return null
  const loadChat = async (chatId) => {
    // TODO: implement
  };

  // ── createChat ─────────────────────────────────────────────
  // TODO: Implement createChat(subject = 'General')
  // - Call chatAPI.create({ subject })
  // - Prepend the new chat (with messageCount:0, lastMessage:'')
  //   to chats state
  // - setActiveChat to the new chat
  // - Return the new chat
  // - On error: show toast 'Failed to create conversation', return null
  const createChat = async (subject = 'General') => {
    // TODO: implement
  };

  // ── deleteChat ─────────────────────────────────────────────
  // TODO: Implement deleteChat(chatId)
  // - Call chatAPI.delete(chatId)
  // - Remove the chat from chats state
  // - If activeChat._id === chatId, setActiveChat(null)
  // - Show success toast 'Conversation deleted'
  // - On error: show toast 'Failed to delete conversation'
  const deleteChat = async (chatId) => {
    // TODO: implement
  };

  // ── sendTextMessage ────────────────────────────────────────
  // TODO: Implement sendTextMessage(question, subject)
  // Optimistic update pattern:
  //   1. setSendingMessage(true)
  //   2. Build tempUserMsg = { _id: `temp_${Date.now()}`, role: 'user',
  //        content: question, inputType: 'text', timestamp: new Date() }
  //   3. Append tempUserMsg to activeChat.messages
  //   4. Call chatAPI.askText(activeChat._id, question, subject)
  //   5. On success:
  //      - Replace tempUserMsg with data.userMessage and data.assistantMessage
  //      - Update chat subject and lastMessage in chats list
  //   6. On error:
  //      - Remove tempUserMsg from activeChat.messages
  //      - Show toast with the error message
  //   7. Always setSendingMessage(false) in finally
  const sendTextMessage = async (question, subject) => {
    if (!activeChat) return;
    // TODO: implement
  };

  // ── sendImageMessage ───────────────────────────────────────
  // TODO: Implement sendImageMessage(imageFile, question, subject)
  // Same optimistic-update pattern as sendTextMessage, but:
  //   - tempUserMsg.inputType = 'image'
  //   - tempUserMsg.imageUrl  = URL.createObjectURL(imageFile)
  //   - tempUserMsg.content   = question || 'Analyzing image...'
  //   - API call: chatAPI.askImage(activeChat._id, imageFile, question, subject)
  const sendImageMessage = async (imageFile, question, subject) => {
    if (!activeChat) return;
    // TODO: implement
  };

  // ── sendVoiceMessage ───────────────────────────────────────
  // TODO: Implement sendVoiceMessage(audioBlob, subject)
  // Same optimistic-update pattern, but:
  //   - tempUserMsg.inputType = 'voice'
  //   - tempUserMsg.content   = 'Transcribing voice...'
  //   - API call: chatAPI.askVoice(activeChat._id, audioBlob, subject)
  //   - On success: also show a success toast with the transcript preview
  //     `Transcribed: "${data.transcript.substring(0, 50)}..."`
  const sendVoiceMessage = async (audioBlob, subject) => {
    if (!activeChat) return;
    // TODO: implement
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
