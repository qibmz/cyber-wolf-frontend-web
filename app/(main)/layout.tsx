import { ViewTransition } from "react"

import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { ScrollToTop } from "@/components/layout/scroll-to-top"

/**
 * 主站布局（route group: (main)）：
 * 导航类页面共享此布局，统一挂载 Navbar 与 Footer，
 * 内容区 flex-1 撑开，保证 Footer 吸底。
 * ViewTransition 包裹内容区实现页面跳转过渡动画（Navbar/Footer 固定不动）。
 */
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <ViewTransition enter="page-enter" exit="page-exit" default="none">
          {children}
        </ViewTransition>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
