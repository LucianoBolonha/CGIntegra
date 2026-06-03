import { describe, expect, it } from "vitest";
import {
  auditLogs,
  documentVersions,
  documents,
  projectMembers,
  projects,
  users
} from "@/lib/db/schema";

describe("database schema", () => {
  it("exports foundation tables", () => {
    expect(users).toBeDefined();
    expect(projects).toBeDefined();
    expect(projectMembers).toBeDefined();
    expect(documents).toBeDefined();
    expect(documentVersions).toBeDefined();
    expect(auditLogs).toBeDefined();
  });
});
