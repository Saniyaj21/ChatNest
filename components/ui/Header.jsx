import Link from "next/link";
import React from "react";


export default function Header() {

    return (
        <div className="sticky top-0 z-10 flex items-center justify-between px-3 sm:px-6 py-2 sm:py-4 border-b border-white/30 bg-white/30 backdrop-blur-md shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 sm:gap-3">
                <Link href={'/'} className="focus:outline-none p-1" aria-label="Back to chats">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </Link>
                {/* <img src="/chatnest-logo.png" alt="ChatNest Logo" className="h-8 w-8 object-contain" /> */}
                <h2 className="text-xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight drop-shadow-glow animate-glow">
                    Chat
                </h2>
            </div>
        </div>
    );
} 