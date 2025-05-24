'use client'

import Link from 'next/link';
import React, { useState, useMemo } from 'react';
import { FaSearch, FaUsers, FaGlobe, FaRobot, FaPlus } from 'react-icons/fa';

const fixedChats = [
  { id: 'global', name: 'Global Chat', icon: FaGlobe, iconColor: 'text-blue-500' },
  { id: 'ai', name: 'ChatNest AI', icon: FaRobot, iconColor: 'text-purple-500' }
];

const Sidebar = ({
  groups = [],
  onGroupClick,
  onGlobalChatClick,
  onAIClick,
  selectedChat,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter chats based on search query
  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return {
      fixedChats: fixedChats.filter(chat => 
        chat.name.toLowerCase().includes(query)
      ),
      groups: groups.filter(group => 
        group.name.toLowerCase().includes(query) || 
        group.lastMessage.toLowerCase().includes(query)
      )
    };
  }, [searchQuery]);

  return (
    <aside className="w-full h-full flex flex-col bg-blue-100 backdrop-blur-md">
      {/* Fixed Header Section */}
      <div className="sticky top-0 z-20 bg-blue-100/95 backdrop-blur-md">
        {/* Logo Header */}
        <div className="flex items-center px-6 py-5 border-b border-white/30 bg-white/30 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight drop-shadow-glow animate-glow">
              ChatNest
            </span>
          </div>
        </div>
        {/* Search Bar */}
        <div className="px-6 py-3 bg-white/40 backdrop-blur-md border-b border-white/20">
          <div className="flex items-center gap-2 bg-white/70 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400 transition">
            <FaSearch className="text-blue-400 text-lg" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats or groups..."
              className="bg-transparent outline-none flex-1 text-gray-700 placeholder-gray-400 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
        {/* Fixed Chats */}
        <div className="px-6 pt-4 pb-2 space-y-2">
          {filteredData.fixedChats.map(chat => {
            const Icon = chat.icon;
            const isSelected = selectedChat === chat.id;
            return (
              <div
                key={chat.id}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 cursor-pointer transition font-semibold text-base ${
                  isSelected 
                    ? `${chat.id === 'global' ? 'bg-blue-200/80 text-blue-900' : 'bg-purple-200/80 text-purple-900'}` 
                    : `bg-white/60 hover:${chat.id === 'global' ? 'bg-blue-100/80' : 'bg-purple-100/80'} text-gray-800`
                }`}
                onClick={chat.id === 'global' ? onGlobalChatClick : onAIClick}
              >
                <Icon className={`${chat.iconColor} text-lg`} />
                <span className="truncate">{chat.name}</span>
              </div>
            );
          })}
        </div>

        {/* Groups Section */}
        <div className="px-6 pt-4 pb-6">          <h2 className="text-base font-bold text-purple-700 mb-2 tracking-tight flex items-center gap-2">
            <FaUsers className="text-purple-400" /> Groups
            <Link
              href="/create-group"
              className="ml-auto flex items-center justify-center w-7 h-7 rounded-full bg-purple-200 hover:bg-purple-400 text-purple-700 hover:text-white transition-colors shadow"
              aria-label="Create group"
              onClick={() => console.log('Create group clicked')}
              type="button"
            >
              <FaPlus size={14} />
            </Link>
          </h2>
          <ul className="space-y-1">
            {filteredData.groups.map(group => (
              <li
                key={group.id}
                className="flex items-center gap-3 rounded-xl px-3 py-2 bg-white/60 hover:bg-purple-100/80 transition cursor-pointer"
                onClick={() => onGroupClick && onGroupClick(group)}
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-300 via-pink-200 to-blue-200 flex items-center justify-center border border-white">
                  <FaUsers className="text-purple-600 text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-gray-800 text-base truncate block">{group.name}</span>
                  <span className="text-gray-500 text-xs truncate block">{group.lastMessage}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;