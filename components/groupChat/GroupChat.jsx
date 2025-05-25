import React from 'react';

const GroupChat = (props) => {
  const { group, onBack } = props;
  if (!group) return null;
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-100/60 via-white/80 to-purple-100/60 shadow-2xl backdrop-blur-lg border border-white/40 sm:p-0 p-1">
      <div className="w-full max-w-2xl flex flex-col h-full sm:overflow-hidden overflow-visible">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-3 sm:px-6 py-2 sm:py-4 border-b border-white/30 bg-white/30 backdrop-blur-md shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile: back arrow and title */}
            <div className="flex items-center gap-2 sm:hidden">
              <button onClick={onBack} className="focus:outline-none p-1" aria-label="Back to sidebar">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <img src="/chatnest-logo.png" alt="ChatNest Logo" className="h-7 w-7 object-contain" />
              <h2 className="text-xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight drop-shadow-glow animate-glow flex items-center gap-2">
                <span>👥</span> {group.name}
              </h2>
            </div>
            {/* Desktop: original header */}
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <img src="/chatnest-logo.png" alt="ChatNest Logo" className="h-8 w-8 object-contain" />
                <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight drop-shadow-glow animate-glow flex items-center gap-2">
                  <span>👥</span> {group.name}
                </h2>
              </div>
            </div>
          </div>
          {/* Glowing effect */}
          <div className="absolute -top-10 -left-10 w-28 h-28 sm:w-40 sm:h-40 bg-gradient-to-br from-blue-400/30 via-purple-400/20 to-pink-400/10 rounded-full blur-2xl pointer-events-none animate-pulse-slow"></div>
        </div>
        {/* Content */}
        <div className="flex-1 w-full overflow-y-auto bg-white/40 backdrop-blur-md sm:rounded-b-3xl rounded-b-xl transition-all duration-300">
          <div className="text-gray-600 text-lg p-4">Group chat coming soon...</div>
        </div>
      </div>
    </div>
  );
};

export default GroupChat; 