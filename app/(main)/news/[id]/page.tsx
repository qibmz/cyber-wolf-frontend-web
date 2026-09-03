import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { isAxiosError } from "axios"

import {
  getNewsArticlesControllerFindByIdV1QueryKey,
  getNewsArticlesControllerFindByIdV1QueryOptions,
} from "@/api/endpoints/news"
import type { NewsArticle } from "@/api/endpoints/api.schemas"
import { NewsDetail } from "@/components/news/news-detail"
import "@/lib/auth"
import { getServerQueryClient } from "@/lib/query-client"
import type { AxiosResponse } from "axios"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const queryClient = getServerQueryClient()

  try {
    const response = await queryClient.fetchQuery(
      getNewsArticlesControllerFindByIdV1QueryOptions(id)
    )
    const article = response.data
    if (!article) return { title: "资讯不存在" }

    return {
      title: article.title,
      description: article.summary,
      openGraph: {
        title: article.title,
        description: article.summary,
        images: article.coverImage ? [{ url: article.coverImage }] : [],
        type: "article",
        publishedTime: article.publishedAt,
      },
    }
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 404) {
      return { title: "资讯不存在" }
    }
    return { title: "资讯加载失败" }
  }
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const queryClient = getServerQueryClient()

  try {
    await queryClient.fetchQuery(
      getNewsArticlesControllerFindByIdV1QueryOptions(id)
    )
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 404) {
      notFound()
    }
    // 非 404：仍脱水给客户端，由 hook 展示错误 / 重试
  }

  const cached = queryClient.getQueryData<AxiosResponse<NewsArticle | null>>(
    getNewsArticlesControllerFindByIdV1QueryKey(id)
  )
  if (cached && cached.data == null) {
    notFound()
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NewsDetail id={id} />
    </HydrationBoundary>
  )
}
