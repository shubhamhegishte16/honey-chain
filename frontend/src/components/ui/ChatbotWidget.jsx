import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, MessageSquare, Loader2, Sparkles } from 'lucide-react';
import { sendChatMessage } from '../../services/chatbot.service';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([
    { role: 'assistant', content: 'Namaste! I am the Honey Chain AI Assistant. How can I help you with apiary health, harvest logging, NMR purity certificates, or APMC Mandi rates today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useAuth();
  const location = useLocation();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [history, isOpen]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    
    // Add user message to history
    const updatedHistory = [...history, { role: 'user', content: userMessage }];
    setHistory(updatedHistory);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(userMessage, history, {
        role: profile?.role || 'guest',
        page: location.pathname
      });

      const messageText = response?.data?.message || response?.message;

      if (messageText) {
        setHistory([...updatedHistory, { role: 'assistant', content: messageText }]);
      } else {
        setHistory([...updatedHistory, { role: 'assistant', content: 'Sorry, I received an empty response. Please try again.' }]);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      setHistory([...updatedHistory, { role: 'assistant', content: 'Sorry, I am having trouble connecting to the server right now. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 p-3.5 bg-burgundy hover:bg-[#6e1616] text-warmIvory rounded-full shadow-lg shadow-burgundy/25 hover:shadow-xl transition-all transform hover:scale-105 border border-honeyGold/30"
          aria-label="Open Honey Chain Assistant"
        >
          <div className="relative">
            <MessageSquare size={22} className="text-honeyGold" />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-honeyGold animate-ping"></span>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-[400px] h-[520px] max-h-[82vh] bento-card shadow-2xl flex flex-col overflow-hidden animate-slide-in-right font-sans border border-border">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-burgundy text-warmIvory border-b border-honeyGold/20">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-honeyGold/20 rounded-xl text-honeyGold border border-honeyGold/30">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-warmIvory">Honey Chain AI</h3>
                <p className="text-[10px] text-honeyGold font-mono">Powered by KVIC & Gemini</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/15 rounded-xl transition-colors text-warmIvory/80 hover:text-warmIvory"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-warmIvory/60">
            {history.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs shadow-xs leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-burgundy text-warmIvory rounded-tr-sm' 
                      : 'bg-warmIvory border border-border text-deepBrown rounded-tl-sm'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-xs max-w-none text-deepBrown prose-p:my-1 prose-headings:text-deepBrown prose-strong:text-burgundy">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-warmIvory border border-border rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-xs flex items-center gap-2 text-deepBrown">
                  <Loader2 size={15} className="animate-spin text-burgundy" />
                  <span className="text-xs text-deepBrown/70 font-medium">Assistant is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-warmIvory border-t border-border">
            <div className="flex items-center gap-2 bg-warmIvory border border-border rounded-2xl focus-within:border-burgundy focus-within:ring-2 focus-within:ring-burgundy/15 transition-all p-1">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about moisture test, mandi rates, lots..."
                className="flex-1 min-h-[38px] bg-transparent border-none focus:outline-none px-3 text-xs text-deepBrown placeholder:text-deepBrown/40"
              />
              <button
                type="submit"
                disabled={!message.trim() || isLoading}
                className="p-2.5 bg-burgundy hover:bg-burgundy/90 text-warmIvory rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0 shadow-xs"
              >
                <Send size={15} className="text-honeyGold" />
              </button>
            </div>
            <div className="text-center mt-1.5">
              <span className="text-[9px] text-deepBrown/50">Honey Chain AI • KVIC National Beekeeping Knowledge Base</span>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
