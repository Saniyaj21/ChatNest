'use client'
import React, { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import GlobalChat from "@/components/globalChat/GlobalChat";
import AIChat from "@/components/AIChat/AIChat";
import GroupChat from "@/components/groupChat/GroupChat";
import { FaBars } from "react-icons/fa";

const groups = [
  { id: 1, name: 'Family', lastMessage: 'Dinner at 8?', avatar: null },
  { id: 2, name: 'Work', lastMessage: 'Meeting at 10am.', avatar: null },
];

const ResponsiveHome = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState('global'); // 'global', 'ai', or group id

  // Handlers for chat selection
  const handleGlobalChatClick = () => {
    setSelectedChat('global');
    setSidebarOpen(false);
  };
  const handleAIClick = () => {
    setSelectedChat('ai');
    setSidebarOpen(false);
  };
  const handleGroupClick = (group) => {
    setSelectedChat(group.id);
    setSidebarOpen(false);
  };

  // Find the selected group object if a group is selected
  const selectedGroup = typeof selectedChat === 'number' ? groups.find(g => g.id === selectedChat) : null;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <div className="hidden md:block h-full">
        <Sidebar
          onGroupClick={handleGroupClick}
          onGlobalChatClick={handleGlobalChatClick}
          onAIClick={handleAIClick}
          selectedChat={selectedChat === 'global' ? 'global' : selectedChat === 'ai' ? 'ai' : 'group'}
        />
      </div>
      {/* Sidebar for mobile (drawer) */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: sidebarOpen ? "rgba(0,0,0,0.2)" : "transparent" }}
        onClick={() => setSidebarOpen(false)}
      >        <div
          className="h-full w-72 max-w-full bg-gradient-to-br from-blue-100/60 via-white/80 to-purple-100/60 backdrop-blur-lg"
          onClick={e => e.stopPropagation()}
        >
          <Sidebar
            onGroupClick={handleGroupClick}
            onGlobalChatClick={handleGlobalChatClick}
            onAIClick={handleAIClick}
            selectedChat={selectedChat === 'global' ? 'global' : selectedChat === 'ai' ? 'ai' : 'group'}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      </div>
      {/* Main content */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Mobile nav bar */}
        <div className="md:hidden flex items-center px-4 py-3 bg-white/80 border-b border-white/30 shadow-sm">
          <button
            className="mr-3 text-blue-600 text-2xl focus:outline-none"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <FaBars />
          </button>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
            ChatNest
          </span>
        </div>
        <div className="flex-1 flex items-center justify-center h-full">
          {selectedChat === 'global' && <GlobalChat />}
          {selectedChat === 'ai' && <AIChat />}
          {selectedGroup && <GroupChat group={selectedGroup} />}
        </div>
      </div>
    </div>
  );
};

export default ResponsiveHome; 