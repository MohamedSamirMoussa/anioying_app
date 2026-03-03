import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0A0A0F] text-white">
      <h2 className="text-4xl font-bold mb-4 font-orbitron">404 - Page Not Found</h2>
      <p className="text-white/50 mb-8">Oops! The page you are looking for doesn't exist.</p>
      <Link 
        href="/" 
        className="px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
      >
        Return Home
      </Link>
    </div>
  )
}