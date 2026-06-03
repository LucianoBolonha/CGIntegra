export type GlobalRole = "ADMIN" | "PRODUCT_OWNER" | "REVIEWER" | "DEVELOPER" | "VIEWER";
export type ProjectRole = "OWNER" | "EDITOR" | "REVIEWER" | "VIEWER";

export interface ActorPermissions {
  globalRoles: GlobalRole[];
  projectRole?: ProjectRole;
}

export function canCreateProject(actor: Pick<ActorPermissions, "globalRoles">): boolean {
  return actor.globalRoles.includes("ADMIN") || actor.globalRoles.includes("PRODUCT_OWNER");
}

export function canEditProjectDocument(actor: ActorPermissions): boolean {
  if (actor.globalRoles.includes("ADMIN")) {
    return true;
  }

  return actor.projectRole === "OWNER" || actor.projectRole === "EDITOR";
}

export function canReviewProjectDocument(actor: ActorPermissions): boolean {
  if (actor.globalRoles.includes("ADMIN") || actor.globalRoles.includes("REVIEWER")) {
    return true;
  }

  return actor.projectRole === "OWNER" || actor.projectRole === "REVIEWER";
}
