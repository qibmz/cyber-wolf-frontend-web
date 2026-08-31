/** 行情数字展示：价格 / 涨跌幅 / 成交量缩写 */

export function parseMarketNumber(
  value: string | number | null | undefined
): number {
  if (value == null || value === "") return NaN
  const n = typeof value === "number" ? value : Number(value)
  return Number.isFinite(n) ? n : NaN
}

/** 最新价：按量级调整小数位 */
export function formatPrice(value: string | number | null | undefined): string {
  const n = parseMarketNumber(value)
  if (!Number.isFinite(n)) return "—"

  const abs = Math.abs(n)
  let maximumFractionDigits = 2
  if (abs === 0) maximumFractionDigits = 2
  else if (abs < 0.0001) maximumFractionDigits = 8
  else if (abs < 1) maximumFractionDigits = 6
  else if (abs < 100) maximumFractionDigits = 4
  else maximumFractionDigits = 2

  return n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  })
}

/** 24h 涨跌幅，如 +1.23% / -0.80% */
export function formatChangePercent(
  value: string | number | null | undefined
): string {
  const n = parseMarketNumber(value)
  if (!Number.isFinite(n)) return "—"
  const sign = n > 0 ? "+" : ""
  return `${sign}${n.toFixed(2)}%`
}

/** 成交量 / 成交额缩写 */
export function formatCompactVolume(
  value: string | number | null | undefined
): string {
  const n = parseMarketNumber(value)
  if (!Number.isFinite(n)) return "—"

  const abs = Math.abs(n)
  const sign = n < 0 ? "-" : ""

  if (abs >= 1e9) return `${sign}${(abs / 1e9).toFixed(2)}B`
  if (abs >= 1e6) return `${sign}${(abs / 1e6).toFixed(2)}M`
  if (abs >= 1e3) return `${sign}${(abs / 1e3).toFixed(2)}K`
  return `${sign}${abs.toFixed(abs < 1 ? 4 : 2)}`
}

export function isPriceUp(value: string | number | null | undefined): boolean {
  const n = parseMarketNumber(value)
  return Number.isFinite(n) && n >= 0
}
