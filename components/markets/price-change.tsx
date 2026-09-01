import {
  formatChangePercent,
  isPriceUp,
  parseMarketNumber,
} from "@/lib/format-market"
import { cn } from "@/lib/utils"

interface PriceChangeProps {
  value: string | number | null | undefined
  className?: string
}

/** 涨跌幅：仅色值 + 正负百分比，无箭头图标 */
export function PriceChange({ value, className }: PriceChangeProps) {
  const n = parseMarketNumber(value)
  if (!Number.isFinite(n)) {
    return (
      <span className={cn("font-mono text-muted-foreground", className)}>
        —
      </span>
    )
  }

  const up = isPriceUp(n)

  return (
    <span
      className={cn(
        "font-mono text-sm font-medium tabular-nums",
        up ? "text-emerald-500" : "text-red-500",
        className
      )}
    >
      {formatChangePercent(n)}
    </span>
  )
}
