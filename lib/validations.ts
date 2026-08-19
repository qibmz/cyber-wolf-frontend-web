import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().min(1, "请输入邮箱").pipe(z.email("请输入有效的邮箱地址")),
  password: z.string().min(6, "密码至少 6 位").max(72, "密码不能超过 72 位"),
})

export type LoginFormValues = z.infer<typeof loginSchema>
