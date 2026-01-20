/** @type {import('next').NextConfig} */
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  scope: "/",
  sw: "service-worker.js",
  // Include push notification handler
  customWorkerSrc: "public",
  customWorkerDest: "public",
  customWorkerPrefix: "sw-",
  // Import push handler into service worker
  importScripts: ["/sw-push.js"],
});

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@kaitif/ui", "@kaitif/db"],
  // Silence Turbopack warning for webpack config from PWA plugin
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
