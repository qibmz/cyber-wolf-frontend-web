"use client"

import { useState, type ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider, cookieToInitialState, type Config } from "wagmi"
import { createAppKit } from "@reown/appkit/react"
import { mainnet } from "@reown/appkit/networks"

import { networks, projectId, wagmiAdapter } from "@/config"
import "@/lib/auth"

// 应用元数据（用于 WalletConnect / Verify API 展示）
// url 的 origin 必须与部署域名及子域名保持一致
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

const metadata = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Cyber Wolf",
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ?? "Cyber Wolf 官方 Web 应用",
  url: appUrl,
  icons: [`${appUrl}/favicon.ico`],
}

if (!projectId) {
  throw new Error("Project ID is not defined")
}

// 初始化 AppKit 弹窗（在 Client Component 文件中只调用一次）
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  defaultNetwork: mainnet,
  metadata,
  features: {
    analytics: true, // 可选，默认取 Cloud 配置
  },
})

export function Providers({
  children,
  cookies,
}: {
  children: ReactNode
  cookies: string | null
}) {
  const [queryClient] = useState(() => new QueryClient())
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  )

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
