import React from "react";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-4 drop-shadow-lg">
          Welcome to ChatNest
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Connect, chat, and collaborate in real-time. Join global, group, or AI-powered conversations—all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <a
            href="/sign-in"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
          >
            Get Started
          </a>
          <a
            href="#features"
            className="px-8 py-3 bg-white border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Learn More
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
        &copy; {new Date().getFullYear()} ChatNest. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage
