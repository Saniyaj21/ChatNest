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
    const { group, onBack } = props;
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

    if (!group) return null;

    // Load all previous group messages from the API
    useEffect(() => {
        fetch(`${backendURL}/api/group-messages?groupId=${group._id}`)
            .then(res => res.json())
            .then(data => {
                console.log('Fetched group messages:', data);
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
                        console.log('Fetched user profile:', data.user);
                        setUserProfile(data.user);
                    }
                })
                .catch(err => console.error('Failed to load user profile:', err));
        }
    }, [userId]);

    useEffect(() => {
        // Join the group room
        socket.emit('joinGroup', group._id);

        const onGroupMessage = (msg) => {
            console.log('Received group message:', msg);
            setMessages((prev) => [...prev, msg]);
            // Remove typing indicator when message is received
            setTypingUsers((prev) => prev.filter((u) => u.userId !== msg.userId));
        };

        const onGroupTyping = (typingData) => {
            console.log('Received typing event:', typingData);
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

        // Clean up on unmount
        return () => {
            socket.off(`groupMessage:${group._id}`, onGroupMessage);
            socket.off(`groupTyping:${group._id}`, onGroupTyping);
            socket.emit('leaveGroup', group._id);
        };
    }, [group._id]);

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
            console.log('Sending message with data:', messageData);
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
            console.log('Selected file:', file);
            setImageFile(file);
            setImagePreview(null);
            setUploadedImageUrl(null);
            setUploadedImagePublicId(null);
            setImageUploading(true);
            const formData = new FormData();
            formData.append('image', file);
            try {
                console.log('Uploading image to Cloudinary...');
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });
                const data = await res.json();
                console.log('Upload response:', data);
                if (res.ok && data.url) {
                    setUploadedImageUrl(data.url);
                    if (data.public_id) setUploadedImagePublicId(data.public_id);
                    setImagePreview(data.url);
                    console.log('Image uploaded successfully:', { url: data.url, public_id: data.public_id });
                } else {
                    console.error('Upload failed:', data.error);
                    alert(data.error || 'Image upload failed');
                }
            } catch (err) {
                console.error('Image upload error:', err);
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
                const data = await res.json();
                console.log('Delete response:', data);
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

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-100/60 via-white/80 to-purple-100/60 shadow-2xl backdrop-blur-lg border border-white/40 sm:p-0 p-1">
            <div className="w-full max-w-4xl flex flex-col h-full">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-3 sm:px-6 py-2 sm:py-4 border-b border-white/30 bg-white/30 backdrop-blur-md shadow-sm overflow-hidden">
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Mobile: back arrow and title */}
                        <div className="flex items-center gap-2 sm:hidden">
                            <button onClick={onBack} className="focus:outline-none p-1" aria-label="Back to sidebar">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-300 via-pink-200 to-blue-200 border border-white shadow-md">
                                <FaUsers className="text-purple-600 text-lg" />
                            </div>
                            <h2 className="text-xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight drop-shadow-glow animate-glow">
                                {group.name}
                            </h2>
                        </div>
                        {/* Desktop: original header */}
                        <div className="hidden sm:block">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-300 via-pink-200 to-blue-200 border border-white shadow-md">
                                    <FaUsers className="text-purple-600 text-xl" />
                                </div>
                                <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight drop-shadow-glow animate-glow">
                                    {group.name}
                                </h2>
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

                {/* Group Sidebar */}
                <GroupSidebar 
                    isOpen={showGroupSidebar}
                    onClose={toggleGroupSidebar}
                    group={group}
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