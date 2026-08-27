"use client"

import BoringAvatar from "boring-avatars"

import { cn } from "@/lib/utils"

// 与站点视觉契合的配色（青 / 绿 / 粉 / 紫 / 橙）
const AVATAR_COLORS = ["#22d3ee", "#a3e635", "#f472b6", "#a78bfa", "#fb923c"]

/**
 * 确定性生成头像：同一个 seed（邮箱 / 钱包地址）永远生成同一张图。
 * 使用 boring-avatars 的 beam 风格，本地渲染 SVG，无外部网络请求。
 */
export function GeneratedAvatar({
  seed,
  size = 32,
  className,
}: {
  seed: string
  size?: number
  className?: string
}) {
  return (
    <span
      className={cn(
        "block overflow-hidden rounded-full ring-1 ring-border",
        className
      )}
      style={{ width: size, height: size }}
    >
      <BoringAvatar
        name={seed}
        size={size}
        variant="beam"
        colors={AVATAR_COLORS}
      />
    </span>
  )
}
