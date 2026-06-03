import { describe, expect, it } from "vitest";
import { createProjectService, type ProjectRepository } from "@/modules/projects/project-service";

describe("project service", () => {
  it("creates an active project with owner membership", async () => {
    const saved: unknown[] = [];
    const repository: ProjectRepository = {
      async createProject(input) {
        saved.push(input);
        return input.project;
      }
    };

    const service = createProjectService({ repository });
    const project = await service.createProject({
      actorUserId: "user_1",
      name: "CGintegra MVP",
      description: "Projeto piloto",
      tags: ["mvp", "documentos"]
    });

    expect(project.status).toBe("ACTIVE");
    expect(project.name).toBe("CGintegra MVP");
    expect(saved).toHaveLength(1);
  });
});
