import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/afpsv7zi/**',
      },
    ],
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      {
        source: '/blog',
        destination: '/',
        permanent: true,
      },
      {
        source: '/blog/:slug*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/knowledge',
        destination: '/',
        permanent: true,
      },
      {
        source: '/knowledge/:slug*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/doctor',
        destination: '/doctors',
        permanent: true,
      },
      {
        source: '/consultation',
        destination: '/book',
        permanent: true,
      },
      {
        source: '/faqs',
        destination: '/faq',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
