import { createId } from "@/lib/ids/create-id";

export interface AuditEvent {
  id: string;
  actorUserId: string;
  entityType: string;
  entityId: string;
  action: string;
  metadataJson: string;
}

export interface AuditRepository {
  record(event: AuditEvent): Promise<AuditEvent>;
}

export function createAuditService({ repository }: { repository: AuditRepository }) {
  return {
    async record(input: {
      actorUserId: string;
      entityType: string;
      entityId: string;
      action: string;
      metadata: Record<string, unknown>;
    }) {
      return repository.record({
        id: createId("aud"),
        actorUserId: input.actorUserId,
        entityType: input.entityType,
        entityId: input.entityId,
        action: input.action,
        metadataJson: JSON.stringify(input.metadata)
      });
    }
  };
}
