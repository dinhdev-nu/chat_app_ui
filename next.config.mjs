/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    unoptimized: true
  },
  reactStrictMode: false,
  // Remove console logs in production
  compiler: {
    removeConsole: {
      exclude: ["error"]
    }
  }
};

export default nextConfig;
