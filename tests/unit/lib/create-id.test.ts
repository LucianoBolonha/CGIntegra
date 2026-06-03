import { describe, expect, it } from "vitest";
import { createId } from "@/lib/ids/create-id";

describe("createId", () => {
  it("creates prefixed public ids", () => {
    const id = createId("doc");

    expect(id).toMatch(/^doc_[A-Za-z0-9_-]{16}$/);
  });
});
