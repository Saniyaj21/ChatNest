import React from 'react';

const MessageBubble = ({ isOwn, userAvatar, userName, timestamp, text }) => (
  <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-fade-in`}>
    <div className={`flex items-end gap-2 max-w-[90vw] sm:max-w-lg ${isOwn ? 'flex-row-reverse' : ''}`}>
      <img
        src={userAvatar || 'https://ui-avatars.com/api/?name=User'}
        alt={userName || 'User'}
        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white shadow-md object-cover"
      />
      <div className={`relative px-3 sm:px-4 py-2 rounded-2xl shadow-md backdrop-blur-md ${isOwn ? 'bg-gradient-to-br from-blue-500/90 to-purple-500/80 text-white' : 'bg-white/80 text-gray-800 border border-blue-100'} transition-all duration-300 text-sm sm:text-base`}>
        <div className="flex items-center gap-2 mb-1">
          {!isOwn && (
            <span className="font-bold text-xs sm:text-sm truncate max-w-[80px] sm:max-w-[120px]">{userName || 'User'}</span>
          )}
          <span className={`font-mono text-[9px] sm:text-[10px] ${isOwn ? 'text-blue-100 font-semibold' : 'text-gray-400'}`}>
            {timestamp ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
          </span>
        </div>
        <span className="leading-snug break-words">{text}</span>
      </div>
    </div>
  </div>
);

export default MessageBubble; 