import { useState, useRef, useContext } from 'react';
import { Send, Image, Mic, X, Loader2, ChevronDown } from 'lucide-react';
import { ChatContext } from '../../context/ChatContext';
import VoiceInput from './VoiceInput';
import toast from 'react-hot-toast';

const SUBJECTS = ['General', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'English', 'Computer Science', 'Economics'];

export default function InputArea({ subject: initialSubject }) {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showVoice, setShowVoice] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(initialSubject || 'General');
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);
  const [mode, setMode] = useState('text'); // 'text' | 'image'
  const fileInputRef = useRef();
  const textareaRef = useRef();

  const { sendTextMessage, sendImageMessage, sendVoiceMessage, sendingMessage } = useContext(ChatContext);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be under 10MB');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setMode('image');
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setMode('text');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendText = async () => {
    const q = text.trim();
    if (!q) return;
    setText('');
    await sendTextMessage(q, selectedSubject);
  };

  const handleSendImage = async () => {
    if (!imageFile) return;
    const q = text.trim();
    const file = imageFile;
    removeImage();
    setText('');
    await sendImageMessage(file, q, selectedSubject);
  };

  const handleVoiceRecorded = async (audioBlob) => {
    setShowVoice(false);
    await sendVoiceMessage(audioBlob, selectedSubject);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (mode === 'image') handleSendImage();
      else handleSendText();
    }
  };

  if (showVoice) {
    return (
      <VoiceInput
        onRecorded={handleVoiceRecorded}
        onCancel={() => setShowVoice(false)}
        disabled={sendingMessage}
      />
    );
  }

  return (
    <div className="space-y-2">
      {imagePreview && (
        <div className="relative inline-block">
          <img src={imagePreview} alt="Preview" className="h-24 rounded-xl border border-gray-200 object-contain" />
          <button onClick={removeImage}
            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="relative flex-shrink-0">
          <button onClick={() => setShowSubjectPicker(p => !p)}
            className="flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg">
            {selectedSubject}
            <ChevronDown className="w-3 h-3" />
          </button>
          {showSubjectPicker && (
            <div className="absolute bottom-full mb-1 left-0 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 min-w-[160px]">
              {SUBJECTS.map(s => (
                <button key={s}
                  onClick={() => { setSelectedSubject(s); setShowSubjectPicker(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 ${selectedSubject === s ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={mode === 'image'
            ? 'Add a question about the image (optional)...'
            : 'Ask your doubt... (Shift+Enter for new line)'}
          rows={1}
          disabled={sendingMessage}
          className="flex-1 resize-none input-field py-2.5 pr-3 text-sm leading-relaxed min-h-[44px] max-h-[160px]"
        />

        <button onClick={() => fileInputRef.current?.click()} disabled={sendingMessage}
          className={`p-2.5 rounded-lg ${mode === 'image' ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:bg-gray-100'}`}>
          <Image className="w-5 h-5" />
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />

        <button onClick={() => setShowVoice(true)} disabled={sendingMessage}
          className="p-2.5 text-gray-500 hover:bg-gray-100 hover:text-green-600 rounded-lg">
          <Mic className="w-5 h-5" />
        </button>

        <button onClick={mode === 'image' ? handleSendImage : handleSendText}
          disabled={sendingMessage || (!text.trim() && !imageFile)}
          className="btn-primary px-3 py-2.5">
          {sendingMessage
            ? <Loader2 className="w-5 h-5 animate-spin" />
            : <Send className="w-5 h-5" />}
        </button>
      </div>

      <p className="text-xs text-gray-400 text-center">
        AI can make mistakes. Verify important information.
      </p>
    </div>
  );
}