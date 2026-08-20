"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

// 全局持有 Lenis 实例，供需要程序化滚动的组件使用（如回到顶部按钮）
let lenisInstance: Lenis | null = null

export function getLenis(): Lenis | null {
  return lenisInstance
}

/** 平滑滚回顶部（优先走 Lenis，否则回退原生 scrollTo） */
export function scrollToTop() {
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(0)
  } else {
    window.scrollTo({ top: 0 })
  }
}

/**
 * Lenis 平滑滚动 Provider：
 * 接管页面滚动并驱动 GSAP ScrollTrigger，实现 MetaMask 官网同款顺滑滚动。
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let cancelled = false
    let lenis: Lenis | null = null
    let raf: ((time: number) => void) | null = null

    const start = () => {
      if (cancelled) return

      lenis = new Lenis({
        duration: 1.2,
        smoothWheel: true,
      })
      lenisInstance = lenis

      lenis.on("scroll", ScrollTrigger.update)

      raf = (time: number) => {
        lenis?.raf(time * 1000)
      }
      gsap.ticker.add(raf)
      gsap.ticker.lagSmoothing(0)
    }

    // 等首屏绘制后再接管滚动，避免与首包争抢主线程
    let idleId: number | undefined
    let timeoutId: number | undefined
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(start, { timeout: 1500 })
    } else {
      timeoutId = window.setTimeout(start, 300)
    }

    return () => {
      cancelled = true
      if (idleId != null) window.cancelIdleCallback(idleId)
      if (timeoutId != null) window.clearTimeout(timeoutId)
      if (raf) gsap.ticker.remove(raf)
      lenis?.destroy()
      if (lenisInstance === lenis) lenisInstance = null
    }
  }, [])

  return <>{children}</>
}
