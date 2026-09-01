"use client"

import { useMemo, useState } from "react"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import InfiniteScroll from "react-infinite-scroll-component"
import { Loader2 } from "lucide-react"

import {
  newsArticlesControllerFindAllV1,
  newsArticlesControllerFindCategoriesV1,
} from "@/api/endpoints/news"
import { scrollToTop } from "@/components/lenis-provider"
import { NewsCard } from "@/components/news/news-card"
import { Button } from "@/components/ui/button"
import { getApiErrorMessage } from "@/lib/api-errors"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 9

export function NewsList() {
  const [categoryId, setCategoryId] = useState<string | null>(null)

  const { data: categoriesData } = useQuery({
    queryKey: ["news-categories"],
    queryFn: () => newsArticlesControllerFindCategoriesV1(),
  })
  const categories = categoriesData?.data ?? []

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["news", categoryId],
    queryFn: ({ pageParam }) =>
      newsArticlesControllerFindAllV1({
        page: pageParam as number,
        limit: PAGE_SIZE,
        ...(categoryId ? { categoryId } : {}),
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const body = lastPage.data
      return body.hasNextPage ? allPages.length + 1 : undefined
    },
  })
  const articles = useMemo(
    () => data?.pages.flatMap((page) => page.data.data) ?? [],
    [data]
  )

  function handleCategoryChange(catId: string | null) {
    setCategoryId(catId)
    scrollToTop()
  }

  return (
    <>
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleCategoryChange(null)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              categoryId === null
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            全部
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() =>
                handleCategoryChange(cat.id === categoryId ? null : cat.id)
              }
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                categoryId === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="mr-2 animate-spin" />
          加载中…
        </div>
      ) : isError && !data ? (
        <div className="flex flex-col items-center gap-3 py-24">
          <p className="text-sm text-destructive">
            {getApiErrorMessage(error)}
          </p>
          <Button size="sm" onClick={() => refetch()}>
            重试
          </Button>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchNextPage}
          hasMore={hasNextPage ?? false}
          loader={
            <div className="flex items-center justify-center py-6">
              <Loader2 className="animate-spin text-primary" />
            </div>
          }
          endMessage={
            articles.length > 0 ? (
              <p className="py-6 text-center text-xs text-muted-foreground">
                已经到底啦
              </p>
            ) : (
              <p className="py-24 text-center text-sm text-muted-foreground">
                暂无资讯
              </p>
            )
          }
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
          {isError && data && (
            <div className="flex justify-center py-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchNextPage()}
              >
                加载失败，点击重试
              </Button>
            </div>
          )}
        </InfiniteScroll>
      )}
    </>
  )
}
