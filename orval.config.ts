import "dotenv/config"
import { defineConfig } from "orval"

const apiUrl = process.env.ORVAL_API_URL ?? "http://localhost:3001/docs-json"

export default defineConfig({
  api: {
    input: {
      target: apiUrl,
    },
    output: {
      target: "./src/api/endpoints",
      client: "react-query",
      mode: "tags",
      httpClient: "axios",
    },
  },
})
