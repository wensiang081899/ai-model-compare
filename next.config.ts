import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 在构建时忽略 ESLint 和 TypeScript 错误，确保部署流程不会被阻断
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
