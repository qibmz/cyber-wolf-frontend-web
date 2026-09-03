import type { NextConfig } from "next"

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3001"

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  // 构建期注入，供服务端 fetch / rewrite 使用同一 BACKEND_URL
  env: {
    BACKEND_URL,
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${BACKEND_URL}/api/v1/:path*`,
      },
    ]
  },
}

export default nextConfig
