import type { NextConfig } from "next"

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3001"

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  // 构建时写入服务端包，避免 Vercel 运行时未配置 BACKEND_URL 时回落到 localhost
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
