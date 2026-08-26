"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import { BrandLogo } from "@/components/layout/brand-logo"
import { Container } from "@/components/layout/container"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { label: "首页", href: "/" },
  { label: "行情", href: "/markets" },
  { label: "资讯", href: "/news" },
]

function getAvatarUrl(photo: unknown): string | undefined {
  if (typeof photo === "string" && photo) return photo
  if (photo && typeof photo === "object" && "url" in photo) {
    const url = (photo as { url?: unknown }).url
    if (typeof url === "string" && url) return url
  }
  return undefined
}

export function Navbar() {
  const { user, isAuthenticated } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  const displayName = user?.nickname?.trim()
    ? user.nickname
    : (user?.email ?? "")

  const avatarUrl = user ? getAvatarUrl(user.photo) : undefined

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <Container>
        <nav className="relative flex h-14 items-center gap-4 md:gap-8">
          <BrandLogo />

          {/* 桌面端：横向导航（绝对居中） */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                  isActive(item.href)
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* 桌面端：头像 / 登录按钮 */}
            <div className="hidden md:block">
              {isAuthenticated && user ? (
                <Avatar className="size-8">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt={displayName} />
                  ) : null}
                  <AvatarFallback>
                    {displayName.slice(0, 1).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Button size="sm" render={<Link href="/login" />}>
                  登录
                </Button>
              )}
            </div>

            {/* 移动端：汉堡菜单 */}
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger
                aria-label="打开菜单"
                className="inline-flex size-9 items-center justify-center rounded-4xl text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
              >
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>菜单</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-1 px-4 pb-6">
                  {NAV_ITEMS.map((item) => (
                    <SheetClose
                      key={item.href}
                      render={
                        <Link
                          href={item.href}
                          className={cn(
                            "rounded-2xl px-3 py-2 text-sm font-medium transition-colors",
                            isActive(item.href)
                              ? "bg-primary/15 text-primary"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        />
                      }
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </SheetClose>
                  ))}

                  <div className="mt-4 border-t pt-4">
                    {isAuthenticated && user ? (
                      <div className="flex items-center gap-3 rounded-2xl px-3 py-2">
                        <Avatar className="size-9">
                          {avatarUrl ? (
                            <AvatarImage src={avatarUrl} alt={displayName} />
                          ) : null}
                          <AvatarFallback>
                            {displayName.slice(0, 1).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {displayName}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <SheetClose
                        render={<Link href="/login" className="block" />}
                        onClick={() => setMenuOpen(false)}
                      >
                        <Button size="sm" className="w-full">
                          登录
                        </Button>
                      </SheetClose>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </Container>
    </header>
  )
}
