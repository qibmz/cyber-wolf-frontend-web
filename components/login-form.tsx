"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Lock, Mail } from "lucide-react"

import { useAuthControllerLoginV1 } from "@/api/endpoints"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { saveAuthTokens } from "@/lib/auth"
import { getApiErrorMessage } from "@/lib/api-errors"
import { cn } from "@/lib/utils"
import { loginSchema } from "@/lib/validations"
import { useAuthStore } from "@/stores/auth-store"

type FieldErrors = { email?: string; password?: string }

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [error, setError] = useState<string | null>(null)

  const login = useAuthControllerLoginV1({
    mutation: {
      onSuccess: (response) => {
        saveAuthTokens(response.data)
        // 用户信息写入全局状态（不落地 localStorage）
        useAuthStore.getState().setUser(response.data.user)
        router.push("/")
      },
      onError: (err) => {
        setError(getApiErrorMessage(err))
      },
    },
  })

  function handleSubmit(formData: FormData) {
    setError(null)

    const parsed = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    })

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      setFieldErrors({
        email: errors.email?.[0],
        password: errors.password?.[0],
      })
      return
    }

    setFieldErrors({})
    login.mutate({ data: parsed.data })
  }

  return (
    <form
      action={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">登录您的账户</h1>
          <p className="text-sm text-balance text-muted-foreground">
            请输入您的邮箱以登录账户
          </p>
        </div>
        <Field data-invalid={!!fieldErrors.email}>
          <FieldLabel htmlFor="email">邮箱</FieldLabel>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="请输入邮箱"
              className="pl-9"
              required
              autoComplete="email"
              aria-invalid={!!fieldErrors.email}
            />
          </div>
          <FieldError>{fieldErrors.email}</FieldError>
        </Field>
        <Field data-invalid={!!fieldErrors.password}>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">密码</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              忘记密码？
            </a>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="请输入密码"
              className="pl-9"
              required
              autoComplete="current-password"
              aria-invalid={!!fieldErrors.password}
            />
          </div>
          <FieldError>{fieldErrors.password}</FieldError>
        </Field>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <Field>
          <Button type="submit" disabled={login.isPending}>
            {login.isPending ? (
              <>
                <Loader2 className="animate-spin" />
                登录中…
              </>
            ) : (
              "登录"
            )}
          </Button>
        </Field>
        <FieldDescription className="text-center">
          还没有账户？{" "}
          <a href="#" className="underline underline-offset-4">
            注册
          </a>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}
