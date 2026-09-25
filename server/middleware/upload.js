const multer = require('multer');
const path = require('path');
const fs = require('fs');

const imageUploadDir = path.join(__dirname, '../uploads/images');
const audioUploadDir = path.join(__dirname, '../uploads/audio');
[imageUploadDir, audioUploadDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imageUploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `img_${req.user.id}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, audioUploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `audio_${req.user.id}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const imageFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false);
};

const audioFilter = (req, file, cb) => {
  const allowed = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/mp4', 'audio/m4a'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only audio files (MP3, WAV, OGG, WebM, M4A) are allowed'), false);
};

const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024;

const uploadImage = multer({ storage: imageStorage, fileFilter: imageFilter, limits: { fileSize: maxSize } }).single('image');
const uploadAudio = multer({ storage: audioStorage, fileFilter: audioFilter, limits: { fileSize: maxSize } }).single('audio');

const handleImageUpload = (req, res, next) => {
  uploadImage(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
};

const handleAudioUpload = (req, res, next) => {
  uploadAudio(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
};

module.exports = { handleImageUpload, handleAudioUpload };