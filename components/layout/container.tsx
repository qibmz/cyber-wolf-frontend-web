import { cn } from "@/lib/utils"

/**
 * 页面内容容器：统一最大宽度与左右留白。
 * Navbar 与各页面共用，保证内容左右对齐一致。
 */
export function Container({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-7xl px-4 md:px-6", className)}
      {...props}
    />
  )
}
