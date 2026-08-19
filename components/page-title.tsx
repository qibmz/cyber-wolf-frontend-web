"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

// 页面路径 -> 标题（站点名后缀由组件自动拼接）
const PAGE_TITLES: Record<string, string> = {
  "/login": "登录",
}

/**
 * 修复 Next.js 16.2.6 的 bug：生产模式下 streaming 响应丢失页面级
 * metadata title（静态快照正确但实际 HTTP 响应只有 layout 默认标题）。
 * 这里在客户端根据路由动态设置 document.title，保证标签页标题正确。
 */
export function PageTitle() {
  const pathname = usePathname()

  useEffect(() => {
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Cyber Wolf"
    const pageTitle = PAGE_TITLES[pathname]
    document.title = pageTitle ? `${pageTitle} | ${siteName}` : siteName
  }, [pathname])

  return null
}
