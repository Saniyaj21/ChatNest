'use client'

import React, { useEffect, useState, useRef } from 'react';
import socket from '@/lib/socket';
import { useUser } from '@clerk/nextjs';
import MessageBubble from '../messageUI/MessageBubble';
import TypingIndicator from '../messageUI/TypingIndicator';
import ActiveUsersIndicator from '../messageUI/ActiveUsersIndicator';
import { IoSendSharp } from "react-icons/io5";

const GlobalChat = () => {
    const { user } = useUser();
    const userId = user?.id;
    const userName = user?.fullName || 'Anonymous';
    const userAvatar = user?.imageUrl || 'https://ui-avatars.com/api/?name=User';
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const typingRef = useRef(null);
    const inputRef = useRef(null);
    const [activeUsers, setActiveUsers] = useState(1);
    const [typingUsers, setTypingUsers] = useState([]);

    useEffect(() => {
        const onConnect = () => console.log('Socket connected:', socket.id);
        const onDisconnect = () => console.log('Socket disconnected');
        const onGlobalMessage = (msg) => {
            setMessages((prev) => [...prev, msg]);
            setTypingUsers((prev) => prev.filter((u) => u.userId !== msg.userId));
        };
        const onActiveUsers = (count) => setActiveUsers(count);
        const onTyping = (typingData) => {
            setTypingUsers((prev) => {
                // Remove if already present
                const filtered = prev.filter((u) => u.userId !== typingData.userId);
                if (typingData.isTyping) {
                    return [...filtered, typingData];
                } else {
                    return filtered;
                }
            });
        };

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('global message', onGlobalMessage);
        socket.on('active users', onActiveUsers);
        socket.on('typing', onTyping);

        // Clean up on unmount
        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('global message', onGlobalMessage);
            socket.off('active users', onActiveUsers);
            socket.off('typing', onTyping);
        };
    }, []);

    useEffect(() => {
        // Scroll to bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        // Scroll to typing indicator if present
        if (typingRef.current) {
            typingRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [typingUsers]);

    const typingTimeout = useRef();
    const handleInputChange = (e) => {
        setInput(e.target.value);
        if (!userId) return;
        socket.emit('typing', { userId, userName, userAvatar, isTyping: true });
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => {
            socket.emit('typing', { userId, userName, userAvatar, isTyping: false });
        }, 1200);
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (input.trim() !== '' && userId) {
            socket.emit('global message', {
                text: input,
                userId,
                userName,
                userAvatar,
                timestamp: new Date().toISOString(),
            });
            setInput('');
            socket.emit('typing', { userId, userName, userAvatar, isTyping: false });
            // Focus input after sending message
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    };



    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-100/60 via-white/80 to-purple-100/60  shadow-2xl backdrop-blur-lg border border-white/40  sm:p-0 p-1">
            <div className="w-full max-w-2xl flex flex-col h-full sm:overflow-hidden overflow-visible">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-3 sm:px-6 py-2 sm:py-4 border-b border-white/30 bg-white/30 backdrop-blur-md shadow-sm  overflow-hidden">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div>
                            <h2 className="text-xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight drop-shadow-glow animate-glow">
                                Global Chat
                            </h2>
                            <span className="text-[10px] sm:text-xs text-gray-600 font-medium italic ml-1">Connect with everyone, everywhere.</span>
                        </div>
                    </div>
                    <ActiveUsersIndicator count={activeUsers} />
                    {/* Glowing effect */}
                    <div className="absolute -top-10 -left-10 w-28 h-28 sm:w-40 sm:h-40 bg-gradient-to-br from-blue-400/30 via-purple-400/20 to-pink-400/10 rounded-full blur-2xl pointer-events-none animate-pulse-slow"></div>
                </div>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-2 sm:py-3 space-y-2 bg-white/40 backdrop-blur-md sm:rounded-b-3xl rounded-b-xl scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent transition-all duration-300">
                    <div className="pt-4 flex flex-col justify-end min-h-full">
                        {messages.map((msg, idx) => (
                            <MessageBubble
                                key={idx}
                                isOwn={msg.userId === userId}
                                userAvatar={msg.userAvatar}
                                userName={msg.userName}
                                timestamp={msg.timestamp}
                                text={msg.text || msg.message}
                            />
                        ))}
                        <TypingIndicator users={typingUsers.filter(u => u.userId !== userId)} />
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
                        onChange={handleInputChange}
                        placeholder="Type your message..."
                        disabled={!userId}
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        className="bg-gradient-to-br from-blue-500 to-purple-500 text-white px-4 sm:px-6 py-2 rounded-xl font-semibold shadow-lg hover:scale-105 hover:from-blue-600 hover:to-purple-600 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base flex items-center justify-center"
                        disabled={!userId || !input.trim()}
                    >
                        <span className="sm:hidden flex items-center"><IoSendSharp size={20} /></span>
                        <span className="hidden sm:inline">Send</span>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default GlobalChat
