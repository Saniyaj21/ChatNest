import React, { useEffect, useRef } from 'react';
import TypingDots from './TypingDots';

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
        <TypingDots />
      </div>
    </>
  );
};

export default TypingIndicator; 