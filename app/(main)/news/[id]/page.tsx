import type { Metadata } from "next"
import { cache } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ExternalLink } from "lucide-react"

import type { NewsArticle } from "@/api/endpoints/api.schemas"
import { DocumentTitle } from "@/components/page-title"
import { ImagePreview } from "@/components/news/image-preview"
import { Button } from "@/components/ui/button"

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3001"

/**
 * 服务端拉取文章详情（不走客户端 axios 拦截器，手动处理语言头与解包）。
 * 用 cache() 去重 generateMetadata 与页面渲染的重复请求。
 */
const fetchArticle = cache(async (id: string): Promise<NewsArticle | null> => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/news/${id}`, {
      headers: { "x-custom-lang": "zh" },
      cache: "no-store",
    })
    if (!res.ok) return null
    const json = (await res.json()) as {
      code: number
      data?: NewsArticle | null
    }
    if (json.code !== 200 || !json.data) return null
    return json.data
  } catch {
    return null
  }
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const article = await fetchArticle(id)
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
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return ""
  return d.toLocaleString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const article = await fetchArticle(id)

  if (!article) {
    notFound()
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 md:px-6">
      <DocumentTitle title={article.title} />

      <Button
        variant="ghost"
        size="sm"
        className="mb-6"
        render={<Link href="/news" />}
      >
        <ArrowLeft />
        返回资讯
      </Button>

      <article className="flex flex-col gap-6">
        <ImagePreview
          src={article.coverImage ?? undefined}
          alt={article.title}
          className="aspect-[16/9] w-full rounded-2xl"
        />

        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {article.category}
          </span>
          <span>{article.sourceName}</span>
          <span aria-hidden>·</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-balance">
          {article.title}
        </h1>

        <p className="text-base leading-relaxed text-pretty text-muted-foreground">
          {article.summary}
        </p>

        {article.url && (
          <Button
            size="lg"
            className="self-start"
            render={
              <a href={article.url} target="_blank" rel="noreferrer noopener" />
            }
          >
            阅读原文
            <ExternalLink />
          </Button>
        )}
      </article>
    </div>
  )
}
