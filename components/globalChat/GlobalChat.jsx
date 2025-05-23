'use client'

import React, { useEffect, useState, useRef } from 'react';
import socket from '@/lib/socket';
import { useUser } from '@clerk/nextjs';

const GlobalChat = () => {
    const { user } = useUser();
    const userId = user?.id;
    const userName = user?.fullName || 'Anonymous';
    const userAvatar = user?.imageUrl || 'https://ui-avatars.com/api/?name=User';
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
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
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-100/60 via-white/80 to-purple-100/60 rounded-3xl shadow-2xl backdrop-blur-lg border border-white/40 sm:rounded-3xl sm:p-0 p-1">
            <div className="w-full max-w-2xl flex flex-col h-full sm:rounded-3xl rounded-2xl sm:overflow-hidden overflow-visible">
                {/* Header */}
                <div className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-4 border-b border-white/30 bg-white/30 sm:rounded-t-3xl rounded-t-xl shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div>
                            <h2 className="text-xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight drop-shadow-glow animate-glow">
                                Global Chat
                            </h2>
                            <span className="text-[10px] sm:text-xs text-gray-600 font-medium italic ml-1">Connect with everyone, everywhere.</span>
                        </div>
                    </div>
                    <span className="text-[10px] sm:text-xs text-blue-600 font-bold flex items-center gap-1">
                        <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        {activeUsers} active
                    </span>
                    {/* Glowing effect */}
                    <div className="absolute -top-10 -left-10 w-28 h-28 sm:w-40 sm:h-40 bg-gradient-to-br from-blue-400/30 via-purple-400/20 to-pink-400/10 rounded-full blur-2xl pointer-events-none animate-pulse-slow"></div>
                </div>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-2 sm:py-3 space-y-2 bg-white/40 backdrop-blur-md sm:rounded-b-3xl rounded-b-xl scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent transition-all duration-300">
                    {messages.map((msg, idx) => {
                        const isOwn = msg.userId === userId;
                        return (
                            <div
                                key={idx}
                                className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-fade-in`}
                            >
                                <div className={`flex items-end gap-2 max-w-[90vw] sm:max-w-lg ${isOwn ? 'flex-row-reverse' : ''}`}>
                                    <img
                                        src={msg.userAvatar || 'https://ui-avatars.com/api/?name=User'}
                                        alt={msg.userName || 'User'}
                                        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white shadow-md object-cover"
                                    />
                                    <div className={`relative px-3 sm:px-4 py-2 rounded-2xl shadow-md backdrop-blur-md ${isOwn ? 'bg-gradient-to-br from-blue-500/90 to-purple-500/80 text-white' : 'bg-white/80 text-gray-800 border border-blue-100'} transition-all duration-300 text-sm sm:text-base`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-xs sm:text-sm truncate max-w-[80px] sm:max-w-[120px]">{isOwn ? 'You' : msg.userName || 'User'}</span>
                                            <span className="font-mono text-[9px] sm:text-[10px] text-gray-400">
                                                {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </span>
                                        </div>
                                        <span className="leading-snug break-words">{msg.text || msg.message}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {/* Typing indicator */}
                    {typingUsers.filter(u => u.userId !== userId).length > 0 && (
                        <>
                            <style>{`
                                @keyframes typingWave {
                                    0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
                                    40% { transform: scale(1.2); opacity: 1; }
                                }
                            `}</style>
                            <div className="flex items-center gap-1 animate-fade-in ml-0 pl-0">
                                <div className="flex items-center -space-x-2">
                                    {typingUsers.filter(u => u.userId !== userId).map((u, idx) => (
                                        <img
                                            key={u.userId}
                                            src={u.userAvatar || 'https://ui-avatars.com/api/?name=User'}
                                            alt={u.userName || 'User'}
                                            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white shadow-md object-cover"
                                            style={{ zIndex: 10 + idx }}
                                        />
                                    ))}
                                </div>
                                <span className="flex items-center gap-0.5 ml-2">
                                    <span className="w-2.5 h-2.5 bg-blue-700 rounded-full inline-block" style={{ animation: 'typingWave 1.2s infinite ease-in-out both', animationDelay: '0s' }}></span>
                                    <span className="w-2.5 h-2.5 bg-blue-700 rounded-full inline-block" style={{ animation: 'typingWave 1.2s infinite ease-in-out both', animationDelay: '0.2s' }}></span>
                                    <span className="w-2.5 h-2.5 bg-blue-700 rounded-full inline-block" style={{ animation: 'typingWave 1.2s infinite ease-in-out both', animationDelay: '0.4s' }}></span>
                                </span>
                            </div>
                        </>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                {/* Input */}
                <form onSubmit={handleSend} className="flex gap-2 sm:gap-3 px-2 sm:px-6 py-2 sm:py-4 bg-white/30 sm:rounded-b-3xl rounded-b-xl border-t border-white/30 shadow-inner">
                    <input
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
                        className="bg-gradient-to-br from-blue-500 to-purple-500 text-white px-4 sm:px-6 py-2 rounded-xl font-semibold shadow-lg hover:scale-105 hover:from-blue-600 hover:to-purple-600 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                        disabled={!userId || !input.trim()}
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}

export default GlobalChat
