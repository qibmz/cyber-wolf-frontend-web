import type { Metadata } from "next"

import { MarketDetail } from "@/components/markets/market-detail"
import { Container } from "@/components/layout/container"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ symbol: string }>
}): Promise<Metadata> {
  const { symbol } = await params
  const decoded = decodeURIComponent(symbol).toUpperCase()
  return { title: `${decoded} 行情` }
}

export default async function MarketSymbolPage({
  params,
}: {
  params: Promise<{ symbol: string }>
}) {
  const { symbol } = await params
  const decoded = decodeURIComponent(symbol).toUpperCase()

  return (
    <Container className="flex flex-col gap-6 py-8 md:py-10">
      <MarketDetail symbol={decoded} />
    </Container>
  )
}
