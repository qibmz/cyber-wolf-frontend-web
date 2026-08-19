"use client"

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <p className="text-6xl font-bold text-primary">出错了</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              页面发生了一个意外错误，请尝试刷新或稍后再试。
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            重试
          </button>
        </div>
      </body>
    </html>
  )
}
