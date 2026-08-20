"use client"

import Image from "next/image"
import Link from "next/link"
import { memo } from "react"

import { cn } from "@/lib/utils"

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Cyber Wolf"

function BrandLogoComponent({ className }: { className?: string }) {
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

/**
 * 品牌 Logo：狼头图标 + 站点名，点击跳转首页。
 * memo 化：未来放入有状态的 Client 容器（如导航栏）时，
 * 父组件重渲染不会连带重渲染本组件。
 */
export const BrandLogo = memo(BrandLogoComponent)
