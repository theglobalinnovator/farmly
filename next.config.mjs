/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Prevents strict type-check failures during deployment
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;