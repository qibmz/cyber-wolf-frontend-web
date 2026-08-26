"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppKit, useAppKitAccount, useDisconnect } from "@reown/appkit/react"
import { useChainId, useSignMessage } from "wagmi"
import { createSiweMessage } from "viem/siwe"
import { Loader2, Wallet } from "lucide-react"

import {
  authWalletControllerNonceV1,
  useAuthWalletControllerLoginV1,
} from "@/api/endpoints/auth"
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
  const chainId = useChainId()
  const { signMessageAsync } = useSignMessage()

  const [busy, setBusy] = useState(false)
  const [flowError, setFlowError] = useState<string | null>(null)
  // 防止同一地址重复触发登录流程
  const handledRef = useRef<string | null>(null)

  const login = useAuthWalletControllerLoginV1({
    mutation: {
      onSuccess: (response) => {
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
      // 1. 获取登录 nonce
      const nonceRes = await authWalletControllerNonceV1()
      const nonce = nonceRes.data.nonce

      // 2. 组装 EIP-4361 / SIWE 消息
      const message = createSiweMessage({
        address: addr as `0x${string}`,
        chainId,
        domain: window.location.host,
        nonce,
        uri: window.location.origin,
        version: "1",
        statement: "Sign in to Cyber Wolf",
        issuedAt: new Date(),
      })

      // 3. 用钱包对消息签名（personal_sign）
      const signature = await signMessageAsync({ message })

      // 4. 提交登录
      await login.mutateAsync({
        data: { address: addr, message, signature, nonce },
      })
      // 成功后的落地在 mutation.onSuccess 中处理
    } catch (err) {
      setFlowError(toErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

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
