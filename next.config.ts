import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mc-heads.net',
        port: '',
        pathname: '/avatar/**',
      },
    ],
    domains: ['res.cloudinary.com'],
  },
  output: 'standalone',
};

export default nextConfig;
