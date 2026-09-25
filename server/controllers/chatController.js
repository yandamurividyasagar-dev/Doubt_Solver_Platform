const Chat = require('../models/Chat');
const User = require('../models/User');
const { solveTextDoubt, solveImageDoubt, solveVoiceDoubt, detectSubject } = require('../services/geminiService');
const { transcribeAudio, isSpeechServiceAvailable } = require('../services/speechService');
const fs = require('fs');

// @desc    Get all chats for current user
// @route   GET /api/chats
const getChats = async (req, res) => {
  const chats = await Chat.find({ user: req.user._id, isArchived: false })
    .select('title subject lastActivity messages createdAt')
    .sort({ lastActivity: -1 });

  const chatSummaries = chats.map(chat => ({
    _id: chat._id,
    title: chat.title,
    subject: chat.subject,
    lastActivity: chat.lastActivity,
    messageCount: chat.messages.length,
    lastMessage: chat.messages.length > 0
      ? chat.messages[chat.messages.length - 1].content.substring(0, 100)
      : '',
    createdAt: chat.createdAt,
  }));

  res.json({ success: true, chats: chatSummaries });
};

// @desc    Get a single chat with all messages
// @route   GET /api/chats/:id
const getChatById = async (req, res) => {
  const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
  if (!chat) {
    return res.status(404).json({ success: false, message: 'Chat not found' });
  }
  res.json({ success: true, chat });
};

// @desc    Create a new chat
// @route   POST /api/chats
const createChat = async (req, res) => {
  const { subject } = req.body;
  const chat = await Chat.create({ user: req.user._id, subject: subject || 'General' });
  res.status(201).json({ success: true, chat });
};

// @desc    Delete a chat
// @route   DELETE /api/chats/:id
const deleteChat = async (req, res) => {
  const chat = await Chat.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!chat) {
    return res.status(404).json({ success: false, message: 'Chat not found' });
  }
  res.json({ success: true, message: 'Chat deleted successfully' });
};

// @desc    Get user statistics for the dashboard
// @route   GET /api/chats/stats
const getStats = async (req, res) => {
  const chats = await Chat.find({ user: req.user._id, isArchived: false });

  const subjectCounts = {};
  let totalMessages = 0;

  chats.forEach(chat => {
    subjectCounts[chat.subject] = (subjectCounts[chat.subject] || 0) + 1;
    totalMessages += chat.messages.filter(m => m.role === 'user').length;
  });

  res.json({
    success: true,
    stats: {
      totalChats: chats.length,
      totalDoubts: totalMessages,
      subjectBreakdown: subjectCounts,
    },
  });
};

// @desc    Ask a text-based doubt
// @route   POST /api/chats/:id/text
const askTextDoubt = async (req, res) => {
  const { question, subject } = req.body;

  if (!question || question.trim() === '') {
    return res.status(400).json({ success: false, message: 'Question cannot be empty' });
  }

  let chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
  if (!chat) {
    return res.status(404).json({ success: false, message: 'Chat not found' });
  }

  const recentHistory = chat.messages.slice(-10);

  // Auto-detect subject on first message
  let chatSubject = subject || chat.subject;
  if (chat.messages.length === 0 && chatSubject === 'General') {
    chatSubject = detectSubject(question);
    chat.subject = chatSubject;
  }

  chat.messages.push({ role: 'user', content: question, inputType: 'text' });
  const answer = await solveTextDoubt(question, chatSubject, recentHistory);
  chat.messages.push({ role: 'assistant', content: answer, inputType: 'text' });
  await chat.save();

  await User.findByIdAndUpdate(req.user._id, { $inc: { totalDoubts: 1 } });

  const addedMessages = chat.messages.slice(-2);
  res.json({
    success: true,
    userMessage: addedMessages[0],
    assistantMessage: addedMessages[1],
    subject: chat.subject,
  });
};

// @desc    Ask an image-based doubt
// @route   POST /api/chats/:id/image
const askImageDoubt = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Image file is required' });
  }

  const { question, subject } = req.body;

  let chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
  if (!chat) {
    fs.unlinkSync(req.file.path);
    return res.status(404).json({ success: false, message: 'Chat not found' });
  }

  const imagePath = req.file.path;
  const imageUrl = `/uploads/images/${req.file.filename}`;
  const chatSubject = subject || chat.subject;

  try {
    chat.messages.push({
      role: 'user',
      content: question || 'Please analyze this image and solve/explain it.',
      inputType: 'image',
      imageUrl,
    });

    const answer = await solveImageDoubt(imagePath, question, chatSubject);
    chat.messages.push({ role: 'assistant', content: answer, inputType: 'image' });

    if (chat.subject === 'General' && chat.messages.length <= 2) {
      chat.subject = detectSubject(question || 'Image analysis');
    }

    await chat.save();
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalDoubts: 1 } });

    const addedMessages = chat.messages.slice(-2);
    res.json({
      success: true,
      userMessage: addedMessages[0],
      assistantMessage: addedMessages[1],
      subject: chat.subject,
    });
  } catch (error) {
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    throw error;
  }
};

// @desc    Ask a voice doubt
// @route   POST /api/chats/:id/voice
const askVoiceDoubt = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Audio file is required' });
  }

  if (!isSpeechServiceAvailable()) {
    fs.unlinkSync(req.file.path);
    return res.status(503).json({
      success: false,
      message: 'Speech-to-text service not configured. Please add your AssemblyAI API key.',
    });
  }

  const { subject } = req.body;

  let chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
  if (!chat) {
    fs.unlinkSync(req.file.path);
    return res.status(404).json({ success: false, message: 'Chat not found' });
  }

  const audioPath = req.file.path;
  const audioUrl = `/uploads/audio/${req.file.filename}`;
  const chatSubject = subject || chat.subject;

  try {
    const transcript = await transcribeAudio(audioPath);
    const recentHistory = chat.messages.slice(-10);

    chat.messages.push({
      role: 'user',
      content: transcript,
      inputType: 'voice',
      voiceUrl: audioUrl,
      transcript,
    });

    const answer = await solveVoiceDoubt(transcript, chatSubject, recentHistory);
    chat.messages.push({ role: 'assistant', content: answer, inputType: 'voice' });

    if (chat.subject === 'General' && chat.messages.length <= 2) {
      chat.subject = detectSubject(transcript);
    }

    await chat.save();
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalDoubts: 1 } });

    const addedMessages = chat.messages.slice(-2);
    res.json({
      success: true,
      transcript,
      userMessage: addedMessages[0],
      assistantMessage: addedMessages[1],
      subject: chat.subject,
    });
  } catch (error) {
    if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
    throw error;
  }
};

module.exports = {
  getChats, getChatById, createChat, deleteChat, getStats,
  askTextDoubt, askImageDoubt, askVoiceDoubt,
};