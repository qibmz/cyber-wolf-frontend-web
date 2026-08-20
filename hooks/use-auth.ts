"use client"

import { useEffect } from "react"

import { authControllerMeV1 } from "@/api/endpoints"
import { clearAuth, getToken } from "@/lib/auth"
import { useAuthStore } from "@/stores/auth-store"

/**
 * 读取当前登录用户。
 *
 * 用户信息只存于全局内存状态（zustand），不持久化：
 * - 登录成功后由登录响应写入
 * - 刷新页面时若存在 token，则调用 /auth/me 恢复用户信息
 * - 无 token 或请求失败则视为未登录
 */
export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)

  useEffect(() => {
    if (!getToken() || useAuthStore.getState().user) return

    authControllerMeV1()
      .then((res) => setUser(res.data))
      .catch(() => {
        // token 失效则清除登录态
        clearAuth()
      })
  }, [setUser])

  return { user, isAuthenticated: user !== null }
}
