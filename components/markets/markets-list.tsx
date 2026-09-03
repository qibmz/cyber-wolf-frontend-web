"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useInfiniteQuery } from "@tanstack/react-query"
import InfiniteScroll from "react-infinite-scroll-component"
import { Loader2, Search } from "lucide-react"

import type { Market } from "@/api/endpoints/api.schemas"
import { marketsControllerFindAllV1 } from "@/api/endpoints/markets"
import { PriceChange } from "@/components/markets/price-change"
import { TokenLogo } from "@/components/markets/token-logo"
import { scrollToTop } from "@/lib/scroll"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { getApiErrorMessage } from "@/lib/api-errors"
import { formatCompactVolume, formatPrice } from "@/lib/format-market"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 40
const SEARCH_DEBOUNCE_MS = 300

function MarketsTableHeader() {
  return (
    <div className="sticky top-14 z-10 hidden grid-cols-[minmax(0,2fr)_repeat(5,minmax(0,1fr))] gap-3 border-b bg-background px-3 py-2.5 text-xs font-medium tracking-wide text-muted-foreground md:grid">
      <span>资产</span>
      <span className="text-right">最新价</span>
      <span className="text-right">24h</span>
      <span className="text-right">24h 高 / 低</span>
      <span className="text-right">成交量</span>
      <span className="text-right">成交额</span>
    </div>
  )
}

function MarketDesktopRow({
  market,
  index,
}: {
  market: Market
  index: number
}) {
  return (
    <Link
      href={`/markets/${encodeURIComponent(market.symbol)}`}
      prefetch={false}
      className={cn(
        "hidden grid-cols-[minmax(0,2fr)_repeat(5,minmax(0,1fr))] items-center gap-3 border-b border-border/60 px-3 py-3 transition-colors md:grid",
        "hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none"
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="w-6 shrink-0 text-xs text-muted-foreground tabular-nums">
          {index}
        </span>
        <TokenLogo src={market.logoUrl} symbol={market.baseAsset} />
        <div className="min-w-0">
          <div className="truncate font-semibold tracking-tight">
            {market.baseAsset}
            <span className="ml-1 font-normal text-muted-foreground">
              /{market.quoteAsset}
            </span>
          </div>
          <div className="truncate font-mono text-xs text-muted-foreground">
            {market.symbol}
          </div>
        </div>
      </div>
      <span className="text-right font-mono text-sm tabular-nums">
        {formatPrice(market.lastPrice)}
      </span>
      <span className="flex justify-end">
        <PriceChange value={market.priceChangePercent} />
      </span>
      <span className="text-right font-mono text-xs text-muted-foreground tabular-nums">
        <span className="text-foreground/90">
          {formatPrice(market.highPrice)}
        </span>
        <span className="mx-1 text-border">/</span>
        {formatPrice(market.lowPrice)}
      </span>
      <span className="text-right font-mono text-sm tabular-nums">
        {formatCompactVolume(market.volume)}
      </span>
      <span className="text-right font-mono text-sm tabular-nums">
        {formatCompactVolume(market.quoteVolume)}
      </span>
    </Link>
  )
}

function MarketMobileRow({ market }: { market: Market }) {
  return (
    <Link
      href={`/markets/${encodeURIComponent(market.symbol)}`}
      prefetch={false}
      className="flex items-center gap-3 border-b border-border/60 px-1 py-3 transition-colors hover:bg-muted/30 md:hidden"
    >
      <TokenLogo src={market.logoUrl} symbol={market.baseAsset} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-semibold">
            {market.baseAsset}
            <span className="ml-1 font-normal text-muted-foreground">
              /{market.quoteAsset}
            </span>
          </span>
          <span className="shrink-0 font-mono text-sm tabular-nums">
            {formatPrice(market.lastPrice)}
          </span>
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="font-mono">{market.symbol}</span>
          <PriceChange value={market.priceChangePercent} className="text-xs" />
        </div>
        <div className="mt-1 flex justify-between gap-2 font-mono text-[11px] text-muted-foreground">
          <span>额 {formatCompactVolume(market.quoteVolume)}</span>
          <span>量 {formatCompactVolume(market.volume)}</span>
        </div>
      </div>
    </Link>
  )
}

function MarketsListSkeleton() {
  return (
    <div className="flex flex-col gap-0">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 border-b border-border/40 px-1 py-3 md:grid md:grid-cols-[minmax(0,2fr)_repeat(5,minmax(0,1fr))] md:px-3"
        >
          <div className="flex flex-1 items-center gap-3">
            <Skeleton className="size-8 rounded-full" />
            <div className="flex flex-1 flex-col gap-1.5">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-3 w-16 rounded-md" />
            </div>
          </div>
          <Skeleton className="ml-auto hidden h-4 w-16 rounded-md md:block" />
          <Skeleton className="ml-auto hidden h-4 w-14 rounded-md md:block" />
          <Skeleton className="ml-auto hidden h-4 w-24 rounded-md md:block" />
          <Skeleton className="ml-auto hidden h-4 w-12 rounded-md md:block" />
          <Skeleton className="ml-auto h-4 w-14 rounded-md" />
        </div>
      ))}
    </div>
  )
}

export function MarketsList() {
  const [searchInput, setSearchInput] = useState("")
  const [query, setQuery] = useState("")

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const next = searchInput.trim()
      setQuery((prev) => {
        if (prev === next) return prev
        scrollToTop()
        return next
      })
    }, SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [searchInput])

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["markets", "list", query],
    queryFn: ({ pageParam }) =>
      marketsControllerFindAllV1({
        page: pageParam as number,
        limit: PAGE_SIZE,
        ...(query ? { q: query } : {}),
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const body = lastPage.data
      return body.hasNextPage ? allPages.length + 1 : undefined
    },
  })

  const markets = useMemo(
    () => data?.pages.flatMap((page) => page.data.data) ?? [],
    [data]
  )

  const total = data?.pages[0]?.data.total

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {typeof total === "number" ? (
            <>
              共{" "}
              <span className="font-mono text-foreground tabular-nums">
                {total.toLocaleString()}
              </span>{" "}
              个交易对
            </>
          ) : (
            "USDT 现货行情"
          )}
        </p>
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="搜索 BTC / BTCUSDT"
            className="pl-9"
            aria-label="搜索交易对"
          />
        </div>
      </div>

      {isLoading ? (
        <MarketsListSkeleton />
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 py-24">
          <p className="text-sm text-destructive">
            {getApiErrorMessage(error)}
          </p>
          <Button size="sm" onClick={() => refetch()}>
            重试
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border bg-card/30">
          <MarketsTableHeader />
          <InfiniteScroll
            dataLength={markets.length}
            next={fetchNextPage}
            hasMore={hasNextPage ?? false}
            loader={
              <div className="flex items-center justify-center py-6">
                <Loader2 className="animate-spin text-primary" />
              </div>
            }
            endMessage={
              markets.length > 0 ? (
                <p className="py-6 text-center text-xs text-muted-foreground">
                  已经到底啦
                </p>
              ) : (
                <p className="py-24 text-center text-sm text-muted-foreground">
                  {query ? "没有匹配的交易对" : "暂无行情"}
                </p>
              )
            }
          >
            {markets.map((market, i) => (
              <div key={market.symbol}>
                <MarketDesktopRow market={market} index={i + 1} />
                <MarketMobileRow market={market} />
              </div>
            ))}
          </InfiniteScroll>
        </div>
      )}
    </div>
  )
}
