"use client"

import { CandlestickChart, Newspaper, ShieldCheck } from "lucide-react"

import { ScrollStack, ScrollStackItem } from "@/components/scroll-stack"

const FEATURES = [
  {
    title: "实时行情",
    description: "毫秒级数据推送，价格、涨跌、成交量一目了然。",
    icon: CandlestickChart,
  },
  {
    title: "深度资讯",
    description: "市场综述、深度分析、政策解读，信息不缺席。",
    icon: Newspaper,
  },
  {
    title: "安全可靠",
    description: "企业级安全体系，守护你的每一次访问。",
    icon: ShieldCheck,
  },
]

/**
 * 特性模块：ScrollStack 层叠卡片（滚动时依次展开）+ Spotlight 聚光。
 */
export function ParallaxSection() {
  function handleCardMove(e: React.MouseEvent<HTMLElement>) {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    card.style.setProperty("--spot-x", `${px}px`)
    card.style.setProperty("--spot-y", `${py}px`)
  }

  return (
    <section className="overflow-hidden">
      <ScrollStack
        itemDistance={90}
        itemScale={0.04}
        itemStackDistance={40}
        rotationAmount={2.5}
        blurAmount={2}
        stackPosition="30%"
        baseScale={0.88}
      >
        {FEATURES.map((feature, index) => (
          <ScrollStackItem key={feature.title}>
            <div
              className="spotlight-card group relative flex flex-col gap-4 overflow-hidden rounded-3xl border bg-card/60 p-8 backdrop-blur-sm transition-colors hover:border-primary/50 sm:flex-row sm:items-center sm:justify-between"
              onMouseMove={handleCardMove}
            >
              {/* Spotlight 聚光层 */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(500px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in oklch, var(--primary) 14%, transparent), transparent 60%)",
                }}
                aria-hidden
              />

              <div className="relative flex items-center gap-5">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <feature.icon className="size-7" />
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-2xl font-bold">{feature.title}</h3>
                  <p className="max-w-md text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
              <span className="relative text-5xl font-bold opacity-15 select-none">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </section>
  )
}
