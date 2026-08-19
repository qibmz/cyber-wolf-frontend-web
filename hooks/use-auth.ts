"use client"

import { useEffect, useState } from "react"

import type { User } from "@/api/endpoints"
import { getUser } from "@/lib/auth"

/**
 * 读取当前登录用户。
 * 挂载时读取 localStorage，并监听 storage 事件（多标签页同步）。
 * 登录/退出后通常伴随路由跳转或刷新，组件会重新挂载读取最新状态。
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(() => getUser())

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === "user") {
        setUser(getUser())
      }
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  return { user, isAuthenticated: user !== null }
}
