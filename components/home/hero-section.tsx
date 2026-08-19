"use client"

import Link from "next/link"
import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

import { Lightfall } from "@/components/lightfall"
import { Button } from "@/components/ui/button"

const TITLE_1 = "开启数字资产的"
const TITLE_2 = "智慧之旅"

/**
 * Hero 区块：
 * - Aurora 极光背景（CSS 动画）
 * - 标题逐字符上浮入场（GSAP）
 * - 磁吸按钮（鼠标跟随）
 */
export function HeroSection() {
  const scope = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // 标题字符逐个入场
      gsap.from(".hero-char", {
        y: 60,
        opacity: 0,
        rotateX: -80,
        duration: 0.9,
        stagger: 0.03,
        ease: "power3.out",
        delay: 0.2,
      })

      // 副标题/按钮渐入
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
      {/* WebGL Lightfall 光雨背景（蓝紫色系，与绿色文字互补） */}
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        aria-hidden
      >
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
      </div>
      {/* 底部渐隐遮罩，保证文字可读 */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_40%,transparent_40%,var(--background)_100%)]"
        aria-hidden
      />

      {/* 网格纹理 */}
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
