"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

// 页面路径 -> 标题（站点名后缀由组件自动拼接）
const PAGE_TITLES: Record<string, string> = {
  "/login": "登录",
  "/markets": "行情",
  "/news": "资讯",
}

function getSiteName() {
  return process.env.NEXT_PUBLIC_SITE_NAME ?? "Cyber Wolf"
}

/** 统一设置标签页标题（自动拼接站点名） */
export function setDocumentTitle(pageTitle?: string) {
  const siteName = getSiteName()
  document.title = pageTitle ? `${pageTitle} | ${siteName}` : siteName
}

/**
 * 修复 Next.js 16.2.6 的 bug：生产模式下 streaming 响应丢失页面级
 * metadata title（静态快照正确但实际 HTTP 响应只有 layout 默认标题）。
 * 这里在客户端根据路由动态设置 document.title，保证标签页标题正确。
 *
 * 仅处理映射表中的静态路由与首页；动态页面由 DocumentTitle /
 * generateMetadata 负责，此处不覆盖。
 */
export function PageTitle() {
  const pathname = usePathname()

  useEffect(() => {
    const pageTitle = PAGE_TITLES[pathname]
    if (pageTitle) {
      setDocumentTitle(pageTitle)
    } else if (pathname === "/") {
      setDocumentTitle()
    }
    // 其余路径（如文章详情）由 DocumentTitle / generateMetadata 负责
  }, [pathname])

  return null
}

/**
 * 动态页面客户端兜底标题（如资讯详情），规避 streaming 丢 title。
 */
export function DocumentTitle({ title }: { title: string }) {
  useEffect(() => {
    setDocumentTitle(title)
  }, [title])

  return null
}
