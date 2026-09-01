"use client"

import { useEffect, useState } from "react"

import { authControllerMeV1 } from "@/api/endpoints/auth"
import { clearAuth, getToken } from "@/lib/auth"
import { useAuthStore } from "@/stores/auth-store"

/**
 * 读取当前登录用户。
 *
 * 用户信息只存于全局内存状态（zustand），不持久化：
 * - 登录成功后由登录响应写入
 * - 刷新页面时若存在 token，则调用 /auth/me 恢复用户信息
 * - 无 token 或请求失败则视为未登录
 *
 * isLoading 表示「有 token 但用户尚未恢复完成」：此期间既不是已登录
 * 也不是未登录，调用方（如受保护页面的重定向守卫）应等待而非立即跳转。
 */
export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)
  // 是否已完成「token -> 用户信息」的恢复判断
  const [resolved, setResolved] = useState(false)

  useEffect(() => {
    if (!getToken() || useAuthStore.getState().user) return

    let cancelled = false
    authControllerMeV1()
      .then((res) => {
        if (cancelled) return
        if (res.data) {
          setUser(res.data)
        } else {
          // 后端返回空 user（用户被删/禁用等），视同无效 token
          clearAuth()
          useAuthStore.getState().clearUser()
        }
      })
      .catch(() => {
        // 401 时全局 axios 拦截器已清除 token 与 user；
        // 网络抖动 / 5xx 等非 401 错误保留 token，仅本次 user 暂缺。
      })
      .finally(() => {
        if (!cancelled) setResolved(true)
      })

    return () => {
      cancelled = true
    }
  }, [setUser])

  const isLoading = !!getToken() && user === null && !resolved

  return {
    user,
    isAuthenticated: user !== null,
    isLoading,
  }
}
