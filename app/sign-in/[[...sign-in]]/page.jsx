import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100/60 via-white/80 to-purple-100/60 shadow-2xl backdrop-blur-lg border border-white/40">
      {/* Glowing background effect */}
      <div className="absolute -top-10 -left-10 w-28 h-28 sm:w-40 sm:h-40 bg-gradient-to-br from-blue-400/30 via-purple-400/20 to-pink-400/10 rounded-full blur-2xl pointer-events-none animate-pulse-slow"></div>
      <div className="relative z-10 flex flex-col justify-center items-center mt-8 w-full max-w-md px-4 py-8 bg-white/40 rounded-3xl shadow-xl backdrop-blur-md border border-white/30">
        <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight drop-shadow-glow animate-glow mb-2 text-center">
          Welcome to ChatNest
        </h1>
        <span className="text-xs text-gray-600 font-medium italic mb-6 text-center block">Sign in to connect with everyone, everywhere.</span>
        <SignIn />
      </div>
    </div>
  )
}