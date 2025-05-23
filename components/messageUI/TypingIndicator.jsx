import React, { useEffect, useRef } from 'react';

const TypingIndicator = ({ users = [] }) => {
  const typingRef = useRef(null);
  useEffect(() => {
    if (typingRef.current) {
      typingRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [users]);

  if (users.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes typingWave {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
          40% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
      <div ref={typingRef} className="flex items-center gap-1 animate-fade-in ml-0 pl-0 pb-4">
        <div className="flex items-center -space-x-2">
          {users.map((u, idx) => (
            <img
              key={u.userId || idx}
              src={u.userAvatar || 'https://ui-avatars.com/api/?name=User'}
              alt={u.userName || 'User'}
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white shadow-md object-cover"
              style={{ zIndex: 10 + idx }}
            />
          ))}
        </div>
        <span className="flex items-center gap-0.5 ml-2">
          <span className="w-2.5 h-2.5 bg-blue-700 rounded-full inline-block" style={{ animation: 'typingWave 1.2s infinite ease-in-out both', animationDelay: '0s' }}></span>
          <span className="w-2.5 h-2.5 bg-blue-700 rounded-full inline-block" style={{ animation: 'typingWave 1.2s infinite ease-in-out both', animationDelay: '0.2s' }}></span>
          <span className="w-2.5 h-2.5 bg-blue-700 rounded-full inline-block" style={{ animation: 'typingWave 1.2s infinite ease-in-out both', animationDelay: '0.4s' }}></span>
        </span>
      </div>
    </>
  );
};

export default TypingIndicator; 