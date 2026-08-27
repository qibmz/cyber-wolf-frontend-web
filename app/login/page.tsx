import type { Metadata } from "next"
import Image from "next/image"

import { LoginForm } from "@/components/auth/login-form"
import { WalletLogin } from "@/components/auth/wallet-login"
import { BrandLogo } from "@/components/layout/brand-logo"
import { Separator } from "@/components/ui/separator"

export async function generateMetadata(): Promise<Metadata> {
  return { title: "登录" }
}

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <BrandLogo />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  或
                </span>
              </div>
            </div>
            <WalletLogin />
          </div>
        </div>
      </div>
      <div className="relative hidden items-center justify-center bg-background lg:flex">
        <Image
          src="/images/login/login-illustration.webp"
          alt="登录页配图"
          width={1024}
          height={1280}
          className="h-[80%] w-auto object-cover dark:brightness-[0.55] dark:grayscale"
          priority
        />
      </div>
    </div>
  )
}
