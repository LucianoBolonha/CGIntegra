import { describe, expect, it } from "vitest";
import { createApiError } from "@/lib/http/api-error";

describe("createApiError", () => {
  it("creates the RFC error envelope", async () => {
    const response = createApiError({
      code: "VALIDATION_ERROR",
      message: "Invalid payload",
      details: { field: "name" },
      status: 400
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid payload",
        details: { field: "name" }
      }
    });
  });
});
