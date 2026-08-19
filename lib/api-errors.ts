import type { AxiosError } from "axios"

/**
 * 把 API 错误转换成用户可读的错误消息。
 *
 * 后端已按请求头（x-custom-lang: zh）返回对应语言的文案，
 * 因此这里不做本地映射，优先使用后端返回的 msg：
 *   - { status, msg: "未找到", errors: { email: "notFound" } }
 * 兼容无 msg 只有 errors 字段的结构，取 errors 中第一个值兜底。
 */
export function getApiErrorMessage(err: unknown): string {
  const data = (
    err as AxiosError<{
      msg?: string | string[]
      message?: string | string[]
      errors?: Record<string, string>
    }>
  )?.response?.data

  const msg = data?.msg ?? data?.message
  if (typeof msg === "string" && msg) {
    return msg
  }
  if (Array.isArray(msg) && msg.length > 0 && typeof msg[0] === "string") {
    return msg[0]
  }

  const firstError = data?.errors ? Object.values(data.errors)[0] : undefined
  if (typeof firstError === "string" && firstError) {
    return firstError
  }

  return "请求失败，请稍后重试"
}
