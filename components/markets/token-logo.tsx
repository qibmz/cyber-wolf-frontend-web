"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"

interface TokenLogoProps {
  src?: string | null
  symbol: string
  className?: string
}

/**
 * 币种图标：有 logoUrl 用 img；失败/无图时用首字母占位。
 */
export function TokenLogo({ src, symbol, className }: TokenLogoProps) {
  const [failed, setFailed] = useState(false)
  const letter = (symbol || "?").slice(0, 1).toUpperCase()
  const showImage = Boolean(src) && !failed

  return (
    <span
      className={cn(
        "relative inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-xs font-bold text-primary",
        className
      )}
      aria-hidden={!showImage}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src!}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="size-full object-cover"
        />
      ) : (
        letter
      )}
    </span>
  )
}
