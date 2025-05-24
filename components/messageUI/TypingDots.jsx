import React from 'react'

const TypingDots = () => {
    return (
        <>
            <style>{`
                @keyframes typingWave {
                    0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
                    40% { transform: scale(1.2); opacity: 1; }
                }
            `}</style>
            <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full" style={{ animation: 'typingWave 1.2s infinite ease-in-out both', animationDelay: '0s' }} />
                <div className="w-2 h-2 bg-purple-500 rounded-full" style={{ animation: 'typingWave 1.2s infinite ease-in-out both', animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-pink-500 rounded-full" style={{ animation: 'typingWave 1.2s infinite ease-in-out both', animationDelay: '0.4s' }} />
            </div>
        </>
    )
}

export default TypingDots
