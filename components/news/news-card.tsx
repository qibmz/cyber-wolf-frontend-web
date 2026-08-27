import Link from "next/link"
import { ExternalLink } from "lucide-react"

import type { NewsArticle } from "@/api/endpoints/api.schemas"
import { NewsImage } from "@/components/news/news-image"

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return ""
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`
}

/**
 * 资讯卡片：封面图（骨架屏加载）+ 标题 + 摘要 + 分类 + 来源/时间。
 */
export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <Link
      href={`/news/${article.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border bg-card/50 transition-colors hover:border-primary/50 hover:bg-card"
    >
      {/* 封面图 */}
      <div className="relative">
        <NewsImage
          src={article.coverImage ?? undefined}
          alt={article.title}
          className="aspect-[16/9] w-full"
        />
        <span className="absolute top-3 left-3 z-10 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium text-primary backdrop-blur">
          {article.category}
        </span>
      </div>

      {/* 内容 */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 font-bold group-hover:text-primary">
          {article.title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {article.summary}
        </p>
        <div className="mt-auto flex items-center gap-2 pt-2 text-xs text-muted-foreground">
          <span className="truncate">{article.sourceName}</span>
          <span aria-hidden>·</span>
          <span>{formatDate(article.publishedAt)}</span>
          <ExternalLink className="ml-auto size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </div>
    </Link>
  )
}
