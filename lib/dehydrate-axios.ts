import type { AxiosResponse } from "axios"

/**
 * Orval + axios 的 query 缓存默认是完整 AxiosResponse。
 * SSR `dehydrate` 时其中的 config 函数、Node request 等不可序列化，
 * 且不应下发给客户端。这里只保留业务可安全脱水的字段，
 * 形状仍兼容 `data?.data` 读取。
 */
export type DehydratedAxiosData<T> = {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
  config: Record<string, never>
}

export function toDehydratedAxiosData<T>(
  response: AxiosResponse<T>
): DehydratedAxiosData<T> {
  return {
    data: response.data,
    status: response.status,
    statusText: response.statusText,
    headers: {},
    config: {},
  }
}
