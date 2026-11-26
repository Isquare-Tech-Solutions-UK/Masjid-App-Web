import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server (.next/standalone/server.js) for the Docker image.
  output: "standalone",

  // No rewrites here: next.config is evaluated at build time and its rewrite
  // destinations are frozen into the build. The /api/v1 proxy lives in
  // src/proxy.ts so BACKEND_API_URL is read at request time instead.
};

export default nextConfig;
