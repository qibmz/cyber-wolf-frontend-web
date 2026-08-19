import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Cyber Wolf"

/**
 * 品牌 Logo：狼头图标 + 站点名，点击跳转首页
 */
export function BrandLogo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2 font-medium", className)}
    >
      <Image
        src="/images/brand/logo-head.webp"
        alt={siteName}
        width={474}
        height={568}
        className="h-8 w-auto"
      />
      {siteName}
    </Link>
  )
}
