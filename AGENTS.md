<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:api-client-rules -->
# API 客户端：全靠 Orval 生成，禁止手改

- `src/api/endpoints/**` 全部由 Orval 根据后端 OpenAPI（`ORVAL_API_URL` / `pnpm api:generate`）生成。
- **禁止**手动新增、编辑或删除该目录下的接口函数、类型、hooks；改完也会在下次生成时被覆盖（`orval.config.ts` 开启了 `clean: true`）。
- 后端接口变更时：先更新后端 Swagger，再在前端执行 `pnpm api:generate`，然后只改业务代码里的调用方。
- 鉴权、解包、错误处理等横切逻辑放在 `lib/auth.ts`、`lib/api-errors.ts` 等非生成文件中，不要写进 `src/api/endpoints`。
- OpenAPI 成功响应在文档里是 `ApiSuccess*` 包装体；`orval.config.ts` 的 `unwrapApiSuccessResponses` 会在生成前换成内层 `data` 类型，与 axios 拦截器解包行为一致，业务代码直接用 `response.data` 即可。
- OpenAPI tag 的 `name` 须为英文（决定生成文件名）；中文说明走 tag `description`，不要在前端写死 tag 映射。
<!-- END:api-client-rules -->
