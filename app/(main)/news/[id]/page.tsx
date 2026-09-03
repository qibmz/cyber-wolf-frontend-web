import type { Metadata } from "next"

import { NewsDetail } from "@/components/news/news-detail"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  return {
    title: id ? "资讯详情" : "资讯不存在",
  }
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <NewsDetail id={id} />
}
