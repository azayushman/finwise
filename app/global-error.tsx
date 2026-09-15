"use client";

import { useEffect } from "react";
import Link from "next/link";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Privacy-safe error logging for root layout failures
    console.error("Global Error Caught:", error.digest || "Fatal Exception");
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-[#07111F] text-white flex items-center justify-center min-h-screen p-6">
        <div className="glass-panel p-10 max-w-lg w-full rounded-3xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-rose-500" />
          <h2 className="text-3xl font-bold mb-4">Critical Error</h2>
          <p className="text-slate-300 mb-8 text-sm">
            A fatal error occurred that prevented the application from loading.
            Your session is secure, but you may need to reload the application.
          </p>
          <div className="flex flex-col gap-4 justify-center items-center">
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-[#6D5DFB] hover:bg-[#8B5CF6] text-white rounded-xl font-semibold transition-all w-full shadow-[0_0_20px_rgba(109,93,251,0.3)]"
            >
              Reload Application
            </button>
            <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
              Return to Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
