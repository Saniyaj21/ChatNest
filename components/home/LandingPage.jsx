import React from "react";

const LandingPage = () => {
  return (
    <div className="pt-8 min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100/60 via-white/80 to-purple-100/60 backdrop-blur-lg px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
          Welcome to ChatNest
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Connect, chat, and collaborate in real-time. Join global, group, or AI-powered conversations—all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <a
            href="/sign-in"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white rounded-lg font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition duration-300 transform hover:scale-105"
          >
            Get Started
          </a>

        </div>
        <div id="features" className="mt-12">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">Features</h2>
          <ul className="text-left text-gray-600 space-y-2 mx-auto max-w-md">
            <li>💬 Real-time global and group chat</li>
            <li>🤖 AI-powered chat assistant</li>
            <li>🔒 Secure authentication</li>
            <li>📱 Responsive design for all devices</li>
            <li>✨ Modern, clean interface</li>
          </ul>
        </div>
      </div>
      <footer className="mt-16 text-gray-400 text-sm">
        &copy; 2025 ChatNest. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage
