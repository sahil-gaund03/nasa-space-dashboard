import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignore ESLint errors on production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript validation errors on production builds
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
// or export default nextConfig;
