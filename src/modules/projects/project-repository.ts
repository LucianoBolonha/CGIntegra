import type { DatabaseClient } from "@/lib/db/client";
import { projectMembers, projects, projectTags } from "@/lib/db/schema";
import type { ProjectRecord, ProjectRepository } from "@/modules/projects/project-service";

export function createDrizzleProjectRepository(db: DatabaseClient): ProjectRepository {
  return {
    async createProject(input) {
      db.insert(projects).values(input.project).run();
      db.insert(projectMembers).values(input.ownerMembership).run();

      if (input.tags.length > 0) {
        db.insert(projectTags).values(input.tags).run();
      }

      return input.project satisfies ProjectRecord;
    }
  };
}
