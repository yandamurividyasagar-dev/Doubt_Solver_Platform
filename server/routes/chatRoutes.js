const express = require('express');
const router = express.Router();
const {
  getChats, getChatById, createChat,
  askTextDoubt, askImageDoubt, askVoiceDoubt,
  deleteChat, getStats,
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');
const { handleImageUpload, handleAudioUpload } = require('../middleware/upload');

router.use(protect);

router.get('/stats', getStats);
router.get('/', getChats);
router.post('/', createChat);
router.get('/:id', getChatById);
router.delete('/:id', deleteChat);

router.post('/:id/text', askTextDoubt);
router.post('/:id/image', handleImageUpload, askImageDoubt);
router.post('/:id/voice', handleAudioUpload, askVoiceDoubt);

module.exports = router;