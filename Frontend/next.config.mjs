/** @type {import('next').NextConfig} */
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const backendUrl = process.env.BACKEND_URL || "https://medmarket.asrar.dev";

const nextConfig = {
  turbopack: {
    // Prevent Next.js from picking a parent lockfile (e.g. ~/pnpm-lock.yaml) as the app root in dev.
    root: projectRoot,
  },
  images: {
    // Avoid server-side fetches to remote hosts in dev (Node SSL cert issues on Windows)
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
      // Private partner portals (not linked on public site)
      { source: "/hub/pharma-x7k2", destination: "/vendor" },
      { source: "/hub/pharma-x7k2/:path*", destination: "/vendor/:path*" },
      { source: "/hub/care-m9p4", destination: "/doctor" },
      { source: "/hub/care-m9p4/:path*", destination: "/doctor/:path*" },
      { source: "/hub/lab-q3n8", destination: "/lab-test" },
      { source: "/hub/lab-q3n8/:path*", destination: "/lab-test/:path*" },
    ];
  },
  async redirects() {
    return [
      { source: "/vendor", destination: "/", permanent: false },
      { source: "/vendor/:path*", destination: "/", permanent: false },
      { source: "/doctor", destination: "/", permanent: false },
      { source: "/doctor/:path*", destination: "/", permanent: false },
      { source: "/lab-test", destination: "/", permanent: false },
      { source: "/lab-test/:path*", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
