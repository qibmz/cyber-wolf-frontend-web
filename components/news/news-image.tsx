"use client"

import { useState } from "react"
import { ImageOff } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface NewsImageProps {
  src?: string
  alt: string
  className?: string
}

/**
 * 资讯图片：加载中显示 Skeleton 骨架屏，完成后淡入；失败/无图显示主题色占位。
 */
export function NewsImage({ src, alt, className }: NewsImageProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    src ? "loading" : "error"
  )
  const [prevSrc, setPrevSrc] = useState(src)

  // src 变化时在渲染期同步重置状态（避免 effect 内 setState）
  if (src !== prevSrc) {
    setPrevSrc(src)
    setStatus(src ? "loading" : "error")
  }

  return (
    <div className={cn("relative overflow-hidden bg-primary/10", className)}>
      {status === "loading" && (
        <Skeleton className="absolute inset-0 rounded-none" />
      )}

      {src && status !== "error" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={(e) => {
            // complete 缓存图也会触发 onLoad；naturalWidth 为 0 视为失败
            const img = e.currentTarget
            setStatus(img.naturalWidth > 0 ? "loaded" : "error")
          }}
          onError={() => setStatus("error")}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-300",
            status === "loaded" ? "opacity-100" : "opacity-0"
          )}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <ImageOff className="size-8 text-primary/40" />
        </div>
      )}
    </div>
  )
}
