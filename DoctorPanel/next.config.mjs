/** @type {import('next').NextConfig} */
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const backendUrl = process.env.BACKEND_URL || "https://medmarket.asrar.dev";

const nextConfig = {
  turbopack: {
    root: projectRoot,
  },
  images: {
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "*.digitaloceanspaces.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
      { source: "/hub/care-m9p4", destination: "/doctor" },
      { source: "/hub/care-m9p4/:path*", destination: "/doctor/:path*" },
    ];
  },
  async redirects() {
    return [
      { source: "/", destination: "/doctor", permanent: false },
    ];
  },
};

export default nextConfig;
