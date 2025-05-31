'use client'

import React, { useEffect, useState, useRef } from 'react';
import socket, { backendURL } from '@/lib/socket';
import { useUser } from '@clerk/nextjs';
import MessageBubble from '../messageUI/MessageBubble';
import TypingIndicator from '../messageUI/TypingIndicator';
import { IoSendSharp } from "react-icons/io5";
import { FiImage, FiX } from "react-icons/fi";
import { FaUsers, FaEllipsisV } from 'react-icons/fa';
import GroupSidebar from './GroupSidebar';

const GroupChat = (props) => {
    const { group, onBack, onGroupDeleted, onGroupImageChanged } = props;
    const { user } = useUser();
    const userId = user?.id;
    const [userProfile, setUserProfile] = useState(null);
    const [showGroupSidebar, setShowGroupSidebar] = useState(false);
    const userName = userProfile?.userName || user?.fullName || 'Anonymous';
    const userAvatar = userProfile?.userAvatar || user?.imageUrl || 'https://ui-avatars.com/api/?name=User';
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const typingRef = useRef(null);
    const inputRef = useRef(null);
    const [typingUsers, setTypingUsers] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
    const [uploadedImagePublicId, setUploadedImagePublicId] = useState(null);
    const [activeGroupUsers, setActiveGroupUsers] = useState([]);
    const [groupImage, setGroupImage] = useState(group.imageUrl);

    if (!group) return null;

    // Load all previous group messages from the API
    useEffect(() => {
        fetch(`${backendURL}/api/group-messages?groupId=${group._id}`)
            .then(res => res.json())
            .then(data => {
                setMessages(data);
            })
            .catch(err => console.error('Failed to load group messages:', err));
    }, [group._id]);

    // Fetch user profile
    useEffect(() => {
        if (userId) {
            fetch(`${backendURL}/api/user/profile?userId=${userId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.user) {
                        setUserProfile(data.user);
                    }
                })
                .catch(err => console.error('Failed to load user profile:', err));
        }
    }, [userId]);

    useEffect(() => {
        // Emit setUser for disconnect cleanup
        if (userId) {
            socket.emit('setUser', {
                userId,
                userName,
                userAvatar,
            });
        }
    }, [userId, userName, userAvatar]);

    useEffect(() => {
        // Join the group room with user info
        if (userId) {
            socket.emit('joinGroup', {
                groupId: group._id,
                user: {
                    userId,
                    userName,
                    userAvatar,
                },
            });
        }

        const onGroupMessage = (msg) => {
            setMessages((prev) => [...prev, msg]);
            // Remove typing indicator when message is received
            setTypingUsers((prev) => prev.filter((u) => u.userId !== msg.userId));
        };

        const onGroupTyping = (typingData) => {
            // Only update typing users if the event is for this group
            if (typingData.groupId === group._id) {
                setTypingUsers((prev) => {
                    // Remove if already present
                    const filtered = prev.filter((u) => u.userId !== typingData.userId);
                    if (typingData.isTyping) {
                        return [...filtered, typingData];
                    } else {
                        return filtered;
                    }
                });
            }
        };

        // Listen for group-specific events
        socket.on(`groupMessage:${group._id}`, onGroupMessage);
        socket.on(`groupTyping:${group._id}`, onGroupTyping);
        // Listen for active users in group
        const onGroupActiveUsers = (users) => {
            setActiveGroupUsers(users);
        };
        socket.on('groupActiveUsers', onGroupActiveUsers);
        // Clean up on unmount
        return () => {
            socket.off(`groupMessage:${group._id}`, onGroupMessage);
            socket.off(`groupTyping:${group._id}`, onGroupTyping);
            socket.off('groupActiveUsers', onGroupActiveUsers);
            if (userId) {
                socket.emit('leaveGroup', {
                    groupId: group._id,
                    user: {
                        userId,
                        userName,
                        userAvatar,
                    },
                });
            }
        };
    }, [group._id, userId, userName, userAvatar]);

    useEffect(() => {
        // Scroll to bottom when messages change
        if (messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
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
        socket.emit('groupTyping', { 
            userId, 
            userName, 
            userAvatar, 
            isTyping: true,
            groupId: group._id 
        });
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => {
            socket.emit('groupTyping', { 
                userId, 
                userName, 
                userAvatar, 
                isTyping: false,
                groupId: group._id 
            });
        }, 1200);
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!userId) return;
        if ((input.trim() !== '' || uploadedImageUrl) && userId) {
            const messageData = {
                text: input,
                userId,
                userName,
                userAvatar,
                groupId: group._id,
                timestamp: new Date().toISOString(),
                image: uploadedImageUrl,
                imagePublicId: uploadedImagePublicId
            };
            socket.emit('groupMessage', messageData);
            setInput('');
            setImageFile(null);
            setImagePreview(null);
            setUploadedImagePublicId(null);
            setUploadedImageUrl(null);
            socket.emit('groupTyping', { 
                userId, 
                userName, 
                userAvatar, 
                isTyping: false,
                groupId: group._id 
            });
            // Focus input after sending message
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    };

    const handleImagePick = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(null);
            setUploadedImageUrl(null);
            setUploadedImagePublicId(null);
            setImageUploading(true);
            const formData = new FormData();
            formData.append('image', file);
            try {
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });
                const data = await res.json();
                if (res.ok && data.url) {
                    setUploadedImageUrl(data.url);
                    if (data.public_id) setUploadedImagePublicId(data.public_id);
                    setImagePreview(data.url);
                } else {
                    alert(data.error || 'Image upload failed');
                }
            } catch (err) {
                alert('Image upload failed');
            } finally {
                setImageUploading(false);
            }
        }
    };

    const handleRemoveImage = async () => {
        if (uploadedImagePublicId) {
            setImagePreview(null);
            try {
                const res = await fetch('/api/delete-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ public_id: uploadedImagePublicId }),
                });
            } catch (err) {
                console.error('Image delete error:', err);
            }
        }
        setImageFile(null);
        setUploadedImageUrl(null);
        setUploadedImagePublicId(null);
    };

    const toggleGroupSidebar = () => {
        setShowGroupSidebar(prev => !prev);
    };

    // Update groupImage when group prop changes (e.g., when switching groups)
    useEffect(() => {
        setGroupImage(group.imageUrl);
    }, [group.imageUrl]);

    // Handler for group image change from sidebar
    const handleGroupImageChangedLocal = (newImageUrl) => {
        setGroupImage(newImageUrl);
        if (typeof onGroupImageChanged === 'function') {
            onGroupImageChanged();
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-100/60 via-white/80 to-purple-100/60 shadow-2xl backdrop-blur-lg border border-white/40 sm:p-0 p-1">
            <div className="w-full max-w-4xl flex flex-col h-full">
                {/* Header */}
                <div className="sticky top-0 z-10 flex flex-col px-3 sm:px-6 py-2 sm:py-4 border-b border-white/30 bg-white/30 backdrop-blur-md shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between">
                        {/* MOBILE HEADER */}
                        <div className="flex items-center gap-2 sm:hidden">
                            <button onClick={onBack} className="focus:outline-none p-1" aria-label="Back to sidebar">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-300 via-pink-200 to-blue-200 border border-white shadow-md overflow-hidden">
                                {groupImage ? (
                                    <img 
                                        src={groupImage} 
                                        alt={group.name} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FaUsers className="text-purple-600 text-lg" />
                                )}
                            </div>
                            <div className="flex flex-col items-start">
                                <h2 className="text-xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight drop-shadow-glow animate-glow">
                                    {group.name}
                                </h2>
                                <div className="flex items-center gap-1 mt-1">
                                    {activeGroupUsers.slice(0, 5).map((u, idx) => (
                                        <span
                                            key={u.userId}
                                            className="relative"
                                            style={{
                                                zIndex: 10 - idx,
                                                marginLeft: idx === 0 ? 0 : -6,
                                            }}
                                            title={u.userName || u.userId}
                                        >
                                            <img
                                                src={u.userAvatar}
                                                alt={u.userName || u.userId}
                                                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-white shadow object-cover"
                                                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
                                            />
                                            {/* Green online indicator */}
                                            <span className="absolute bottom-0 right-0 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 border-2 border-white rounded-full"></span>
                                        </span>
                                    ))}
                                    {activeGroupUsers.length > 5 && (
                                        <span
                                            className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-200 border flex items-center justify-center text-[10px] sm:text-xs font-semibold text-gray-600 shadow"
                                            style={{ marginLeft: -6, zIndex: 4 }}
                                            title={`${activeGroupUsers.length - 5} more`}
                                        >
                                            +{activeGroupUsers.length - 5}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* DESKTOP HEADER */}
                        <div className="hidden sm:flex items-center gap-2">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-300 via-pink-200 to-blue-200 border border-white shadow-md overflow-hidden">
                                {groupImage ? (
                                    <img 
                                        src={groupImage} 
                                        alt={group.name} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FaUsers className="text-purple-600 text-xl" />
                                )}
                            </div>
                            <div className="flex flex-col items-start">
                                <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight drop-shadow-glow animate-glow">
                                    {group.name}
                                </h2>
                                <div className="flex items-center gap-1 mt-1">
                                    {activeGroupUsers.slice(0, 5).map((u, idx) => (
                                        <span
                                            key={u.userId}
                                            className="relative"
                                            style={{
                                                zIndex: 10 - idx,
                                                marginLeft: idx === 0 ? 0 : -6,
                                            }}
                                            title={u.userName || u.userId}
                                        >
                                            <img
                                                src={u.userAvatar}
                                                alt={u.userName || u.userId}
                                                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-white shadow object-cover"
                                                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
                                            />
                                            {/* Green online indicator */}
                                            <span className="absolute bottom-0 right-0 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 border-2 border-white rounded-full"></span>
                                        </span>
                                    ))}
                                    {activeGroupUsers.length > 5 && (
                                        <span
                                            className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-200 border flex items-center justify-center text-[10px] sm:text-xs font-semibold text-gray-600 shadow"
                                            style={{ marginLeft: -6, zIndex: 4 }}
                                            title={`${activeGroupUsers.length - 5} more`}
                                        >
                                            +{activeGroupUsers.length - 5}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Group Menu Button */}
                        <button 
                            onClick={toggleGroupSidebar}
                            className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-full hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            aria-label="Group menu"
                        >
                            <FaEllipsisV className="text-xl" />
                        </button>
                        {/* Glowing effect */}
                        <div className="absolute -top-10 -left-10 w-28 h-28 sm:w-40 sm:h-40 bg-gradient-to-br from-blue-400/30 via-purple-400/20 to-pink-400/10 rounded-full blur-2xl pointer-events-none animate-pulse-slow"></div>
                    </div>
                </div>

                {/* Group Sidebar */}
                <GroupSidebar 
                    isOpen={showGroupSidebar}
                    onClose={toggleGroupSidebar}
                    group={group}
                    onGroupDeleted={onGroupDeleted}
                    onGroupImageChanged={handleGroupImageChangedLocal}
                />

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
                                text={msg.text}
                                image={msg.image}
                                onImageLoad={() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
                            />
                        ))}
                        <TypingIndicator users={typingUsers.filter(u => u.userId !== userId)} />
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Image Preview */}
                {(imagePreview || imageUploading) && (
                    <div className="flex items-center gap-2 px-2 pb-2">
                        {imageUploading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-16 h-16 flex items-center justify-center">
                                    <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                    </svg>
                                </div>
                                <span className="text-blue-500 font-semibold">Uploading image...</span>
                            </div>
                        ) : (
                            <>
                                <img src={imagePreview} alt="Preview" className="max-h-32 rounded-lg border border-gray-300 shadow" />
                                <button type="button" onClick={handleRemoveImage} className="ml-2 p-2 text-xs bg-gradient-to-br from-blue-200 to-purple-200 text-blue-700 rounded hover:from-blue-300 hover:to-purple-300 hover:text-purple-700 transition flex items-center justify-center shadow-sm border border-blue-100">
                                    <FiX size={16} />
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* Input */}
                <form onSubmit={handleSend} className="flex gap-2 sm:gap-3 px-2 sm:px-6 py-2 sm:py-4 bg-white/30 sm:rounded-b-3xl rounded-b-xl border-t border-white/30 shadow-inner">
                    {/* Image Picker Icon - only show if no image is selected or uploading */}
                    {!(imagePreview || imageUploading) && (
                        <label htmlFor="image-upload" className="flex items-center cursor-pointer text-blue-500 hover:text-purple-500 transition-colors">
                            <FiImage size={24} />
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImagePick}
                                disabled={!userId}
                            />
                        </label>
                    )}
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
                        disabled={!userId || imageUploading || (!input.trim() && !uploadedImageUrl)}
                    >
                        <span className="sm:hidden flex items-center"><IoSendSharp size={20} /></span>
                        <span className="hidden sm:inline">Send</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GroupChat; 