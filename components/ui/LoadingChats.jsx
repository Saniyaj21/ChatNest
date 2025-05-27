import React from 'react';

const chatBubbles = [
  {
    width: 'w-56',
    delay: 'animate-delay-0',
    align: 'self-start',
    color: 'bg-white/70 backdrop-blur-md border border-blue-100',
  },
  {
    width: 'w-56',
    delay: 'animate-delay-150',
    align: 'self-end',
    color: 'bg-gradient-to-br from-blue-500/80 to-purple-400/80 text-white',
  },
  {
    width: 'w-56',
    delay: 'animate-delay-300',
    align: 'self-start',
    color: 'bg-white/70 backdrop-blur-md border border-purple-100',
  },
];

const LoadingChats = () => {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-blue-100">
      <div className="flex flex-col items-center justify-center py-12 px-2">
        <div className="flex flex-col gap-4 w-full max-w-md sm:max-w-lg">
          {chatBubbles.map((bubble, i) => (
            <div
              key={i}
              className={`flex ${bubble.align} animate-pulse ${bubble.delay}`}
            >
              <div className={`h-10 ${bubble.width} rounded-2xl ${bubble.color} flex items-center px-4 shadow-md`}></div>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center">
          <div className="flex items-center gap-1 mb-2">
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
            <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
            <span className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
          </div>
          <span className="text-lg font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-wide drop-shadow-lg select-none">
            Loading Chats...
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingChats; 