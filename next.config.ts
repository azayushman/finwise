import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Parent folders (e.g. C:\Users\Ayushman) may contain a package-lock.json.
  // Pin Turbopack to this app so @/components/* resolves here, not the parent.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
