"use client"

import { useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { TextScramble } from "@/components/home/text-scramble"

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { value: 120, suffix: "+", label: "支持的数字资产", decimals: 0 },
  { value: 50000, suffix: "+", label: "活跃用户", decimals: 0 },
  { value: 24, suffix: "h", label: "实时行情更新", decimals: 0 },
  { value: 99.99, suffix: "%", label: "服务可用性", decimals: 2 },
]

function formatValue(value: number, decimals: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

function StatCard({ stat }: { stat: (typeof STATS)[number] }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)

  // 滚动进入视口后开始乱码解码
  useGSAP(
    () => {
      if (!cardRef.current) return
      ScrollTrigger.create({
        trigger: cardRef.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          setTimeout(() => setStarted(true), 0)
        },
      })
    },
    { scope: cardRef }
  )

  return (
    <div
      ref={cardRef}
      className="flex min-w-0 flex-col items-center gap-1.5 rounded-2xl bg-card/50 p-4 text-center backdrop-blur-sm sm:p-6"
    >
      <div className="flex h-8 items-baseline justify-center gap-0.5 sm:h-12">
        {started ? (
          <TextScramble
            value={formatValue(stat.value, stat.decimals)}
            duration={900}
            className="font-mono text-xl font-bold tracking-tight text-primary tabular-nums sm:text-4xl"
          />
        ) : (
          <span className="text-xl font-bold tracking-tight text-primary tabular-nums sm:text-4xl">
            {formatValue(0, stat.decimals)}
          </span>
        )}
        <span className="text-xl font-bold text-primary sm:text-4xl">
          {stat.suffix}
        </span>
      </div>
      <span className="text-xs text-muted-foreground sm:text-sm">
        {stat.label}
      </span>
    </div>
  )
}

/**
 * 数据统计区块（赛博朋克黑客风）：
 * 滚动进入 → 乱码闪烁解码为最终数字。
 */
export function StatsSection() {
  return (
    <section className="relative border-y bg-card/30">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-3 overflow-hidden px-4 py-14 md:grid-cols-4 md:px-6 lg:gap-6">
        {STATS.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>
      <p className="absolute right-4 bottom-2 text-xs text-primary md:right-6 md:bottom-3">
        数据仅供参考
      </p>
    </section>
  )
}
