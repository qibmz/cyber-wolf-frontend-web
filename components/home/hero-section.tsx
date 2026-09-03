import Link from "next/link"

import { Button } from "@/components/ui/button"

const TITLE_1 = "开启数字资产的"
const TITLE_2 = "智慧之旅"

/**
 * Hero 区块（轻量版）：
 * - Server Component + CSS 氛围底与入场动画
 * - 无 WebGL / GSAP / 磁吸交互
 */
export function HeroSection() {
  return (
    <section className="relative flex min-h-[85svh] items-center justify-center overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[#080d1a] opacity-80"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_20%,rgba(129,140,248,0.35),transparent_55%),radial-gradient(ellipse_60%_50%_at_80%_60%,rgba(167,139,250,0.25),transparent_50%),radial-gradient(ellipse_50%_40%_at_20%_70%,rgba(56,189,248,0.2),transparent_45%)]" />
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
        <p className="hero-fade hero-fade-delay-1 text-sm font-medium tracking-[0.3em] text-primary uppercase">
          Cyber Wolf · 赛博狼
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-6xl">
          <span className="hero-fade hero-fade-delay-2 inline-block">
            {TITLE_1}
          </span>
          <br />
          <span className="hero-fade hero-fade-delay-3 inline-block bg-gradient-to-r from-primary via-emerald-300 to-primary bg-clip-text text-transparent">
            {TITLE_2}
          </span>
        </h1>
        <p className="hero-fade hero-fade-delay-4 max-w-xl text-sm text-pretty text-muted-foreground sm:text-base">
          实时行情、深度资讯与专业分析，一站式掌握数字资产市场的每一次脉动。
        </p>
        <div className="hero-fade hero-fade-delay-5 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" render={<Link href="/markets" />}>
            查看行情
          </Button>
          <Button size="lg" variant="outline" render={<Link href="/news" />}>
            浏览资讯
          </Button>
        </div>
      </div>
    </section>
  )
}
