import { describe, expect, it } from "vitest";
import { getTableName } from "drizzle-orm";
import { createDrizzleDocumentRepository } from "@/modules/documents/document-repository";

function createInsertRecorder() {
  const calls: string[] = [];
  const db = {
    transaction(callback: (tx: unknown) => unknown) {
      calls.push("transaction");
      return callback(db);
    },
    insert(table: Parameters<typeof getTableName>[0]) {
      const tableName = getTableName(table);
      calls.push(`insert:${tableName}`);
      return {
        values() {
          return {
            run() {
              calls.push(`run:${tableName}`);
            }
          };
        }
      };
    }
  };

  return { db, calls };
}

describe("createDrizzleDocumentRepository", () => {
  it("creates document and initial version inside a transaction", async () => {
    const { db, calls } = createInsertRecorder();
    const repository = createDrizzleDocumentRepository(db as never);

    await repository.createDocumentWithVersion({
      document: {
        id: "doc_1",
        projectId: "proj_1",
        type: "PRD",
        title: "PRD",
        currentVersionId: "ver_1",
        status: "DRAFT",
        visibility: "PROJECT",
        createdBy: "user_1"
      },
      version: {
        id: "ver_1",
        documentId: "doc_1",
        versionLabel: "v0.1",
        contentMarkdown: "# PRD",
        renderedHtmlCache: null,
        changeSummary: "Inicial",
        isStable: false,
        createdBy: "user_1"
      }
    });

    expect(calls[0]).toBe("transaction");
    expect(calls).toContain("insert:documents");
    expect(calls).toContain("insert:document_versions");
  });
});
