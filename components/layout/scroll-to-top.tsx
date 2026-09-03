"use client"

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"

import { scrollToTop } from "@/lib/scroll"
import { cn } from "@/lib/utils"

/**
 * 回到顶部按钮：滚动超过阈值后 CSS 滑入，点击原生平滑回顶。
 */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <button
      type="button"
      aria-label="回到顶部"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={() => scrollToTop()}
      className={cn(
        "fixed right-6 bottom-6 z-40 flex size-10 cursor-pointer items-center justify-center rounded-full border border-muted-foreground bg-transparent text-muted-foreground transition-[opacity,transform,background-color,border-color,color] duration-300 ease-out hover:border-primary hover:bg-primary hover:text-white",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-10 opacity-0"
      )}
    >
      <ArrowUp className="size-5" />
    </button>
  )
}
