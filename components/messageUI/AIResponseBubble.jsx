'use client'

import React from 'react';
import ReactMarkdown from 'react-markdown';

const AIResponseBubble = ({ message }) => {
  return (
    <div className="flex items-start space-x-2 mb-3 group">
      <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 overflow-hidden">
        <img src="/chatnest-logo.png" alt="ChatNest Logo" className="w-7 h-7 object-contain" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 shadow-md transform transition-all duration-200 hover:bg-white/90 hover:shadow-lg w-fit max-w-[calc(100vw-5rem)] sm:max-w-[85%]">
          <div className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">ChatNest AI</div>
          <div className="prose prose-sm max-w-none prose-pre:max-w-full prose-pre:overflow-x-auto">
            <ReactMarkdown 
              components={{                code: ({ node, inline, ...props }) => (
                  inline ? (
                    <code className="bg-gray-100/80 rounded px-1 py-0.5 text-gray-800 text-sm" {...props} />
                  ) : (
                    <code className="bg-gray-100/80 rounded-lg p-3 block text-sm overflow-x-auto whitespace-pre" {...props} />
                  )
                ),
                pre: ({ node, ...props }) => (
                  <pre className="bg-gray-100/80 rounded-lg p-0 my-2 overflow-x-auto max-w-full" {...props} />
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
