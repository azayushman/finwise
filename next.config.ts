import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Parent folders (e.g. C:\Users\Ayushman) may contain a package-lock.json.
  // Pin Turbopack to this app so @/components/* resolves here, not the parent.
  turbopack: {
    root: path.resolve(__dirname),
  },

  // ── Bundle optimisation ───────────────────────────────────────────────────
  // Enable gzip compression for production responses.
  compress: true,
  output: "standalone",

  // Tell the bundler to tree-shake large packages to only the exports that
  // are actually imported, reducing first-load JS on every route.
  experimental: {
    optimizePackageImports: [
      "@supabase/supabase-js",
      "@google/genai",
      "openai",
    ],
  },

  // ── Production Security Headers ───────────────────────────────────────
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
        {
          key: "X-Frame-Options",
          value: "SAMEORIGIN",
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
      ],
    },
  ],
};

export default nextConfig;
