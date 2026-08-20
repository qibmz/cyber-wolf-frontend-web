"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState, type ReactNode } from "react"

const TargetCursor = dynamic(
  () =>
    import("@/components/home/target-cursor").then((m) => ({
      default: m.TargetCursor,
    })),
  { ssr: false }
)

const ParallaxSection = dynamic(
  () =>
    import("@/components/home/parallax-section").then((m) => ({
      default: m.ParallaxSection,
    })),
  { ssr: false }
)

const DriftWallSection = dynamic(
  () =>
    import("@/components/home/drift-wall-section").then((m) => ({
      default: m.DriftWallSection,
    })),
  { ssr: false }
)

const PixelTrailSection = dynamic(
  () =>
    import("@/components/home/pixel-trail-section").then((m) => ({
      default: m.PixelTrailSection,
    })),
  { ssr: false }
)

/**
 * 进入视口（含提前量）后再挂载子树，避免折屏以下重特效抢首屏带宽。
 */
function WhenVisible({
  children,
  minHeightClass = "min-h-[50vh]",
  rootMargin = "400px",
}: {
  children: ReactNode
  minHeightClass?: string
  rootMargin?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setVisible(true)
        io.disconnect()
      },
      { rootMargin }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])

  return (
    <div ref={ref} className={visible ? undefined : minHeightClass}>
      {visible ? children : <div aria-hidden className={minHeightClass} />}
    </div>
  )
}

/**
 * 首页折屏以下特效 + 桌面光标：按需分块、进视口后再加载。
 */
export function HomeDeferredEffects() {
  const [showCursor, setShowCursor] = useState(false)

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px) and (pointer: fine)")
    if (!desktop.matches) return

    const enable = () => setShowCursor(true)
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(enable, { timeout: 2000 })
      return () => window.cancelIdleCallback(id)
    }
    const t = window.setTimeout(enable, 400)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <>
      {showCursor ? (
        <div className="hidden md:block">
          <TargetCursor />
        </div>
      ) : null}

      <WhenVisible minHeightClass="min-h-[70vh]">
        <ParallaxSection />
      </WhenVisible>
      <WhenVisible minHeightClass="min-h-[60vh]">
        <DriftWallSection />
      </WhenVisible>
      <WhenVisible minHeightClass="min-h-[50vh]">
        <PixelTrailSection />
      </WhenVisible>
    </>
  )
}
