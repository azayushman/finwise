import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-8 relative">
        <h1 className="text-9xl font-display font-black text-transparent bg-clip-text bg-gradient-to-br from-white/20 to-white/5 opacity-80">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-2xl font-bold text-white">Page Not Found</p>
        </div>
      </div>
      
      <p className="text-slate-300 max-w-md mb-10 text-sm">
        The page you are looking for doesn&apos;t exist or has been moved. 
        Here are some helpful links to get you back on track:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
        <Link href="/budget" className="glass-panel p-6 rounded-2xl hover:-translate-y-1 transition-transform group">
          <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📊</div>
          <div className="font-semibold text-white text-sm">Budget Planner</div>
        </Link>
        <Link href="/savings" className="glass-panel p-6 rounded-2xl hover:-translate-y-1 transition-transform group">
          <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📈</div>
          <div className="font-semibold text-white text-sm">Savings Calc</div>
        </Link>
        <Link href="/quiz" className="glass-panel p-6 rounded-2xl hover:-translate-y-1 transition-transform group">
          <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🎓</div>
          <div className="font-semibold text-white text-sm">Literacy Quiz</div>
        </Link>
      </div>

      <div className="mt-12">
        <Link href="/" className="text-[#8B5CF6] hover:text-[#A78BFA] font-medium text-sm transition-colors">
          &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
