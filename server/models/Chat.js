const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  inputType: {
    type: String,
    enum: ['text', 'image', 'voice'],
    default: 'text',
  },
  imageUrl: { type: String, default: null },
  voiceUrl: { type: String, default: null },
  transcript: { type: String, default: null },
  timestamp: { type: Date, default: Date.now },
});

const ChatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    default: 'New Conversation',
    maxlength: 100,
  },
  subject: {
    type: String,
    enum: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'English', 'Computer Science', 'Economics', 'General', 'Other'],
    default: 'General',
  },
  messages: [MessageSchema],
  isArchived: { type: Boolean, default: false },
  lastActivity: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

// Auto-update lastActivity & generate title from first user message
ChatSchema.pre('save', function (next) {
  if (this.isModified('messages')) {
    this.lastActivity = new Date();
    if (this.title === 'New Conversation' && this.messages.length > 0) {
      const firstMsg = this.messages.find(m => m.role === 'user');
      if (firstMsg) {
        this.title = firstMsg.content.substring(0, 60) + (firstMsg.content.length > 60 ? '...' : '');
      }
    }
  }
  next();
});

module.exports = mongoose.model('Chat', ChatSchema);