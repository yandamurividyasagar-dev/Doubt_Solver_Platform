import { Brain, Mic, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import toast from 'react-hot-toast';

// Hardcoded colors (not relying on CSS custom properties) so the
// bubbles always render correctly even if index.css hasn't loaded.
const COLORS = {
  ink: '#1e2530',
  paper: '#f5f6f1',
  paperRaised: '#ffffff',
  inkFaint: '#8a92a1',
  studyTeal: '#2f6f62',
  ruleLine: '#dce1dd',
};

const MarkdownRenderer = ({ content }) => (
  <div className="markdown-content">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" {...props}>
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code {...props}>{children}</code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);

export default function MessageBubble({ message }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const copyContent = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success('Copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const timestamp = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  if (isUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', maxWidth: '80%' }}>
          {message.imageUrl && (
            <img
              src={message.imageUrl}
              alt="Uploaded"
              style={{ borderRadius: '10px', maxWidth: '20rem', maxHeight: '16rem', objectFit: 'contain', border: `1px solid ${COLORS.ruleLine}`, marginBottom: '4px' }}
            />
          )}
          {message.inputType === 'voice' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: COLORS.inkFaint, marginBottom: '2px' }}>
              <Mic className="w-3 h-3" />
              <span>Voice message transcribed</span>
            </div>
          )}
          <div
            style={{
              background: COLORS.ink,
              color: COLORS.paper,
              padding: '0.85rem 1.1rem',
              fontSize: '0.95rem',
              lineHeight: 1.65,
              borderRadius: '10px 10px 2px 10px',
              maxWidth: '68ch',
            }}
          >
            <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{message.content}</p>
          </div>
          <span style={{ fontSize: '0.75rem', color: COLORS.inkFaint, padding: '0 4px' }}>{timestamp}</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '1rem' }}>
      <div
        style={{
          width: '32px', height: '32px', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: COLORS.ink, flexShrink: 0, marginTop: '4px',
        }}
      >
        <Brain className="w-4 h-4" style={{ color: COLORS.paper }} />
      </div>
      <div style={{ flex: 1, maxWidth: '90%' }}>
        <div
          className="group"
          style={{
            position: 'relative',
            background: COLORS.paperRaised,
            color: COLORS.ink,
            borderLeft: `3px solid ${COLORS.studyTeal}`,
            borderRadius: '2px 10px 10px 2px',
            boxShadow: '0 1px 2px rgba(30,37,48,0.06), 0 1px 1px rgba(30,37,48,0.04)',
            padding: '0.85rem 1.1rem',
            fontSize: '0.95rem',
            lineHeight: 1.65,
          }}
        >
          <button
            onClick={copyContent}
            className="opacity-0 group-hover:opacity-100"
            style={{
              position: 'absolute', top: '10px', right: '10px',
              padding: '6px', borderRadius: '8px', transition: 'opacity 0.15s ease',
              color: COLORS.inkFaint,
            }}
          >
            {copied ? <Check className="w-3.5 h-3.5" style={{ color: COLORS.studyTeal }} /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <MarkdownRenderer content={message.content} />
        </div>
        <span style={{ fontSize: '0.75rem', color: COLORS.inkFaint, padding: '0 4px', marginTop: '4px', display: 'inline-block' }}>{timestamp}</span>
      </div>
    </div>
  );
}