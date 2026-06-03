import { describe, expect, it } from "vitest";
import { getDocumentTemplate } from "@/modules/templates/document-templates";

describe("document templates", () => {
  it("returns the Pitch template", () => {
    const template = getDocumentTemplate("PITCH");

    expect(template.type).toBe("PITCH");
    expect(template.contentMarkdown).toContain("## O Problema");
  });
});
