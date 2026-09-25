import { Brain, User, Image, Mic, FileText, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import toast from 'react-hot-toast';

const InputTypeBadge = ({ type }) => {
  const badges = {
    image: { icon: <Image className="w-3 h-3" />, label: 'Image', cls: 'bg-purple-100 text-purple-700' },
    voice: { icon: <Mic className="w-3 h-3" />, label: 'Voice', cls: 'bg-green-100 text-green-700' },
    text: { icon: <FileText className="w-3 h-3" />, label: 'Text', cls: 'bg-blue-100 text-blue-700' },
  };
  const badge = badges[type] || badges.text;
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-medium ${badge.cls}`}>
      {badge.icon} {badge.label}
    </span>
  );
};

const MarkdownRenderer = ({ content }) => (
  <ReactMarkdown
    className="markdown-content"
    remarkPlugins={[remarkGfm]}
    components={{
      code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');
        return !inline && match ? (
          <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" {...props}>
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        ) : (
          <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
            {children}
          </code>
        );
      },
    }}
  >
    {content}
  </ReactMarkdown>
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
      <div className="flex justify-end mb-3 animate-fade-in">
        <div className="flex flex-col items-end gap-1 max-w-[80%]">
          {message.imageUrl && (
            <img src={message.imageUrl} alt="Uploaded"
              className="rounded-xl max-w-xs max-h-64 object-contain border border-gray-200 mb-1" />
          )}
          {message.inputType === 'voice' && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
              <Mic className="w-3 h-3" />
              <span>Voice message transcribed</span>
            </div>
          )}
          <div className="bg-blue-600 text-white rounded-2xl rounded-br-sm px-4 py-2.5 shadow-sm">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
          <div className="flex items-center gap-2 px-1">
            <InputTypeBadge type={message.inputType} />
            <span className="text-xs text-gray-400">{timestamp}</span>
          </div>
        </div>
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 ml-2 mt-auto">
          <User className="w-4 h-4 text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5 mb-3 animate-fade-in">
      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
        <Brain className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 max-w-[90%]">
        <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-100 relative group">
          <button onClick={copyContent}
            className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <MarkdownRenderer content={message.content} />
        </div>
        <span className="text-xs text-gray-400 px-1 mt-1">{timestamp}</span>
      </div>
    </div>
  );
}