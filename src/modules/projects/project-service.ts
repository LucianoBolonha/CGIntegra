import { createId } from "@/lib/ids/create-id";

export interface ProjectRecord {
  id: string;
  name: string;
  description: string;
  ownerUserId: string;
  status: "ACTIVE" | "ARCHIVED";
}

export interface CreateProjectInput {
  actorUserId: string;
  name: string;
  description: string;
  tags: string[];
}

export interface ProjectRepository {
  createProject(input: {
    project: ProjectRecord;
    ownerMembership: {
      id: string;
      projectId: string;
      userId: string;
      roleCode: "OWNER";
    };
    tags: Array<{ id: string; projectId: string; tag: string }>;
  }): Promise<ProjectRecord>;
}

export function createProjectService({ repository }: { repository: ProjectRepository }) {
  return {
    async createProject(input: CreateProjectInput): Promise<ProjectRecord> {
      const project: ProjectRecord = {
        id: createId("proj"),
        name: input.name.trim(),
        description: input.description.trim(),
        ownerUserId: input.actorUserId,
        status: "ACTIVE"
      };

      return repository.createProject({
        project,
        ownerMembership: {
          id: createId("pmem"),
          projectId: project.id,
          userId: input.actorUserId,
          roleCode: "OWNER"
        },
        tags: input.tags.map((tag) => ({
          id: createId("ptag"),
          projectId: project.id,
          tag: tag.trim().toLowerCase()
        }))
      });
    }
  };
}
