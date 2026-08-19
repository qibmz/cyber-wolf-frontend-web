import axios from "axios"
import type { User } from "@/api/endpoints"

const TOKEN_KEY = "token"
const REFRESH_TOKEN_KEY = "refreshToken"
const USER_KEY = "user"

export interface AuthTokens {
  token: string
  refreshToken: string
  tokenExpires: number
  user: User
}

export function saveAuthTokens(data: AuthTokens) {
  localStorage.setItem(TOKEN_KEY, data.token)
  localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken)
  localStorage.setItem(USER_KEY, JSON.stringify(data.user))
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

// 全局 axios 拦截器（客户端注册一次）：
// 1. 所有请求自动附带 Bearer token
// 2. 请求头声明语言（后端 nestjs-i18n 按此返回对应语言，简体中文 = zh）
// 3. 401 时清除登录态并跳转登录页
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
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        clearAuth()
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.startsWith("/login")
        ) {
          window.location.href = "/login"
        }
      }
      return Promise.reject(error)
    }
  )
}
