import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, X, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VoiceInput({ onRecorded, onCancel, disabled }) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'recording' | 'stopped'
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopStream();
    };
  }, []);

  const stopStream = () => {
    if (mediaRecorderRef.current?.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setStatus('stopped');
        stopStream();
      };

      mediaRecorder.start(250);
      setStatus('recording');
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration(d => {
          if (d >= 120) { stopRecording(); return d; } // Max 2 minutes
          return d + 1;
        });
      }, 1000);
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        toast.error('Microphone access denied. Please allow microphone permissions.');
      } else {
        toast.error('Could not access microphone.');
      }
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleSend = () => {
    if (audioBlob) onRecorded(audioBlob);
  };

  const handleDiscard = () => {
    stopRecording();
    setAudioBlob(null);
    setAudioUrl(null);
    setStatus('idle');
    setDuration(0);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-sm text-gray-700">Voice Input</h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      {status === 'idle' && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500 mb-4">Press the button and speak your doubt clearly</p>
          <button onClick={startRecording}
            className="w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Mic className="w-7 h-7" />
          </button>
          <p className="text-xs text-gray-400 mt-3">Max 2 minutes</p>
        </div>
      )}

      {status === 'recording' && (
        <div className="text-center py-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-500 font-medium text-sm">Recording...</span>
          </div>
          <p className="text-3xl font-mono font-bold text-gray-900 mb-4">{formatTime(duration)}</p>
          <button onClick={stopRecording}
            className="w-14 h-14 bg-gray-800 hover:bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Square className="w-5 h-5" />
          </button>
          <p className="text-xs text-gray-400 mt-2">Tap to stop</p>
        </div>
      )}

      {status === 'stopped' && (
        <div className="py-2">
          <p className="text-sm text-gray-600 mb-3 text-center">Recording complete ({formatTime(duration)})</p>
          {audioUrl && <audio controls src={audioUrl} className="w-full mb-4 rounded-lg" />}
          <div className="flex gap-2">
            <button onClick={handleDiscard} className="btn-secondary flex-1 text-sm py-2">
              <X className="w-4 h-4" /> Discard
            </button>
            <button onClick={handleSend} disabled={disabled} className="btn-primary flex-1 text-sm py-2">
              {disabled
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                : <><Send className="w-4 h-4" /> Send</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}