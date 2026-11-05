import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Keep QA builds separate from a developer's running .next directory.
  distDir: process.env.NEXT_DIST_DIR || ".next"
};

export default nextConfig;
