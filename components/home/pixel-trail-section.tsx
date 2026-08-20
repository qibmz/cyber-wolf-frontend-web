"use client"

import { useEffect, useState } from "react"

import { PixelTrail } from "@/components/home/pixel-trail"

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Cyber Wolf"

/**
 * PixelTrail 像素拖尾区块：鼠标划过时产生像素点亮拖尾。
 * 移动端隐藏 canvas；无 WebGL 环境自动降级（只显示文字）。
 */
export function PixelTrailSection() {
  const [webglSupported, setWebglSupported] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const canvas = document.createElement("canvas")
        setWebglSupported(
          Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"))
        )
      } catch {
        setWebglSupported(false)
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative flex h-[45vh] items-center justify-center overflow-hidden border-t">
      {webglSupported && (
        <div className="pointer-events-none absolute inset-0 hidden md:block">
          <PixelTrail
            color="#60d095"
            gridSize={64}
            trailSize={0.045}
            maxAge={120}
            interpolate={5}
            gooeyFilter={{ id: "pixel-goo", strength: 5 }}
          />
        </div>
      )}
      <div className="pointer-events-none relative z-10 flex flex-col items-center gap-3 px-4 text-center">
        <p className="text-sm font-medium tracking-[0.3em] text-primary uppercase">
          赛博狼 · Cyber Wolf
        </p>
        <h2 className="text-5xl font-bold tracking-tight text-balance sm:text-6xl">
          {siteName}
        </h2>
      </div>
    </section>
  )
}
