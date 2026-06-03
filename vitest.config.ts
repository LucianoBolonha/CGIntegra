import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  test: {
    environment: "node",
    env: {
      NODE_ENV: "test",
      DATABASE_URL: "file:./tmp/test.db",
      AUTH_SECRET: "0123456789abcdef0123456789abcdef",
      APP_BASE_URL: "http://localhost:3000",
      ATTACHMENTS_PATH: "./storage/attachments"
    },
    globals: false,
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"]
    }
  }
});
