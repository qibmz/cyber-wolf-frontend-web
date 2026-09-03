import axios from "axios"

import { useAuthStore } from "@/stores/auth-store"

const TOKEN_KEY = "token"
const REFRESH_TOKEN_KEY = "refreshToken"

export interface AuthTokens {
  token: string
  refreshToken: string
  tokenExpires: number
  user?: unknown
}

export function saveAuthTokens(data: AuthTokens) {
  // 仅持久化 token 三件套；用户信息由全局状态维护，不落地
  localStorage.setItem(TOKEN_KEY, data.token)
  localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken)
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

/**
 * Axios 横切（客户端 + 服务端）：
 * - 服务端：baseURL = BACKEND_URL，供 Orval 相对路径 `/api/v1/...` 在 SSR 可用
 * - 客户端：不设 baseURL，走 Next rewrite 同源代理
 * - 语言头、成功体解包两端一致；Bearer / 401 清登录态仅客户端
 */
if (typeof window === "undefined") {
  axios.defaults.baseURL = process.env.BACKEND_URL ?? "http://localhost:3001"
}

const axiosSetup = globalThis as typeof globalThis & {
  __cwAxiosInterceptorsInstalled?: boolean
}

if (!axiosSetup.__cwAxiosInterceptorsInstalled) {
  axiosSetup.__cwAxiosInterceptorsInstalled = true

  axios.interceptors.request.use((config) => {
    config.headers["x-custom-lang"] = "zh"
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  axios.interceptors.response.use(
    (response) => {
      const body = response.data
      // 后端统一包装格式 { code, msg, data }，成功时解包出 data；
      // 204 空响应 / 文件流(Blob) 不处理
      if (
        body &&
        typeof body === "object" &&
        !(body instanceof Blob) &&
        typeof body.code === "number" &&
        body.code >= 200 &&
        body.code < 300 &&
        "data" in body
      ) {
        response.data = body.data
      }
      return response
    },
    (error) => {
      // 401：仅浏览器侧静默清除登录态
      if (typeof window !== "undefined" && error.response?.status === 401) {
        clearAuth()
        useAuthStore.getState().clearUser()
      }
      return Promise.reject(error)
    }
  )
}
