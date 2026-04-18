import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // This allows process.env.NEXT_PUBLIC_API_URL to work in "use client"
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // This is a safety measure to prevent CORS images issues
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'smart-screenshot-api.onrender.com',
      },
    ],
  },
};

export default nextConfig;