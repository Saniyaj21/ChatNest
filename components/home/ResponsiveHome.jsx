'use client'
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import GlobalChat from "@/components/globalChat/GlobalChat";
import AIChat from "@/components/AIChat/AIChat";
import GroupChat from "@/components/groupChat/GroupChat";


const groups = [
  { id: 1, name: 'Family', lastMessage: 'Dinner at 8?', avatar: null },
  { id: 2, name: 'Work', lastMessage: 'Meeting at 10am.', avatar: null },
  { id: 3, name: 'College Friends', lastMessage: 'Weekend plans?', avatar: null },
  { id: 4, name: 'Book Club', lastMessage: 'Next book: The Alchemist', avatar: null },
  { id: 5, name: 'Gaming Squad', lastMessage: 'Anyone up for Valorant?', avatar: null },
  { id: 6, name: 'Project Alpha', lastMessage: 'Code review needed', avatar: null },
  { id: 7, name: 'Yoga Class', lastMessage: 'Session at 7am tomorrow', avatar: null },
  { id: 8, name: 'Neighbors', lastMessage: 'Building meeting tonight', avatar: null },
  { id: 9, name: 'Travel Planning', lastMessage: 'Checking flight prices', avatar: null },
  { id: 10, name: 'Movie Club', lastMessage: 'New releases this week?', avatar: null },
  { id: 11, name: 'Football Team', lastMessage: 'Practice at 5pm', avatar: null },
  { id: 12, name: 'Photography', lastMessage: 'Amazing sunset shots!', avatar: null },
  { id: 13, name: 'Music Band', lastMessage: 'Rehearsal tomorrow', avatar: null },
  { id: 14, name: 'Cooking Class', lastMessage: 'Italian cuisine week', avatar: null },
  { id: 15, name: 'Tech Support', lastMessage: 'Server updates complete', avatar: null },
  { id: 16, name: 'Startup Team', lastMessage: 'Investor meeting prep', avatar: null },
  { id: 17, name: 'Language Exchange', lastMessage: '¡Hola! Practice time', avatar: null }
];

const ResponsiveHome = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // for overlay (desktop)
  const [selectedChat, setSelectedChat] = useState(null); // Always null initially for SSR

  // On mount, set to 'global' if desktop
  useEffect(() => {
    if (window.matchMedia('(min-width: 768px)').matches) {
      setSelectedChat('global');
    }
  }, []);

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
  const handleBackToSidebar = () => {
    setSelectedChat(null);
  };

  // Find the selected group object if a group is selected
  const selectedGroup = typeof selectedChat === 'number' ? groups.find(g => g.id === selectedChat) : null;

  return (
    <div className="flex h-screen bg-gray-100">      {/* Sidebar for desktop */}      
      <div className="hidden md:block h-full w-[320px]">
        <Sidebar
          groups={groups}
          onGroupClick={handleGroupClick}
          onGlobalChatClick={handleGlobalChatClick}
          onAIClick={handleAIClick}
          selectedChat={selectedChat === 'global' ? 'global' : selectedChat === 'ai' ? 'ai' : 'group'}
        />
      </div>
      {/* Mobile sidebar: show full screen if no chat selected */}
      <div className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ${selectedChat === null ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: selectedChat === null ? 'rgba(0,0,0,0.2)' : 'transparent' }}
      >
        <div
          className="h-full w-full  bg-gradient-to-br from-blue-100/60 via-white/80 to-purple-100/60 backdrop-blur-lg"
          onClick={e => e.stopPropagation()}
        >
          <Sidebar
            groups={groups}
            onGroupClick={handleGroupClick}
            onGlobalChatClick={handleGlobalChatClick}
            onAIClick={handleAIClick}
            selectedChat={selectedChat === 'global' ? 'global' : selectedChat === 'ai' ? 'ai' : 'group'}
            onClose={() => setSelectedChat(null)}
          />
        </div>
      </div>
      {/* Main content */}
      <div className="flex-1 flex flex-col h-full relative">
       
        <div className="flex-1 flex items-center justify-center h-full">
          {/* On mobile, only show chat if selectedChat is not null */}
          {(selectedChat === 'global' || selectedChat === 'ai' || selectedGroup) && (
            <div className="w-full h-full">
              {selectedChat === 'global' && <GlobalChat onBack={handleBackToSidebar} />}
              {selectedChat === 'ai' && <AIChat onBack={handleBackToSidebar} />}
              {selectedGroup && <GroupChat group={selectedGroup} onBack={handleBackToSidebar} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResponsiveHome; 