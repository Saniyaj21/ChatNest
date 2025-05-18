import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <main className="flex flex-col items-center gap-10 max-w-2xl w-full">
        <Image
          src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80"
          alt="People chatting illustration"
          width={220}
          height={180}
          className="mb-4 rounded-xl shadow-lg"
          priority
        />
        <h1 className="text-4xl sm:text-5xl font-bold text-center text-indigo-900 drop-shadow-sm">
          Welcome to ChatNest
        </h1>
        <p className="text-lg sm:text-xl text-center text-indigo-700 max-w-xl">
          Effortless, real-time conversations. Connect, collaborate, and chat instantly with anyone, anywhere. Your next-generation chat experience starts here.
        </p>
        <a
          href="#get-started"
          className="mt-4 px-8 py-3 rounded-full bg-indigo-600 text-white font-semibold text-lg shadow-lg hover:bg-indigo-700 transition-colors"
        >
          Get Started
        </a>
      </main>
      <footer className="mt-20 text-indigo-400 text-sm text-center">
        &copy; {new Date().getFullYear()} ChatNest. All rights reserved.
      </footer>
    </div>
  );
}
