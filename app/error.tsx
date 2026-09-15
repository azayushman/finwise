"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Privacy-safe error logging: avoid sending raw user data or DB schemas
    // In production, this would hook into Sentry or Datadog using generic error digests.
    console.error("Client Error Boundary Caught:", error.digest || "Runtime Exception");
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="glass-panel p-10 max-w-lg w-full rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-orange-500" />
        <h2 className="text-3xl font-display font-bold text-white mb-4">Something went wrong</h2>
        <p className="text-slate-300 mb-8 text-sm leading-relaxed">
          We encountered an unexpected issue while loading this page. 
          Don&apos;t worry, your financial data is safe.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 glass-control rounded-xl text-white font-semibold transition-all hover:bg-white/10"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-[#6D5DFB] hover:bg-[#8B5CF6] text-white rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(109,93,251,0.3)]"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
