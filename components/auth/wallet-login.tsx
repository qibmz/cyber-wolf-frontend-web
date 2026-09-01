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
  // 当前应驱动 busy / 错误态的登录地址；旧请求 finally 不得清掉新流程的 UI
  const activeLoginAddrRef = useRef<string | null>(null)
  const mountedRef = useRef(false)
  const addressRef = useRef<string | undefined>(address)

  // 地址变化时同步到 ref（供异步登录用局部 addr 与「当前连接地址」比对）
  useEffect(() => {
    addressRef.current = address
  }, [address])

  const login = useAuthWalletControllerLoginV1()

  // 本次异步流程是否仍应对当前连接生效（未卸载，且连接地址仍是发起时的 addr）
  function isStale(addr: string) {
    return !mountedRef.current || addressRef.current !== addr
  }

  async function runLogin(addr: string) {
    activeLoginAddrRef.current = addr
    setFlowError(null)
    setBusy(true)
    try {
      // 获取 nonce -> 组装并签名 SIWE 消息
      const payload = await siweAuth(addr)
      if (isStale(addr)) return
      // 提交登录；用发起时的 addr（局部变量）校验，避免 handledRef 被新地址覆盖后误放行旧结果
      const response = await login.mutateAsync({ data: payload })
      if (isStale(addr)) return
      saveAuthTokens(response.data)
      // 用户信息写入全局状态（不落地 localStorage）
      useAuthStore.getState().setUser(response.data.user)
      router.push("/")
    } catch (err) {
      // 仅清掉本地址的 handled 标记；若已切到新地址，不要干扰新流程
      if (handledRef.current === addr) handledRef.current = null
      if (!isStale(addr)) setFlowError(toErrorMessage(err))
    } finally {
      // 只有仍是「当前活跃」登录才清 busy，避免旧请求 finally 关掉新流程的 loading
      if (mountedRef.current && activeLoginAddrRef.current === addr) {
        setBusy(false)
      }
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
    if (!isConnected) {
      // 断开后允许再次用同一地址登录；busy 用下方派生值释放，避免在 effect 里 setState
      handledRef.current = null
      activeLoginAddrRef.current = null
      return
    }
    if (address && handledRef.current !== address) {
      handledRef.current = address
      runLogin(address)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address])

  // 断开连接后不展示 loading，避免旧请求留下的 busy 卡住「连接」按钮
  const showBusy = busy && isConnected

  return (
    <div className={cn("flex flex-col gap-3", className)} {...props}>
      {isConnected ? (
        <>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            disabled={showBusy}
            onClick={() => open({ view: "Account" })}
          >
            {showBusy ? <Loader2 className="animate-spin" /> : <Wallet />}
            {shortAddress(address)}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            disabled={showBusy}
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
          disabled={showBusy}
          onClick={() => open({ view: "Connect" })}
        >
          {showBusy ? <Loader2 className="animate-spin" /> : <Wallet />}
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
