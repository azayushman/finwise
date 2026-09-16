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
  // NOTE: output: "standalone" is intentionally omitted here.
  // "standalone" is for Docker / self-hosted Node.js deployments only.
  // Vercel uses its own output adapter; setting "standalone" overrides it
  // and causes routing issues. The Dockerfile sets NEXT_OUTPUT=standalone
  // via a build-arg if a containerised build is required.

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
