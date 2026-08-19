import type { Metadata } from "next"
import { ArrowRight } from "lucide-react"

import { Container } from "@/components/container"

export const metadata: Metadata = { title: "资讯" }

const MOCK_NEWS = [
  {
    tag: "市场综述",
    title: "数字资产市场本周走势回顾",
    summary: "主流资产在震荡中分化，市场关注度集中于流动性变化与宏观数据发布。",
    date: "2026-08-19",
    readTime: "3 分钟",
  },
  {
    tag: "深度分析",
    title: "从技术面看当前行情的支撑与阻力",
    summary: "多位分析师认为关键支撑区间有效，短期波动或为长期布局提供窗口。",
    date: "2026-08-18",
    readTime: "8 分钟",
  },
  {
    tag: "行业动态",
    title: "行业基础设施持续升级，交易体验迎来新变化",
    summary: "多家平台推进性能优化与新功能落地，用户交易链路进一步简化。",
    date: "2026-08-16",
    readTime: "5 分钟",
  },
  {
    tag: "政策观察",
    title: "全球监管动态一览：合规进程加速",
    summary: "多地监管框架趋于明晰，行业合规化成为主旋律。",
    date: "2026-08-14",
    readTime: "6 分钟",
  },
]

export default function NewsPage() {
  return (
    <Container className="flex flex-col gap-8 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">资讯</h1>
        <p className="text-sm text-muted-foreground">
          行业动态、深度分析与市场观察（演示数据，正式内容即将上线）。
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {MOCK_NEWS.map((article) => (
          <article
            key={article.title}
            className="group flex flex-col gap-2 rounded-2xl border bg-card/50 p-6 transition-colors hover:border-primary/40 hover:bg-card sm:flex-row sm:items-start sm:justify-between sm:gap-6"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {article.tag}
                </span>
                <span className="text-xs text-muted-foreground">
                  {article.readTime}
                </span>
              </div>
              <h2 className="text-lg font-bold group-hover:text-primary">
                {article.title}
              </h2>
              <p className="text-sm text-muted-foreground">{article.summary}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground sm:flex-col sm:items-end">
              <span>{article.date}</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </div>
          </article>
        ))}
      </div>
    </Container>
  )
}
