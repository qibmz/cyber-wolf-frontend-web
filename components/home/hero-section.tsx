"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

import { Button } from "@/components/ui/button"

const Lightfall = dynamic(
  () =>
    import("@/components/home/lightfall").then((m) => ({
      default: m.Lightfall,
    })),
  { ssr: false }
)

const TITLE_1 = "开启数字资产的"
const TITLE_2 = "智慧之旅"

/**
 * Hero 区块：
 * - 先 CSS 壳保证 LCP，空闲后再挂 WebGL Lightfall（移动端仅 CSS）
 * - 标题逐字符上浮入场（GSAP）
 * - 磁吸按钮（鼠标跟随）
 */
export function HeroSection() {
  const scope = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const [showLightfall, setShowLightfall] = useState(false)

  useEffect(() => {
    // 移动端 / 粗指针：跳过 WebGL，只保留 CSS 氛围底
    const canWebGL = window.matchMedia(
      "(min-width: 768px) and (pointer: fine)"
    ).matches
    if (!canWebGL) return

    const enable = () => setShowLightfall(true)
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(enable, { timeout: 1200 })
      return () => window.cancelIdleCallback(id)
    }
    const t = window.setTimeout(enable, 200)
    return () => window.clearTimeout(t)
  }, [])

  useGSAP(
    () => {
      gsap.from(".hero-char", {
        y: 60,
        opacity: 0,
        rotateX: -80,
        duration: 0.9,
        stagger: 0.03,
        ease: "power3.out",
        delay: 0.2,
      })

      gsap.from(".hero-fade", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        delay: 0.6,
        ease: "power2.out",
      })
    },
    { scope }
  )

  function handleCtaMove(e: React.MouseEvent) {
    if (!ctaRef.current) return
    const rect = ctaRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    gsap.to(ctaRef.current, { x: x * 0.35, y: y * 0.35, duration: 0.3 })
  }

  function handleCtaLeave() {
    gsap.to(ctaRef.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1,0.4)",
    })
  }

  const renderTitle = (text: string) =>
    text.split("").map((char, i) => (
      <span
        key={`${char}-${i}`}
        className="hero-char inline-block"
        style={{ perspective: "400px" }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ))

  return (
    <section
      ref={scope}
      className="relative flex min-h-[85svh] items-center justify-center overflow-hidden"
    >
      {/* CSS 壳：立即可见；桌面空闲后再叠 WebGL */}
      <div
        className="pointer-events-none absolute inset-0 bg-[#080d1a] opacity-80"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_20%,rgba(129,140,248,0.35),transparent_55%),radial-gradient(ellipse_60%_50%_at_80%_60%,rgba(167,139,250,0.25),transparent_50%),radial-gradient(ellipse_50%_40%_at_20%_70%,rgba(56,189,248,0.2),transparent_45%)]" />
        {showLightfall ? (
          <Lightfall
            colors={["#818cf8", "#a78bfa", "#38bdf8"]}
            backgroundColor="#080d1a"
            speed={0.7}
            streakCount={4}
            streakWidth={1.2}
            streakLength={1.3}
            glow={1}
            density={0.7}
            zoom={3}
            backgroundGlow={0.35}
            opacity={0.85}
          />
        ) : null}
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_40%,transparent_40%,var(--background)_100%)]"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--foreground)_5%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--foreground)_5%,transparent)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)] bg-[size:72px_72px]"
        aria-hidden
      />

      <div className="relative flex max-w-3xl flex-col items-center gap-7 px-4 py-28 text-center">
        <p className="hero-fade text-sm font-medium tracking-[0.3em] text-primary uppercase">
          Cyber Wolf · 赛博狼
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-6xl">
          <span className="inline-block">{renderTitle(TITLE_1)}</span>
          <br />
          <span className="hero-fade inline-block bg-gradient-to-r from-primary via-emerald-300 to-primary bg-clip-text text-transparent">
            {TITLE_2}
          </span>
        </h1>
        <p className="hero-fade max-w-xl text-sm text-pretty text-muted-foreground sm:text-base">
          实时行情、深度资讯与专业分析，一站式掌握数字资产市场的每一次脉动。
        </p>
        <div
          className="hero-fade flex flex-wrap items-center justify-center gap-3"
          onMouseMove={handleCtaMove}
          onMouseLeave={handleCtaLeave}
        >
          <div ref={ctaRef}>
            <Button size="lg" render={<Link href="/markets" />}>
              查看行情
            </Button>
          </div>
          <Button size="lg" variant="outline" render={<Link href="/news" />}>
            浏览资讯
          </Button>
        </div>
      </div>
    </section>
  )
}
