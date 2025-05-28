'use client'
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import GlobalChat from "@/components/globalChat/GlobalChat";
import AIChat from "@/components/AIChat/AIChat";
import GroupChat from "@/components/groupChat/GroupChat";
import { useUser } from '@clerk/nextjs';
import { backendURL } from '@/lib/socket';
import axios from 'axios';

const ResponsiveHome = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // for overlay (desktop)
  const [selectedChat, setSelectedChat] = useState(null); // Always null initially for SSR
  const [groups, setGroups] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const { user } = useUser();

  // On mount, set to 'global' if desktop
  useEffect(() => {
    if (window.matchMedia('(min-width: 768px)').matches) {
      setSelectedChat('global');
    }
  }, []);

  // Fetch accepted groups for the user
  useEffect(() => {
    const fetchGroups = async () => {
      if (!user) return;
      setGroupsLoading(true);
      try {
        const res = await axios.get(`${backendURL}/api/groups/accepted`, {
          params: { userId: user.id },
        });
        setGroups(res.data.groups || []);
      } catch (err) {
        setGroups([]);
      } finally {
        setGroupsLoading(false);
      }
    };
    fetchGroups();
  }, [user]);

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
    setSelectedChat(group);
    setSidebarOpen(false);
  };
  const handleBackToSidebar = () => {
    setSelectedChat(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">      {/* Sidebar for desktop */}      
      <div className="hidden md:block h-full w-[320px]">
        {groupsLoading ? (
          <div className="flex items-center justify-center h-full">Loading groups...</div>
        ) : (
          <Sidebar
            groups={groups}
            onGroupClick={handleGroupClick}
            onGlobalChatClick={handleGlobalChatClick}
            onAIClick={handleAIClick}
            selectedChat={selectedChat === 'global' ? 'global' : selectedChat === 'ai' ? 'ai' : 'group'}
          />
        )}
      </div>
      {/* Mobile sidebar: show full screen if no chat selected */}
      <div className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ${selectedChat === null ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: selectedChat === null ? 'rgba(0,0,0,0.2)' : 'transparent' }}
      >
        <div
          className="h-full w-full  bg-gradient-to-br from-blue-100/60 via-white/80 to-purple-100/60 backdrop-blur-lg"
          onClick={e => e.stopPropagation()}
        >
          {groupsLoading ? (
            <div className="flex items-center justify-center h-full">Loading groups...</div>
          ) : (
            <Sidebar
              groups={groups}
              onGroupClick={handleGroupClick}
              onGlobalChatClick={handleGlobalChatClick}
              onAIClick={handleAIClick}
              selectedChat={selectedChat === 'global' ? 'global' : selectedChat === 'ai' ? 'ai' : 'group'}
              onClose={() => setSelectedChat(null)}
            />
          )}
        </div>
      </div>
      {/* Main content */}
      <div className="flex-1 flex flex-col h-full relative">
       
        <div className="flex-1 flex items-center justify-center h-full">
          {/* On mobile, only show chat if selectedChat is not null */}
          {(selectedChat === 'global' || selectedChat === 'ai' || (selectedChat && selectedChat._id)) && (
            <div className="w-full h-full">
              {selectedChat === 'global' && <GlobalChat onBack={handleBackToSidebar} />}
              {selectedChat === 'ai' && <AIChat onBack={handleBackToSidebar} />}
              {selectedChat && selectedChat._id && <GroupChat group={selectedChat} onBack={handleBackToSidebar} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResponsiveHome; 