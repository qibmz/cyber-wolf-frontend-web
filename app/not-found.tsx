import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="flex flex-col items-center gap-2">
        <p className="text-6xl font-bold text-primary">404</p>
        <h1 className="text-2xl font-bold">页面不存在</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          您访问的页面不存在或已被移除，请检查地址是否正确。
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
      >
        返回首页
      </Link>
    </div>
  )
}
