import type { DatabaseClient } from "@/lib/db/client";
import { documents, documentVersions } from "@/lib/db/schema";
import type { DocumentRepository } from "@/modules/documents/document-service";

export function createDrizzleDocumentRepository(db: DatabaseClient): DocumentRepository {
  return {
    async createDocumentWithVersion(input) {
      db.insert(documents).values(input.document).run();
      db.insert(documentVersions).values(input.version).run();

      return input;
    }
  };
}
