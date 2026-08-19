import Link from "next/link"

import { BrandLogo } from "@/components/brand-logo"
import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <Container className="flex flex-1 flex-col gap-6 py-10">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">欢迎来到 Cyber Wolf</h1>
        <p className="text-sm text-muted-foreground">
          这里是首页，导航栏的「行情」「资讯」页面即将上线。
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm" render={<Link href="/login" />}>
          去登录
        </Button>
        <Button size="sm" variant="outline" render={<Link href="/markets" />}>
          行情
        </Button>
        <Button size="sm" variant="outline" render={<Link href="/news" />}>
          资讯
        </Button>
      </div>
      <div className="mt-auto flex items-center gap-2 text-sm text-muted-foreground">
        <BrandLogo />
        <span>·</span>
        <span>Cyber Wolf 官方 Web 应用</span>
      </div>
    </Container>
  )
}
