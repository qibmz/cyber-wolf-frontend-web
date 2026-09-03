"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react"

import { newsArticlesControllerFindByIdV1 } from "@/api/endpoints/news"
import { DocumentTitle } from "@/components/page-title"
import { ImagePreview } from "@/components/news/image-preview"
import { Button } from "@/components/ui/button"
import { getApiErrorMessage } from "@/lib/api-errors"

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

/**
 * 资讯详情：走客户端 `/api/v1`（Next rewrite 代理），
 * 与列表页同一路径，避免 SSR 直连 BACKEND_URL 在部署环境失败后误触发 notFound。
 */
export function NewsDetail({ id }: { id: string }) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["news", "detail", id],
    queryFn: () => newsArticlesControllerFindByIdV1(id),
    enabled: !!id,
  })

  const article = data?.data ?? null

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

  if (!article) {
    return (
      <div className="flex flex-col items-center gap-3 py-24">
        <p className="text-sm text-muted-foreground">资讯不存在或已被移除</p>
        <Button size="sm" variant="outline" render={<Link href="/news" />}>
          返回资讯
        </Button>
      </div>
    )
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
