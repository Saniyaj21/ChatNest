'use client'

import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import MessageBubble from '../messageUI/MessageBubble';
import AIResponseBubble from '../messageUI/AIResponseBubble';
import { IoSendSharp } from "react-icons/io5";
import TypingDots from '../messageUI/TypingDots';

const AIChat = () => {
  const { user } = useUser();
  const userId = user?.id;
  const userName = user?.fullName || 'Anonymous';
  const userAvatar = user?.imageUrl || 'https://ui-avatars.com/api/?name=User';
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim() === '' || !userId || isLoading) return;

    const userMessage = {
      text: input,
      userId,
      userName,
      userAvatar,
      timestamp: new Date().toISOString(),
      isUser: true
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input , context : messages }),
      });

      const data = await response.json();
      
      if (data.success) {
        const aiMessage = {
          text: data.aiResponse,
          timestamp: new Date().toISOString(),
          isAI: true
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.message || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        text: "I apologize, but I'm having trouble generating a response right now. Please try again.",
        timestamp: new Date().toISOString(),
        isAI: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-100/60 via-white/80 to-purple-100/60 shadow-2xl backdrop-blur-lg border border-white/40 sm:p-0 p-1">
      <div className="w-full max-w-2xl flex flex-col h-full sm:overflow-hidden overflow-visible">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-3 sm:px-6 py-2 sm:py-4 border-b border-white/30 bg-white/30 backdrop-blur-md shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 sm:gap-3">
            <div>
              <h2 className="text-xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight drop-shadow-glow animate-glow">
                ChatNest AI
              </h2>
              <span className="text-[10px] sm:text-xs text-gray-600 font-medium italic ml-1">Your AI assistant, ready to help.</span>
            </div>
          </div>
          {/* Glowing effect */}
          <div className="absolute -top-10 -left-10 w-28 h-28 sm:w-40 sm:h-40 bg-gradient-to-br from-blue-400/30 via-purple-400/20 to-pink-400/10 rounded-full blur-2xl pointer-events-none animate-pulse-slow"></div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-2 sm:py-3 space-y-2 bg-white/40 backdrop-blur-md sm:rounded-b-3xl rounded-b-xl scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent transition-all duration-300">
          <div className="pt-4 flex flex-col justify-end min-h-full">
            {messages.map((message, index) => (
              message.isAI ? (
                <AIResponseBubble key={index} message={message.text} />
              ) : (
                <MessageBubble
                  key={index}
                  isOwn={true}
                  userAvatar={message.userAvatar}
                  userName={message.userName}
                  timestamp={message.timestamp}
                  text={message.text}
                />
              )
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm shadow-lg">
                  🤖
                </div>
               <TypingDots />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="flex gap-2 sm:gap-3 px-2 sm:px-6 py-2 sm:py-4 bg-white/30 sm:rounded-b-3xl rounded-b-xl border-t border-white/30 shadow-inner">
          <input
            ref={inputRef}
            autoFocus
            name="chat-message"
            className="flex-1 border-none rounded-xl px-2 sm:px-4 py-2 bg-white/70 focus:bg-white/90 focus:ring-2 focus:ring-blue-400 outline-none text-gray-800 placeholder-gray-400 shadow-md transition-all duration-200 text-sm sm:text-base"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask ChatNest AI anything..."
            disabled={isLoading}
            autoComplete="off"
          />
          <button
            type="submit"
            className="bg-gradient-to-br from-blue-500 to-purple-500 text-white px-4 sm:px-6 py-2 rounded-xl font-semibold shadow-lg hover:scale-105 hover:from-blue-600 hover:to-purple-600 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base flex items-center justify-center"
            disabled={isLoading || !input.trim()}
          >
            <span className="sm:hidden flex items-center"><IoSendSharp size={20} /></span>
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChat;