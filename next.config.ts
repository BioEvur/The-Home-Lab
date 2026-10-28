import type { NextConfig } from 'next';
import { ROOM_SETS } from './src/lib/content/sets';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Shopify-hosted product photography once the store is connected.
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.shopify.com' }],
    formats: ['image/avif', 'image/webp'],
  },
  // Set handles under /products go to the set page. Old search, journal and
  // collection links go to the homepage.
  async redirects() {
    return [
      ...ROOM_SETS.map((s) => ({ source: `/products/${s.handle}`, destination: `/sets/${s.handle}`, permanent: true })),
      ...['/sets', '/search', '/journal', '/journal/:path*', '/collections/:path*'].map((source) => ({
        source,
        destination: '/',
        permanent: false,
      })),
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
