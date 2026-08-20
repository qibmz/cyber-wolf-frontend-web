import type { Metadata } from "next"

import { Container } from "@/components/layout/container"
import { NewsList } from "@/components/news/news-list"

export const metadata: Metadata = {
  title: "资讯",
  description: "行业动态、深度分析与市场观察。",
}

export default function NewsPage() {
  return (
    <Container className="flex flex-col gap-8 py-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold">资讯</h1>
        <p className="text-sm text-muted-foreground">
          行业动态、深度分析与市场观察。
        </p>
      </div>

      <NewsList />
    </Container>
  )
}
