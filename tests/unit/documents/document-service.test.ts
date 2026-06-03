import { describe, expect, it } from "vitest";
import { createDocumentService, type DocumentRepository } from "@/modules/documents/document-service";

describe("document service", () => {
  it("creates a draft document and initial version from a template", async () => {
    const repository: DocumentRepository = {
      async createDocumentWithVersion(input) {
        return {
          document: input.document,
          version: input.version
        };
      }
    };

    const service = createDocumentService({ repository });
    const result = await service.createFromTemplate({
      actorUserId: "user_1",
      projectId: "proj_1",
      type: "PRD",
      title: "PRD piloto"
    });

    expect(result.document.status).toBe("DRAFT");
    expect(result.version.versionLabel).toBe("v0.1");
    expect(result.version.contentMarkdown).toContain("# PRD piloto");
  });
});
