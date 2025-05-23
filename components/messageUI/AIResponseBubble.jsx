'use client'

import React from 'react';
import ReactMarkdown from 'react-markdown';

const AIResponseBubble = ({ message }) => {
  return (
    <div className="flex items-start space-x-2 mb-3 group">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm shadow-lg transform transition-transform group-hover:scale-110">
        🤖
      </div>
      <div className="flex-1">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 shadow-md max-w-[85%] transform transition-all duration-200 hover:bg-white/90 hover:shadow-lg">
          <div className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">ChatNest AI</div>
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown 
              components={{
                code: ({ node, ...props }) => (
                  <code className="bg-gray-100/80 rounded px-1 py-0.5 text-gray-800" {...props} />
                ),
                pre: ({ node, ...props }) => (
                  <pre className="bg-gray-100/80 rounded-lg p-3 overflow-x-auto" {...props} />
                )
              }}
            >
              {message}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIResponseBubble;
