"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/**
 * Lenis 平滑滚动 Provider：
 * 接管页面滚动并驱动 GSAP ScrollTrigger，实现 MetaMask 官网同款顺滑滚动。
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    })

    // Lenis 滚动时同步更新 ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update)

    // 用 GSAP ticker 驱动 Lenis，保证动画与滚动同一时钟
    const raf = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
