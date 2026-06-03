import type { DatabaseClient } from "@/lib/db/client";
import { auditLogs } from "@/lib/db/schema";
import type { AuditRepository } from "@/modules/audit/audit-service";

export function createDrizzleAuditRepository(db: DatabaseClient): AuditRepository {
  return {
    async record(event) {
      db.insert(auditLogs).values(event).run();
      return event;
    }
  };
}
