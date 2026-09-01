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

// 全局 axios 拦截器（客户端注册一次）：
// 1. 所有请求自动附带 Bearer token
// 2. 请求头声明语言（后端 nestjs-i18n 按此返回对应语言，简体中文 = zh）
// 3. 统一解包后端响应包装 { code, msg, data }，业务侧拿到原始 data
// 4. 401 时静默清除登录态（不强制跳转，由 UI 呈现未登录状态）
if (typeof window !== "undefined") {
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
        body.code === 200 &&
        "data" in body
      ) {
        response.data = body.data
      }
      return response
    },
    (error) => {
      // 401：静默清除登录态，不跳转（避免进入页面就被踢到登录页）
      if (error.response?.status === 401) {
        clearAuth()
        // 同步清空内存中的 user，避免 UI 仍认为已登录（与 token 保持一致）
        useAuthStore.getState().clearUser()
      }
      return Promise.reject(error)
    }
  )
}
