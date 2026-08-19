import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"

/**
 * 主站布局（route group: (main)）：
 * 导航类页面共享此布局，统一挂载 Navbar 与 Footer，
 * 内容区 flex-1 撑开，保证 Footer 吸底。
 */
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  )
}
