import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { isAxiosError } from "axios"

import type { Market } from "@/api/endpoints/api.schemas"
import {
  getMarketsControllerFindOneV1QueryKey,
  marketsControllerFindOneV1,
} from "@/api/endpoints/markets"
import { MarketDetail } from "@/components/markets/market-detail"
import { Container } from "@/components/layout/container"
import "@/lib/auth"
import {
  type DehydratedAxiosData,
  toDehydratedAxiosData,
} from "@/lib/dehydrate-axios"
import { getServerQueryClient } from "@/lib/query-client"

function decodeSymbol(symbol: string): string {
  try {
    return decodeURIComponent(symbol).toUpperCase()
  } catch {
    return symbol.toUpperCase()
  }
}

async function prefetchMarket(symbol: string) {
  const queryClient = getServerQueryClient()
  return queryClient.fetchQuery({
    queryKey: getMarketsControllerFindOneV1QueryKey(symbol),
    queryFn: async () =>
      toDehydratedAxiosData(await marketsControllerFindOneV1(symbol)),
  })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ symbol: string }>
}): Promise<Metadata> {
  const { symbol } = await params
  const decoded = decodeSymbol(symbol)

  try {
    const response = await prefetchMarket(decoded)
    const market = response.data
    if (!market) return { title: `${decoded} 行情` }
    return { title: `${market.baseAsset} 行情` }
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 404) {
      return { title: `${decoded} 行情` }
    }
    return { title: "行情加载失败" }
  }
}

export default async function MarketSymbolPage({
  params,
}: {
  params: Promise<{ symbol: string }>
}) {
  const { symbol } = await params
  const decoded = decodeSymbol(symbol)
  const queryClient = getServerQueryClient()

  try {
    await prefetchMarket(decoded)
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 404) {
      notFound()
    }
  }

  const cached = queryClient.getQueryData<DehydratedAxiosData<Market | null>>(
    getMarketsControllerFindOneV1QueryKey(decoded)
  )
  if (cached && cached.data == null) {
    notFound()
  }

  return (
    <Container className="flex flex-col gap-6 py-8 md:py-10">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MarketDetail symbol={decoded} />
      </HydrationBoundary>
    </Container>
  )
}
