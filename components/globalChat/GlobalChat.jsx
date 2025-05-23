'use client'

import React, { useEffect, useState, useRef } from 'react';
import socket from '@/lib/socket';
import { useUser } from '@clerk/nextjs';

const GlobalChat = () => {
    const { user } = useUser();
    const userId = user?.id;
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const [activeUsers, setActiveUsers] = useState(1);

    useEffect(() => {
        const onConnect = () => console.log('Socket connected:', socket.id);
        const onDisconnect = () => console.log('Socket disconnected');
        const onGlobalMessage = (msg) => {
            setMessages((prev) => [...prev, msg]);
        };
        const onActiveUsers = (count) => setActiveUsers(count);

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('global message', onGlobalMessage);
        socket.on('active users', onActiveUsers);

        // Clean up on unmount
        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('global message', onGlobalMessage);
            socket.off('active users', onActiveUsers);
        };
    }, []);

    useEffect(() => {
        // Scroll to bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (input.trim() !== '' && userId) {
            socket.emit('global message', { text: input, userId });
            setInput('');
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
                                <div
                                    className={`relative px-3 sm:px-4 py-2 rounded-2xl max-w-[90vw] sm:max-w-lg shadow-md backdrop-blur-md ${isOwn ? 'bg-gradient-to-br from-blue-500/90 to-purple-500/80 text-white' : 'bg-white/80 text-gray-800 border border-blue-100'} transition-all duration-300 text-sm sm:text-base`}
                                >
                                    <span className="font-mono text-[9px] sm:text-[10px] text-gray-300 block mb-1">
                                        {isOwn ? 'You' : (msg.userId?.slice(-4) || 'user')}
                                    </span>
                                    <span className="leading-snug break-words">{msg.text || msg.message}</span>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>
                {/* Input */}
                <form onSubmit={handleSend} className="flex gap-2 sm:gap-3 px-2 sm:px-6 py-2 sm:py-4 bg-white/30 sm:rounded-b-3xl rounded-b-xl border-t border-white/30 shadow-inner">
                    <input
                        className="flex-1 border-none rounded-xl px-2 sm:px-4 py-2 bg-white/70 focus:bg-white/90 focus:ring-2 focus:ring-blue-400 outline-none text-gray-800 placeholder-gray-400 shadow-md transition-all duration-200 text-sm sm:text-base"
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
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
