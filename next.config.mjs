
/** @type {import('next').NextConfig} */
const nextConfig = {
images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Wildcard for any domain
      },
      {
        protocol: 'http',
        hostname: '**', // Include HTTP if needed
      },
    ],
  },
};

export default nextConfig;