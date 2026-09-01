"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppKit, useAppKitAccount, useDisconnect } from "@reown/appkit/react"
import { Loader2, Wallet } from "lucide-react"

import { useAuthWalletControllerLoginV1 } from "@/api/endpoints/auth"
import { useSiweAuth } from "@/hooks/use-siwe"
import { Button } from "@/components/ui/button"
import { getApiErrorMessage } from "@/lib/api-errors"
import { saveAuthTokens } from "@/lib/auth"
import { useAuthStore } from "@/stores/auth-store"
import { cn } from "@/lib/utils"

function shortAddress(address?: string) {
  if (!address) return ""
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

function toErrorMessage(err: unknown) {
  // 用户在钱包里取消了签名
  const code = (err as { code?: number | string } | null)?.code
  if (code === 4001 || code === "action_rejected") {
    return "您取消了签名"
  }
  return getApiErrorMessage(err)
}

export function WalletLogin({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount()
  const { disconnect } = useDisconnect()
  const siweAuth = useSiweAuth()

  const [busy, setBusy] = useState(false)
  const [flowError, setFlowError] = useState<string | null>(null)
  // 防止同一地址重复触发登录流程
  const handledRef = useRef<string | null>(null)
  // 异步登录流程落地前的守卫：组件是否卸载、地址是否仍与发起时一致
  const mountedRef = useRef(false)
  const addressRef = useRef<string | undefined>(address)

  // 地址变化时同步到 ref（供异步登录回调判断是否仍为同一地址）
  useEffect(() => {
    addressRef.current = address
  }, [address])

  const login = useAuthWalletControllerLoginV1({
    mutation: {
      onSuccess: (response) => {
        // 组件已卸载或地址已切换时丢弃本次结果，避免错误跳转 / 覆盖登录态
        if (!mountedRef.current || handledRef.current !== addressRef.current) {
          return
        }
        saveAuthTokens(response.data)
        // 用户信息写入全局状态（不落地 localStorage）
        useAuthStore.getState().setUser(response.data.user)
        router.push("/")
      },
    },
  })

  async function runLogin(addr: string) {
    setFlowError(null)
    setBusy(true)
    try {
      // 获取 nonce -> 组装并签名 SIWE 消息
      const payload = await siweAuth(addr)
      // 提交登录
      await login.mutateAsync({ data: payload })
      // 成功后的落地在 mutation.onSuccess 中处理
    } catch (err) {
      handledRef.current = null
      if (mountedRef.current) setFlowError(toErrorMessage(err))
    } finally {
      if (mountedRef.current) setBusy(false)
    }
  }

  useEffect(() => {
    // StrictMode 会 mount → cleanup → remount；setup 里重置为 true，
    // 避免 cleanup 把 mounted 标志卡在 false
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (isConnected && address && handledRef.current !== address) {
      handledRef.current = address
      runLogin(address)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address])

  return (
    <div className={cn("flex flex-col gap-3", className)} {...props}>
      {isConnected ? (
        <>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            disabled={busy}
            onClick={() => open({ view: "Account" })}
          >
            {busy ? <Loader2 className="animate-spin" /> : <Wallet />}
            {shortAddress(address)}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            disabled={busy}
            onClick={() => disconnect()}
          >
            断开钱包
          </Button>
        </>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={busy}
          onClick={() => open({ view: "Connect" })}
        >
          {busy ? <Loader2 className="animate-spin" /> : <Wallet />}
          使用钱包登录
        </Button>
      )}
      {flowError && (
        <p role="alert" className="text-center text-sm text-destructive">
          {flowError}
        </p>
      )}
    </div>
  )
}
