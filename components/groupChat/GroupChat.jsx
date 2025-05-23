import React from 'react';

const GroupChat = ({ group }) => {
  if (!group) return null;
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-100/60 via-white/80 to-purple-100/60">
      <div className="text-3xl font-bold text-blue-700 mb-2 flex items-center gap-2">
        <span>👥</span> {group.name}
      </div>
      <div className="text-gray-600 text-lg">Group chat coming soon...</div>
    </div>
  );
};

export default GroupChat; 