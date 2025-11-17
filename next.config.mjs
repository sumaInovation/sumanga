
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  
  turbopack: {},
  
  webpack: (config, { dev, isServer }) => {
    // Suppress source map warnings
    if (dev) {
      config.ignoreWarnings = [
        { module: /node_modules/ },
        { file: /node_modules/ },
      ];
    }
    return config;
  },
  
  serverExternalPackages: ['mongoose'],
  experimental: {
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;