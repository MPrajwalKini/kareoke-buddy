import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.BUILD_TARGET === "mobile" ? "export" : undefined,
};

export default nextConfig;
