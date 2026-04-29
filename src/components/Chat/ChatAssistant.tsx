import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { getGeminiResponse } from '../../lib/gemini';
import { sampleQuestions } from '../../data/electionData';
import { logEvent } from '../../lib/firebase';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      text: "Namaste! I am Voter Mitra, your AI assistant. I can analyze trends, explain procedures, or help with your voting plan. How can I assist you today?", 
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [lastMessageTime, setLastMessageTime] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    // Security: Basic Rate Limiting (Requirement 4)
    const now = Date.now();
    if (now - lastMessageTime < 1000) {
      console.warn("Rate limit exceeded");
      return;
    }
    setLastMessageTime(now);
    
    const userMsg: Message = { 
      id: Date.now(), 
      text: text.trim().substring(0, 500), // Security: Input truncation
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    
    logEvent('chat_query', { query: text.substring(0, 50) });

    try {
      const response = await getGeminiResponse(text);
      const botMsg: Message = { 
        id: Date.now() + 1, 
        text: response, 
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  // Efficiency: Memoized message bubbles
  const messageList = React.useMemo(() => (
    messages.map((msg) => (
      <div 
        key={msg.id} 
        className={`message-wrapper ${msg.sender}`}
      >
        <div className="message-bubble">
          <span className="sr-only">{msg.sender === 'user' ? 'You said:' : 'Assistant said:'}</span>
          {msg.text}
        </div>
        <span className="message-time">
          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    ))
  ), [messages]);

  return (
    <div className="chat-interface" aria-label="AI Voter Assistant Chat">
      <div className="chat-header">
        <div className="bot-avatar">
          <Bot size={24} />
        </div>
        <div>
          <h3>Voter Mitra AI</h3>
          <p>Powered by Gemini 1.5 Flash</p>
        </div>
      </div>

      <div className="chat-messages" role="log" aria-live="polite">
        {messageList}
        {isTyping && (
          <div className="message-wrapper bot">
            <div className="message-bubble typing">
              <div className="dot" />
              <div className="dot" />
              <div className="dot" />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="chat-footer">
        <div className="quick-replies">
          {sampleQuestions.slice(0, 3).map((q, i) => (
            <button 
              key={i} 
              className="chip" 
              onClick={() => handleSend(q)}
              aria-label={`Ask: ${q}`}
            >
              {q}
            </button>
          ))}
        </div>
        
        <form 
          className="input-container" 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        >
          <input 
            type="text" 
            placeholder="Type your question..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Message input"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isTyping}
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
