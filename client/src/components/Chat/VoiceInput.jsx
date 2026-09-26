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
    <div className="card" style={{ padding: '1rem' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-sm" style={{ color: 'var(--ink)' }}>Voice Input</h3>
        <button onClick={onCancel} style={{ color: 'var(--ink-faint)' }}>
          <X className="w-4 h-4" />
        </button>
      </div>

      {status === 'idle' && (
        <div className="text-center py-4">
          <p className="text-sm mb-4" style={{ color: 'var(--ink-soft)' }}>Press the button and speak your doubt clearly</p>
          <button
            onClick={startRecording}
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
            style={{ background: 'var(--error)', color: '#fff', boxShadow: 'var(--shadow-card)' }}
          >
            <Mic className="w-7 h-7" />
          </button>
          <p className="text-xs mt-3" style={{ color: 'var(--ink-faint)' }}>Max 2 minutes</p>
        </div>
      )}

      {status === 'recording' && (
        <div className="text-center py-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="recording-dot" />
            <span className="font-medium text-sm" style={{ color: 'var(--error)' }}>Recording...</span>
          </div>
          <p className="text-3xl font-mono font-bold mb-4" style={{ color: 'var(--ink)' }}>{formatTime(duration)}</p>
          <button
            onClick={stopRecording}
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto"
            style={{ background: 'var(--ink)', color: 'var(--paper)', boxShadow: 'var(--shadow-card)' }}
          >
            <Square className="w-5 h-5" />
          </button>
          <p className="text-xs mt-2" style={{ color: 'var(--ink-faint)' }}>Tap to stop</p>
        </div>
      )}

      {status === 'stopped' && (
        <div className="py-2">
          <p className="text-sm mb-3 text-center" style={{ color: 'var(--ink-soft)' }}>
            Recording complete ({formatTime(duration)})
          </p>
          {audioUrl && <audio controls src={audioUrl} className="w-full mb-4 rounded-lg" />}
          <div className="flex gap-2">
            <button onClick={handleDiscard} className="btn btn-secondary flex-1 justify-center text-sm">
              <X className="w-4 h-4" /> Discard
            </button>
            <button onClick={handleSend} disabled={disabled} className="btn btn-primary flex-1 justify-center text-sm">
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