"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"

import { TextScramble } from "@/components/home/text-scramble"

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

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
  mq.addEventListener("change", onChange)
  return () => mq.removeEventListener("change", onChange)
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false
  )
}

function StatCard({ stat }: { stat: (typeof STATS)[number] }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    const el = cardRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setStarted(true)
        observer.disconnect()
      },
      { threshold: 0.2, rootMargin: "0px 0px -15% 0px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [reducedMotion])

  const display = formatValue(stat.value, stat.decimals)

  return (
    <div
      ref={cardRef}
      className="flex min-w-0 flex-col items-center gap-1.5 rounded-2xl bg-card/50 p-4 text-center backdrop-blur-sm sm:p-6"
    >
      <div className="flex h-8 items-baseline justify-center gap-0.5 sm:h-12">
        {reducedMotion ? (
          <span className="font-mono text-xl font-bold tracking-tight text-primary tabular-nums sm:text-4xl">
            {display}
          </span>
        ) : started ? (
          <TextScramble
            value={display}
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
 * 数据统计区块：滚动进入视口后乱码解码为最终数字（无 GSAP）。
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
