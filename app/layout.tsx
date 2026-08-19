import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { PageTitle } from "@/components/page-title"
import { Providers } from "@/components/providers"
import { cn } from "@/lib/utils"

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Cyber Wolf"
const siteDescription =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION ?? "Cyber Wolf 官方 Web 应用"

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
}

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={cn(
        "dark",
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <Providers>
          <PageTitle />
          {children}
        </Providers>
      </body>
    </html>
  )
}
