import { WagmiAdapter } from "@reown/appkit-adapter-wagmi"
import {
  mainnet,
  arbitrum,
  base,
  polygon,
  type AppKitNetwork,
} from "@reown/appkit/networks"

// 在 https://dashboard.reown.com 创建项目后获取 Project ID
// 务必在 .env.local 中设置 NEXT_PUBLIC_PROJECT_ID
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) {
  throw new Error("Project ID is not defined")
}

// 需要支持的链（来自 @reown/appkit/networks，底层为 viem 网络）
// 按需增删即可
// 注: pnpm 下 viem 会因 peer-zod 拆出多个类型实例，导致 viem Chain 与
// AppKitNetwork 泛型在类型层面无法直接赋值（运行时对象一致），此处做类型桥接。
export const networks = [mainnet, arbitrum, base, polygon] as unknown as [
  AppKitNetwork,
  ...AppKitNetwork[],
]

// 设置 Wagmi Adapter（配置）
// Note: 不传 storage 时，Wagmi 默认使用 localStorage（cookie 存储为可选项）
export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  projectId,
  networks,
})

// 供 WagmiProvider 与 cookieToInitialState 使用的配置
export const config = wagmiAdapter.wagmiConfig
