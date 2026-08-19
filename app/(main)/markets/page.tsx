import type { Metadata } from "next"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"

import { Container } from "@/components/container"
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "行情" }

const MOCK_MARKETS = [
  { symbol: "BTC", name: "比特币", price: "$67,245.30", change: 2.41 },
  { symbol: "ETH", name: "以太坊", price: "$3,412.80", change: 1.12 },
  { symbol: "SOL", name: "Solana", price: "$156.72", change: -0.86 },
  { symbol: "BNB", name: "BNB", price: "$602.15", change: 0.34 },
  { symbol: "XRP", name: "瑞波币", price: "$0.58", change: -1.28 },
  { symbol: "ADA", name: "艾达币", price: "$0.44", change: 3.02 },
  { symbol: "DOGE", name: "狗狗币", price: "$0.16", change: -2.15 },
  { symbol: "DOT", name: "波卡", price: "$7.31", change: 0.97 },
]

export default function MarketsPage() {
  return (
    <Container className="flex flex-col gap-8 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">行情</h1>
        <p className="text-sm text-muted-foreground">
          实时数字资产行情概览（演示数据，实时数据即将接入）。
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_MARKETS.map((market) => {
          const isUp = market.change >= 0
          return (
            <div
              key={market.symbol}
              className="group flex flex-col gap-3 rounded-2xl border bg-card/50 p-5 transition-colors hover:border-primary/40 hover:bg-card"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
                  {market.symbol.slice(0, 1)}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                    isUp
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-red-500/10 text-red-500"
                  )}
                >
                  {isUp ? (
                    <ArrowUpRight className="size-3" />
                  ) : (
                    <ArrowDownRight className="size-3" />
                  )}
                  {Math.abs(market.change).toFixed(2)}%
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">
                  {market.name}
                </span>
                <span className="text-xl font-bold tracking-tight">
                  {market.price}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </Container>
  )
}
