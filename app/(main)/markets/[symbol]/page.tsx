import type { Metadata } from "next"

import { MarketDetail } from "@/components/markets/market-detail"
import { Container } from "@/components/layout/container"

function decodeSymbol(symbol: string): string {
  try {
    return decodeURIComponent(symbol).toUpperCase()
  } catch {
    // 畸形 % 编码（如 /markets/%25）会让 decodeURIComponent 抛 URIError，
    // 回退到原始值，避免整页 500
    return symbol.toUpperCase()
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ symbol: string }>
}): Promise<Metadata> {
  const { symbol } = await params
  const decoded = decodeSymbol(symbol)
  return { title: `${decoded} 行情` }
}

export default async function MarketSymbolPage({
  params,
}: {
  params: Promise<{ symbol: string }>
}) {
  const { symbol } = await params
  const decoded = decodeSymbol(symbol)

  return (
    <Container className="flex flex-col gap-6 py-8 md:py-10">
      <MarketDetail symbol={decoded} />
    </Container>
  )
}
