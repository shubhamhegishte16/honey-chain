import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, MessageSquare, Loader2 } from 'lucide-react';
import { sendChatMessage } from '../../services/chatbot.service';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([
    { role: 'assistant', content: 'Hello! I am the WoolConnect AI Assistant. How can I help you today?' }
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
          className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 p-3 bg-primary hover:bg-primaryDark text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          aria-label="Open Chatbot"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 w-[90vw] sm:w-[380px] h-[500px] max-h-[80vh] bg-surface rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden animate-slide-in-right">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-primary text-white">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">WoolConnect Assistant</h3>
                <p className="text-[10px] text-primaryLight opacity-90">Powered by Gemini AI</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
            {history.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-sm' 
                      : 'bg-white border border-border text-textPrimary rounded-tl-sm'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm prose-p:leading-relaxed prose-pre:bg-gray-100 prose-pre:text-gray-800 max-w-none">
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
                <div className="bg-white border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-primary" />
                  <span className="text-xs text-textSecondary font-medium">Assistant is typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-border">
            <div className="flex items-end gap-2 bg-background rounded-xl border border-border focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all p-1">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
                placeholder="Ask anything..."
                className="flex-1 max-h-32 min-h-[44px] bg-transparent border-none focus:ring-0 resize-none py-3 px-3 text-sm text-textPrimary placeholder:text-textMuted"
                rows="1"
              />
              <button
                type="submit"
                disabled={!message.trim() || isLoading}
                className="m-1 p-2.5 bg-primary hover:bg-primaryDark text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
            <div className="text-center mt-2">
              <span className="text-[9px] text-textMuted">AI can make mistakes. Please verify important info.</span>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
