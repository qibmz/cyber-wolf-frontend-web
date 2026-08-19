import type { Metadata } from "next"
import Image from "next/image"

import { BrandLogo } from "@/components/brand-logo"
import { LoginForm } from "@/components/login-form"

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
