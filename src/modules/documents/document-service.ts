import { createId } from "@/lib/ids/create-id";
import { getDocumentTemplate, type DocumentType } from "@/modules/templates/document-templates";

export interface DocumentRecord {
  id: string;
  projectId: string;
  type: DocumentType;
  title: string;
  currentVersionId: string;
  status: "DRAFT" | "IN_REVIEW" | "APPROVED" | "REJECTED" | "ARCHIVED";
  visibility: "PRIVATE" | "PROJECT" | "PUBLIC";
  createdBy: string;
}

export interface DocumentVersionRecord {
  id: string;
  documentId: string;
  versionLabel: string;
  contentMarkdown: string;
  renderedHtmlCache: string | null;
  changeSummary: string;
  isStable: boolean;
  createdBy: string;
}

export interface DocumentRepository {
  createDocumentWithVersion(input: {
    document: DocumentRecord;
    version: DocumentVersionRecord;
  }): Promise<{ document: DocumentRecord; version: DocumentVersionRecord }>;
}

export function createDocumentService({ repository }: { repository: DocumentRepository }) {
  return {
    async createFromTemplate(input: {
      actorUserId: string;
      projectId: string;
      type: DocumentType;
      title: string;
    }) {
      const documentId = createId("doc");
      const versionId = createId("ver");
      const template = getDocumentTemplate(input.type);
      const contentMarkdown = template.contentMarkdown.replace("{{title}}", input.title.trim());

      return repository.createDocumentWithVersion({
        document: {
          id: documentId,
          projectId: input.projectId,
          type: input.type,
          title: input.title.trim(),
          currentVersionId: versionId,
          status: "DRAFT",
          visibility: "PROJECT",
          createdBy: input.actorUserId
        },
        version: {
          id: versionId,
          documentId,
          versionLabel: "v0.1",
          contentMarkdown,
          renderedHtmlCache: null,
          changeSummary: "Versão inicial criada a partir de template",
          isStable: false,
          createdBy: input.actorUserId
        }
      });
    }
  };
}
