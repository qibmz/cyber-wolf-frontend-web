"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, Loader2 } from "lucide-react"

import type { Market } from "@/api/endpoints/api.schemas"
import { marketsControllerFindOneV1 } from "@/api/endpoints/markets"
import { PriceChange } from "@/components/markets/price-change"
import { TokenLogo } from "@/components/markets/token-logo"
import { Button } from "@/components/ui/button"
import { DocumentTitle } from "@/components/page-title"
import { getApiErrorMessage } from "@/lib/api-errors"
import { formatCompactVolume, formatPrice } from "@/lib/format-market"

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border/70 bg-card/40 px-4 py-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-mono text-sm tracking-tight tabular-nums md:text-base">
        {value}
      </span>
    </div>
  )
}

export function MarketDetail({ symbol }: { symbol: string }) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["markets", symbol],
    queryFn: () => marketsControllerFindOneV1(symbol),
  })

  const market = data?.data ?? null

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="mr-2 animate-spin" />
        加载中…
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-24">
        <p className="text-sm text-destructive">{getApiErrorMessage(error)}</p>
        <Button size="sm" onClick={() => refetch()}>
          重试
        </Button>
      </div>
    )
  }

  if (!market) {
    return (
      <div className="flex flex-col items-center gap-4 py-24">
        <p className="text-sm text-muted-foreground">未找到交易对 {symbol}</p>
        <Button size="sm" render={<Link href="/markets" />}>
          返回行情
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <DocumentTitle title={`${market.baseAsset} 行情`} />

      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 -ml-2 text-muted-foreground"
          render={<Link href="/markets" />}
        >
          <ArrowLeft className="size-4" />
          行情
        </Button>

        <div className="flex flex-wrap items-start gap-4">
          <TokenLogo
            src={market.logoUrl}
            symbol={market.baseAsset}
            className="size-12 text-base"
          />
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              {market.baseAsset}
              <span className="ml-1.5 text-lg font-normal text-muted-foreground md:text-xl">
                /{market.quoteAsset}
              </span>
            </h1>
            <p className="mt-1 font-mono text-sm text-muted-foreground">
              {market.symbol}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="font-mono text-3xl font-semibold tracking-tight tabular-nums">
              {formatPrice(market.lastPrice)}
            </span>
            <PriceChange value={market.priceChangePercent} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCell label="24h 最高" value={formatPrice(market.highPrice)} />
        <StatCell label="24h 最低" value={formatPrice(market.lowPrice)} />
        <StatCell
          label="24h 成交量"
          value={formatCompactVolume(market.volume)}
        />
        <StatCell
          label="24h 成交额 (USDT)"
          value={formatCompactVolume(market.quoteVolume)}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        K 线与深度图将在后端提供对应接口后接入。
      </p>
    </div>
  )
}
