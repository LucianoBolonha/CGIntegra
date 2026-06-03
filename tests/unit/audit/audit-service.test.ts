import { describe, expect, it } from "vitest";
import { createAuditService, type AuditRepository } from "@/modules/audit/audit-service";

describe("audit service", () => {
  it("records structured audit events", async () => {
    const events: unknown[] = [];
    const repository: AuditRepository = {
      async record(event) {
        events.push(event);
        return event;
      }
    };

    const service = createAuditService({ repository });
    const event = await service.record({
      actorUserId: "user_1",
      entityType: "document",
      entityId: "doc_1",
      action: "document.created",
      metadata: { source: "template" }
    });

    expect(event.action).toBe("document.created");
    expect(event.metadataJson).toBe("{\"source\":\"template\"}");
    expect(events).toHaveLength(1);
  });
});
