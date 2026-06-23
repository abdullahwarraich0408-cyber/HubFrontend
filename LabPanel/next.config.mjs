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
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "*.digitaloceanspaces.com" },
    ],
  },
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${backendUrl}/api/:path*` },
      { source: "/hub/lab-q3n8", destination: "/lab" },
      { source: "/hub/lab-q3n8/:path*", destination: "/lab/:path*" },
    ];
  },
  async redirects() {
    return [
      { source: "/", destination: "/lab", permanent: false },
      { source: "/doctor", destination: "/lab", permanent: false },
      { source: "/doctor/:path*", destination: "/lab/:path*", permanent: false },
    ];
  },
};

export default nextConfig;
