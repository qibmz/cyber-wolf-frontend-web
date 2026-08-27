"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppKit, useAppKitAccount } from "@reown/appkit/react"
import { Loader2, LogOut, Mail, Save, Wallet } from "lucide-react"

import type { User } from "@/api/endpoints/api.schemas"
import {
  useAuthControllerLogoutV1,
  useAuthControllerUpdateV1,
  useAuthWalletControllerBindEmailV1,
  useAuthWalletControllerBindV1,
} from "@/api/endpoints/auth"
import { useAuth } from "@/hooks/use-auth"
import { useSiweAuth } from "@/hooks/use-siwe"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { UserAvatar } from "@/components/ui/user-avatar"
import { clearAuth } from "@/lib/auth"
import { getApiErrorMessage } from "@/lib/api-errors"
import { useAuthStore } from "@/stores/auth-store"

function toErrorMessage(err: unknown) {
  const code = (err as { code?: number | string } | null)?.code
  if (code === 4001 || code === "action_rejected") {
    return "您取消了签名"
  }
  return getApiErrorMessage(err)
}

function shortAddress(address?: string | null) {
  if (!address) return ""
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border bg-card/50 p-5">
      <div>
        <h2 className="font-semibold">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  )
}

function BindWalletCard({ user }: { user: User }) {
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount()
  const siweAuth = useSiweAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // 用户是否主动点了「绑定钱包」，以及本次连接是否已处理
  const shouldBind = useRef(false)
  const handledAddress = useRef<string | null>(null)

  const bindWallet = useAuthWalletControllerBindV1({
    mutation: {
      onSuccess: (res) => {
        useAuthStore.getState().setUser(res.data)
      },
    },
  })

  const isBound = !!user.walletAddress

  async function runBind(addr: string) {
    setBusy(true)
    setError(null)
    try {
      const payload = await siweAuth(addr)
      await bindWallet.mutateAsync({ data: payload })
      handledAddress.current = addr
    } catch (e) {
      handledAddress.current = null
      setError(toErrorMessage(e))
    } finally {
      setBusy(false)
      shouldBind.current = false
    }
  }

  useEffect(() => {
    if (!shouldBind.current || !isConnected || !address) return
    if (handledAddress.current === address) return
    void runBind(address)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address])

  function handleBind() {
    setError(null)
    shouldBind.current = true
    if (isConnected && address) {
      handledAddress.current = null
      void runBind(address)
      return
    }
    open({ view: "Connect" })
  }

  if (isBound) {
    return (
      <SectionCard
        title="钱包绑定"
        description="已绑定的钱包地址（用于钱包登录）"
      >
        <div className="flex items-center gap-2 text-sm">
          <Wallet className="size-4 text-primary" />
          <span className="font-mono">{user.walletAddress}</span>
        </div>
      </SectionCard>
    )
  }

  return (
    <SectionCard
      title="绑定钱包"
      description="绑定后可切换成用钱包登录，地址将作为你的链上身份"
    >
      <Button
        type="button"
        variant="outline"
        className="justify-start"
        onClick={handleBind}
        disabled={busy}
      >
        {busy ? <Loader2 className="animate-spin" /> : <Wallet />}
        {busy ? "绑定中…" : "绑定钱包"}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </SectionCard>
  )
}

function BindEmailCard({ user }: { user: User }) {
  const [email, setEmail] = useState(user.email ?? "")
  const [password, setPassword] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const bindEmail = useAuthWalletControllerBindEmailV1({
    mutation: {
      onSuccess: (res) => {
        useAuthStore.getState().setUser(res.data)
      },
    },
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await bindEmail.mutateAsync({
        data: { email, ...(password ? { password } : {}) },
      })
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <SectionCard
      title="绑定邮箱"
      description="设置登录邮箱（可同时设置密码，用于邮箱登录）"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="bind-email">邮箱</FieldLabel>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="bind-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入邮箱"
                className="pl-9"
                required
                autoComplete="email"
              />
            </div>
          </Field>
          <Field>
            <FieldLabel htmlFor="bind-password">密码（可选）</FieldLabel>
            <Input
              id="bind-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="设置密码，用于邮箱登录"
              autoComplete="new-password"
            />
          </Field>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" disabled={busy}>
            {busy ? <Loader2 className="animate-spin" /> : <Mail />}
            {busy ? "提交中…" : "绑定邮箱"}
          </Button>
        </FieldGroup>
      </form>
    </SectionCard>
  )
}

function NicknameCard({ user }: { user: User }) {
  const [nickname, setNickname] = useState(user.nickname ?? "")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = useAuthControllerUpdateV1({
    mutation: {
      onSuccess: (res) => {
        useAuthStore.getState().setUser(res.data)
      },
    },
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await update.mutateAsync({ data: { nickname } })
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <SectionCard title="个人资料" description="昵称会展示在导航栏等位置">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="nickname">昵称</FieldLabel>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="请输入昵称"
              maxLength={30}
            />
          </Field>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" disabled={busy}>
            {busy ? <Loader2 className="animate-spin" /> : <Save />}
            {busy ? "保存中…" : "保存"}
          </Button>
        </FieldGroup>
      </form>
    </SectionCard>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const logout = useAuthControllerLogoutV1()

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login")
  }, [isAuthenticated, router])

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 animate-spin" />
        加载中…
      </div>
    )
  }

  const displayName = user.nickname?.trim() || user.email || "用户"

  function handleLogout() {
    logout.mutateAsync().finally(() => {
      clearAuth()
      useAuthStore.getState().clearUser()
      router.replace("/")
    })
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 md:px-6">
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <UserAvatar user={user} size={80} />
        <div>
          <h1 className="text-xl font-bold">{displayName}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          {user.walletAddress && (
            <p className="text-xs text-muted-foreground">
              {shortAddress(user.walletAddress)}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <NicknameCard user={user} />
        <BindWalletCard user={user} />
        <BindEmailCard user={user} />

        <section className="flex justify-center pt-2">
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut />
            退出登录
          </Button>
        </section>
      </div>
    </div>
  )
}
