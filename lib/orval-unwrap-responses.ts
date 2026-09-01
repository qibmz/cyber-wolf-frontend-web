import { defineTransformer } from "orval"

type JsonSchema = Record<string, unknown>
type OpenApiSpec = {
  paths?: Record<string, unknown>
  components?: { schemas?: Record<string, JsonSchema> }
}

function schemaRefName(ref: string): string {
  return ref.replace("#/components/schemas/", "")
}

function isApiSuccessWrapper(schema: JsonSchema | undefined): boolean {
  if (!schema?.properties || typeof schema.properties !== "object") return false
  const props = schema.properties as Record<string, unknown>
  return "code" in props && "msg" in props && "data" in props
}

function unwrapWrapperSchema(
  schemas: Record<string, JsonSchema>,
  ref: string
): JsonSchema | null {
  const wrapper = schemas[schemaRefName(ref)]
  if (!wrapper || !isApiSuccessWrapper(wrapper)) return null
  const data = (wrapper.properties as Record<string, unknown>).data
  if (!data || typeof data !== "object") return null
  return data as JsonSchema
}

/**
 * 后端成功响应在 OpenAPI 里标注为 ApiSuccess* 包装体，但 axios 拦截器会解包为 data。
 * 生成前把各 operation 的 response schema 换成内层 data，避免业务层到处 as 类型。
 */
export const unwrapApiSuccessResponses = defineTransformer((spec) => {
  const doc = spec as OpenApiSpec
  const schemas = doc.components?.schemas
  if (!schemas) return spec

  for (const pathItem of Object.values(doc.paths ?? {})) {
    if (!pathItem || typeof pathItem !== "object") continue
    for (const operation of Object.values(pathItem)) {
      if (!operation || typeof operation !== "object") continue
      const responses = (operation as { responses?: Record<string, unknown> })
        .responses
      if (!responses) continue

      for (const response of Object.values(responses)) {
        if (!response || typeof response !== "object") continue
        const content = (response as { content?: Record<string, unknown> })
          .content
        const json = content?.["application/json"] as
          { schema?: JsonSchema } | undefined
        const schema = json?.schema
        const ref = schema?.$ref
        if (typeof ref !== "string") continue

        const unwrapped = unwrapWrapperSchema(schemas, ref)
        if (unwrapped) {
          json!.schema = unwrapped
        }
      }
    }
  }

  return spec
})
