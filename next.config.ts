import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  // Vercel uses the standard output; local QA can build in an isolated directory.
  distDir: process.env.VERCEL ? ".next" : process.env.NEXT_DIST_DIR || ".next"
};

export default nextConfig;
