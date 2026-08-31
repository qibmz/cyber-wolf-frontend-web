import type { Metadata } from "next"

import { MarketsList } from "@/components/markets/markets-list"
import { Container } from "@/components/layout/container"

export const metadata: Metadata = { title: "行情" }

export default function MarketsPage() {
  return (
    <Container className="flex flex-col gap-6 py-8 md:gap-8 md:py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">行情</h1>
        <p className="text-sm text-muted-foreground">
          USDT 现货行情 Screener，数据来自后端聚合接口。
        </p>
      </div>
      <MarketsList />
    </Container>
  )
}
