import React from 'react';

const ActiveUsersIndicator = ({ count }) => (
  <span className="text-[10px] sm:text-xs text-blue-600 font-bold flex items-center gap-1">
    <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
    {count} active
  </span>
);

export default ActiveUsersIndicator; 