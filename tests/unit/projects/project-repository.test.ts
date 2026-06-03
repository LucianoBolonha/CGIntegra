import { describe, expect, it } from "vitest";
import { getTableName } from "drizzle-orm";
import { createDrizzleProjectRepository } from "@/modules/projects/project-repository";

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

describe("createDrizzleProjectRepository", () => {
  it("creates project, owner membership and tags inside a transaction", async () => {
    const { db, calls } = createInsertRecorder();
    const repository = createDrizzleProjectRepository(db as never);

    await repository.createProject({
      project: {
        id: "proj_1",
        name: "Projeto",
        description: "Descricao",
        ownerUserId: "user_1",
        status: "ACTIVE"
      },
      ownerMembership: {
        id: "pmem_1",
        projectId: "proj_1",
        userId: "user_1",
        roleCode: "OWNER"
      },
      tags: [{ id: "ptag_1", projectId: "proj_1", tag: "mvp" }]
    });

    expect(calls[0]).toBe("transaction");
    expect(calls).toContain("insert:projects");
    expect(calls).toContain("insert:project_members");
    expect(calls).toContain("insert:project_tags");
  });
});
