import {
  QueryClient,
  defaultShouldDehydrateQuery,
  isServer,
} from "@tanstack/react-query"
import { cache } from "react"

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // SSR 预取后短时间内视为新鲜，避免客户端立刻重打
        staleTime: 60 * 1000,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

/** 浏览器端单例 QueryClient（避免 React Query 丢缓存） */
export function getBrowserQueryClient() {
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient()
  }
  return browserQueryClient
}

/**
 * 每个 RSC 请求一个 QueryClient。
 * 用 React cache() 保证同一次请求里 generateMetadata 与 page 共享预取结果。
 */
export const getServerQueryClient = cache(() => makeQueryClient())

export function getQueryClient() {
  if (isServer) {
    return getServerQueryClient()
  }
  return getBrowserQueryClient()
}
