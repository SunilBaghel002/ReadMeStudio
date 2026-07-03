import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  compress: true,
  images: {
    minimumCacheTTL: 3600,
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'github.com' },
      { protocol: 'https', hostname: 'img.shields.io' },
      { protocol: 'https', hostname: 'komarev.com' },
      { protocol: 'https', hostname: 'github-readme-stats.vercel.app' },
      { protocol: 'https', hostname: 'github-readme-stats.shion.dev' },
      { protocol: 'https', hostname: 'github-readme-activity-graph.vercel.app' },
      { protocol: 'https', hostname: 'capsule-render.vercel.app' },
      { protocol: 'https', hostname: 'quotes-github-readme.vercel.app' },
      { protocol: 'https', hostname: 'readme-typing-svg.demolab.com' },
    ],
  },
};

export default nextConfig;
