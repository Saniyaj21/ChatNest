import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100/60 via-white/80 to-purple-100/60 px-4">
      <div className="max-w-lg w-full text-center">
        <img src="/chatnest-logo.png" alt="ChatNest Logo" className="mx-auto mb-4 h-14 w-14 object-contain" />
        <h1 className="text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg animate-glow">404</h1>
        <h2 className="text-2xl font-bold text-purple-700 mb-2">Page Not Found</h2>
        <p className="text-lg text-gray-700 mb-8">Sorry, the page you are looking for does not exist or has been moved.</p>
        <Link href="/" className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white rounded-lg font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition duration-300 transform hover:scale-105">
          Go Home
        </Link>
      </div>
    </div>
  );
} 