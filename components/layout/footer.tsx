import Link from "next/link"

import { BrandLogo } from "@/components/layout/brand-logo"
import { Container } from "@/components/layout/container"

const FOOTER_LINKS = [
  { label: "行情", href: "/markets" },
  { label: "资讯", href: "/news" },
  { label: "登录", href: "/login" },
]

/**
 * 站点公共页脚：品牌信息 + 导航链接 + 版权。
 */
export function Footer() {
  const year = new Date().getFullYear()
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Cyber Wolf"

  return (
    <footer className="border-t bg-card/30">
      <Container className="flex flex-col gap-8 py-10">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-2">
            <BrandLogo />
            <p className="text-sm text-muted-foreground">
              数字资产行情与资讯平台
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t pt-6 text-xs text-muted-foreground">
          © {year} {siteName}. 保留所有权利。
        </div>
      </Container>
    </footer>
  )
}
