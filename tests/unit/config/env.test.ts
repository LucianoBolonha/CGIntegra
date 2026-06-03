import { describe, expect, it } from "vitest";
import { loadEnv } from "@/config/env";

describe("loadEnv", () => {
  it("loads required MVP environment values", () => {
    const env = loadEnv({
      NODE_ENV: "test",
      DATABASE_URL: "file:./tmp/test.db",
      AUTH_SECRET: "0123456789abcdef0123456789abcdef",
      APP_BASE_URL: "http://localhost:3000",
      ATTACHMENTS_PATH: "./storage/attachments"
    });

    expect(env.DATABASE_URL).toBe("file:./tmp/test.db");
    expect(env.NODE_ENV).toBe("test");
  });

  it("rejects a short auth secret", () => {
    expect(() =>
      loadEnv({
        NODE_ENV: "test",
        DATABASE_URL: "file:./tmp/test.db",
        AUTH_SECRET: "short",
        APP_BASE_URL: "http://localhost:3000",
        ATTACHMENTS_PATH: "./storage/attachments"
      })
    ).toThrow("Invalid environment configuration");
  });
});
