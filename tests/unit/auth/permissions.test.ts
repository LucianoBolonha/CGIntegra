import { describe, expect, it } from "vitest";
import { canCreateProject, canEditProjectDocument } from "@/modules/auth/permissions";

describe("permissions", () => {
  it("allows admins to create projects", () => {
    expect(canCreateProject({ globalRoles: ["ADMIN"] })).toBe(true);
  });

  it("allows product owners to create projects", () => {
    expect(canCreateProject({ globalRoles: ["PRODUCT_OWNER"] })).toBe(true);
  });

  it("denies viewers from editing project documents", () => {
    expect(
      canEditProjectDocument({
        globalRoles: ["VIEWER"],
        projectRole: "VIEWER"
      })
    ).toBe(false);
  });

  it("allows project owners and editors to edit project documents", () => {
    expect(canEditProjectDocument({ globalRoles: [], projectRole: "OWNER" })).toBe(true);
    expect(canEditProjectDocument({ globalRoles: [], projectRole: "EDITOR" })).toBe(true);
  });
});
