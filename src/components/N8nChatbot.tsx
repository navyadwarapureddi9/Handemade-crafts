import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  RotateCcw,
  Maximize2,
  Minimize2,
  Bot,
  User,
  ExternalLink,
  ChevronDown,
  Loader2,
  Info
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

const DEFAULT_GREETING = `Welcome to **CraftNest Artisan AI Concierge**!

I am connected directly to our live artisan workshop network and n8n workflow. I can help you:
* **Find authentic gifts** suited to any budget or occasion
* **Explore traditional techniques** like *Warli*, *Kalamkari*, *Dhokra*, and woodturning
* **Check custom commission feasibility** and sustainable materials

How may I assist your craft journey today?`;

const PROMPT_SUGGESTIONS = [
  'Find me a gift',
  'Meet the artisans',
  'Show me customizable pottery under ₹2000',
  'Sustainability check',
];

export const N8N_CHAT_WEBHOOK_URL =
  'https://navyadwarapureddi.app.n8n.cloud/webhook/906a3206-cab7-47f8-a0c6-7e62457927ad/chat';

// Helper to render markdown-like text with tables, lists, and bold text
const FormattedMessage: React.FC<{ content: string }> = ({ content }) => {
  // Check if content contains markdown table
  const lines = content.split('\n');
  const tableStartIndex = lines.findIndex((l) => l.trim().startsWith('|') && l.includes('|'));

  if (tableStartIndex !== -1) {
    // Collect table lines
    const beforeTable: string[] = [];
    const tableLines: string[] = [];
    const afterTable: string[] = [];
    let isTable = false;
    let tableEnded = false;

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!tableEnded && trimmed.startsWith('|') && trimmed.endsWith('|')) {
        isTable = true;
        tableLines.push(trimmed);
      } else if (isTable) {
        tableEnded = true;
        afterTable.push(line);
      } else {
        beforeTable.push(line);
      }
    });

    if (tableLines.length >= 2) {
      const headerCells = tableLines[0]
        .split('|')
        .slice(1, -1)
        .map((c) => c.trim());
      const bodyRows = tableLines.slice(2).map((row) =>
        row
          .split('|')
          .slice(1, -1)
          .map((c) => c.trim())
      );

      return (
        <div className="space-y-3">
          {beforeTable.length > 0 && (
            <FormattedText text={beforeTable.join('\n')} />
          )}
          <div className="overflow-x-auto my-2 rounded border border-[#DACFBD] bg-[#FAF7F2]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#EAE4D7] border-b border-[#DACFBD] text-[#24211D]">
                  {headerCells.map((h, i) => (
                    <th key={i} className="p-2 font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="border-b border-[#EDE5D8] last:border-b-0 hover:bg-[#F4EFE6]"
                  >
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-2 text-[#4A453E] whitespace-nowrap">
                        <FormattedText text={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {afterTable.length > 0 && (
            <FormattedText text={afterTable.join('\n')} />
          )}
        </div>
      );
    }
  }

  return <FormattedText text={content} />;
};

// Formats inline markdown (bold, italic, list items, headers)
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split('\n');

  return (
    <div className="space-y-1.5 leading-relaxed text-xs">
      {parts.map((p, idx) => {
        const trimmed = p.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Header ###
        if (trimmed.startsWith('###')) {
          return (
            <h4 key={idx} className="font-editorial text-sm font-semibold text-[#211E1C] mt-2 pt-1 border-t border-[#EAE3D4]">
              {trimmed.replace(/^###\s*/, '')}
            </h4>
          );
        }

        // Horizontal line
        if (trimmed === '***' || trimmed === '---') {
          return <hr key={idx} className="border-t border-[#DACFBD] my-2" />;
        }

        // Bullet point
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          const itemText = trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1">
              <span className="text-[#C85A32] font-bold">•</span>
              <span>{renderInlineMarkdown(itemText)}</span>
            </div>
          );
        }

        return <p key={idx}>{renderInlineMarkdown(p)}</p>;
      })}
    </div>
  );
};

function renderInlineMarkdown(str: string) {
  // Regex to match **bold** or *italic*
  const tokens = [];
  let remaining = str;
  let keyCounter = 0;

  // Simple token parser for **bold** and *italic*
  const parts = remaining.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-[#211E1C]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={i} className="italic text-[#7A5C4D]">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}

interface N8nChatbotProps {
  isOpenExternally?: boolean;
  onToggleExternal?: () => void;
}

export const N8nChatbot: React.FC<N8nChatbotProps> = ({
  isOpenExternally,
  onToggleExternal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => {
    const existing = sessionStorage.getItem('terraloom_n8n_session');
    if (existing) return existing;
    const newId = `patron-${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('terraloom_n8n_session', newId);
    return newId;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = sessionStorage.getItem('terraloom_n8n_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [
      {
        id: 'msg-init',
        sender: 'bot',
        text: DEFAULT_GREETING,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync external open request
  useEffect(() => {
    if (isOpenExternally !== undefined && isOpenExternally !== isOpen) {
      setIsOpen(isOpenExternally);
    }
  }, [isOpenExternally]);

  // Persist messages to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('terraloom_n8n_messages', JSON.stringify(messages));
    } catch (e) {
      // storage full
    }
  }, [messages]);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Attempt 1: Via backend proxy endpoint (/api/n8n-chat) to eliminate browser CORS
      let response = await fetch('/api/n8n-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatInput: query,
          message: query,
          sessionId,
        }),
      });

      // Attempt 2: If proxy fails (e.g. static host without server), fallback to direct webhook
      if (!response.ok) {
        response = await fetch(N8N_CHAT_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatInput: query,
            message: query,
            sessionId,
          }),
        });
      }

      if (!response.ok) {
        throw new Error(`n8n webhook error: HTTP ${response.status}`);
      }

      const data = await response.json();
      const botResponseText =
        data.output ||
        data.response ||
        data.text ||
        data.message ||
        (typeof data === 'string' ? data : JSON.stringify(data));

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'bot',
        text: `I had trouble reaching the workshop cloud service. Please ensure the n8n webhook is online, or try asking your question again in a moment.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    const resetList: ChatMessage[] = [
      {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        text: DEFAULT_GREETING,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
    setMessages(resetList);
    sessionStorage.removeItem('terraloom_n8n_messages');
  };

  const toggleOpen = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (onToggleExternal) onToggleExternal();
  };

  return (
    <aside aria-label="Artisan Chatbot Assistant" className="fixed bottom-5 right-5 z-50">
      {/* Floating Activator Button */}
      {!isOpen && (
        <button
          onClick={toggleOpen}
          className="group flex items-center gap-3 bg-[#24211D] hover:bg-[#A43F1B] text-[#FAF7F2] p-3 sm:px-4 sm:py-3 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 border border-[#443E3A] cursor-pointer"
          aria-label="Open CraftNest Artisan AI Concierge"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-[#C85A32] flex items-center justify-center text-white shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#506B52] border-2 border-[#24211D] animate-pulse"></span>
          </div>

          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold tracking-wide">Artisan AI Concierge</span>
            <span className="text-[10px] text-stone-400 font-light flex items-center gap-1">
              <span>n8n Live Workflow</span>
              <span className="text-[#E27D60]">✦</span>
            </span>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`bg-[#FAF7F2] border border-[#DACFBD] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${
            isExpanded
              ? 'w-[95vw] sm:w-[600px] h-[85vh] max-h-[850px]'
              : 'w-[92vw] sm:w-[420px] h-[540px]'
          }`}
        >
          {/* Header */}
          <div className="bg-[#24211D] text-[#FAF7F2] p-4 flex items-center justify-between border-b border-[#3E3832] shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-[#C85A32] flex items-center justify-center text-white">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#506B52] rounded-full border-2 border-[#24211D]"></span>
              </div>
              <div>
                <h3 className="font-editorial text-base font-semibold leading-tight">
                  CraftNest Concierge
                </h3>
                <div className="flex items-center gap-1.5 text-[10px] text-stone-400">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#506B52]"></span>
                  <span>Live n8n Cloud Webhook</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1 text-stone-400">
              <button
                onClick={handleResetChat}
                title="Restart Conversation"
                className="p-1.5 hover:text-white hover:bg-stone-800 rounded transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Compact View' : 'Expand View'}
                className="p-1.5 hover:text-white hover:bg-stone-800 rounded transition-colors cursor-pointer"
              >
                {isExpanded ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                onClick={toggleOpen}
                title="Close Chat"
                className="p-1.5 hover:text-white hover:bg-stone-800 rounded transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Webhook Status Info Bar */}
          <div className="bg-[#F2ECE1] border-b border-[#E3DAC9] px-3 py-1.5 text-[11px] text-[#7A5C4D] flex items-center justify-between">
            <span className="truncate flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#C85A32]" />
              <span>Real-Time Artisan Inventory & Storytelling</span>
            </span>
            <span className="text-[10px] font-mono text-stone-500 shrink-0">
              ID: {sessionId.slice(0, 8)}
            </span>
          </div>

          {/* Message Thread */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FAF7F2]">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-full bg-[#EAE2D3] border border-[#DACFBD] flex items-center justify-center text-[#A43F1B] shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs shadow-2xs ${
                      isUser
                        ? 'bg-[#C85A32] text-white rounded-br-xs'
                        : 'bg-[#F5EFE6] text-[#24211D] border border-[#E3DAC9] rounded-bl-xs'
                    }`}
                  >
                    {isUser ? (
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      <FormattedMessage content={msg.text} />
                    )}

                    <div
                      className={`text-[9px] mt-1.5 text-right ${
                        isUser ? 'text-white/70' : 'text-stone-400'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-full bg-[#3D3730] flex items-center justify-center text-white shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing / Loading indicator */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start items-center text-xs text-[#7A5C4D]">
                <div className="w-7 h-7 rounded-full bg-[#EAE2D3] border border-[#DACFBD] flex items-center justify-center text-[#A43F1B] shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-[#F5EFE6] border border-[#E3DAC9] rounded-2xl px-4 py-2.5 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C85A32]" />
                  <span className="italic">Querying artisan database via n8n...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-[#F5EFE6] border-t border-[#E8E1D5] overflow-x-auto flex items-center gap-1.5 scrollbar-none">
            {PROMPT_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSendMessage(suggestion)}
                disabled={isLoading}
                className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#DACFBD] text-[#4A453E] hover:border-[#C85A32] hover:text-[#C85A32] transition-colors cursor-pointer disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#FAF7F2] border-t border-[#E8E1D5] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about gifts, pottery, textiles..."
              disabled={isLoading}
              className="flex-1 bg-[#F2ECE1] border border-transparent focus:border-[#C85A32] focus:bg-white text-xs py-2.5 px-3.5 rounded-full outline-none text-[#24211D] placeholder:text-stone-400 transition-all"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="w-9 h-9 rounded-full bg-[#C85A32] hover:bg-[#A43F1B] text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-xs"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </aside>
  );
};
