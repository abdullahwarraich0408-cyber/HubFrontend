/** @type {import('next').NextConfig} */
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const apiTarget = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001/api";
const derivedBackendUrl = apiTarget.startsWith("http")
  ? apiTarget.replace(/\/api\/?$/, "")
  : "http://localhost:5001";
const backendUrl = process.env.BACKEND_URL || derivedBackendUrl;

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
      {
        source: "/uploads/:path*",
        destination: `${backendUrl}/uploads/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      { source: "/", destination: "/portal-access", permanent: false },
    ];
  },
};

export default nextConfig;
