import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  status: text("status", { enum: ["ACTIVE", "DISABLED"] }).notNull().default("ACTIVE"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull()
});

export const roles = sqliteTable("roles", {
  id: text("id").primaryKey(),
  code: text("code", {
    enum: ["ADMIN", "PRODUCT_OWNER", "REVIEWER", "DEVELOPER", "VIEWER"]
  }).notNull().unique(),
  name: text("name").notNull()
});

export const userRoles = sqliteTable(
  "user_roles",
  {
    userId: text("user_id").notNull().references(() => users.id),
    roleId: text("role_id").notNull().references(() => roles.id)
  },
  (table) => ({
    uniqueUserRole: uniqueIndex("user_roles_user_id_role_id_idx").on(table.userId, table.roleId)
  })
);

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  ownerUserId: text("owner_user_id").notNull().references(() => users.id),
  status: text("status", { enum: ["ACTIVE", "ARCHIVED"] }).notNull().default("ACTIVE"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const projectMembers = sqliteTable(
  "project_members",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id").notNull().references(() => projects.id),
    userId: text("user_id").notNull().references(() => users.id),
    roleCode: text("role_code", { enum: ["OWNER", "EDITOR", "REVIEWER", "VIEWER"] }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`)
  },
  (table) => ({
    uniqueMember: uniqueIndex("project_members_project_id_user_id_idx").on(table.projectId, table.userId)
  })
);

export const projectTags = sqliteTable("project_tags", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull().references(() => projects.id),
  tag: text("tag").notNull()
});

export const documents = sqliteTable("documents", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull().references(() => projects.id),
  type: text("type", { enum: ["PITCH", "PRD", "RFC"] }).notNull(),
  title: text("title").notNull(),
  currentVersionId: text("current_version_id"),
  status: text("status", {
    enum: ["DRAFT", "IN_REVIEW", "APPROVED", "REJECTED", "ARCHIVED"]
  }).notNull().default("DRAFT"),
  visibility: text("visibility", { enum: ["PRIVATE", "PROJECT", "PUBLIC"] }).notNull().default("PROJECT"),
  createdBy: text("created_by").notNull().references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const documentVersions = sqliteTable("document_versions", {
  id: text("id").primaryKey(),
  documentId: text("document_id").notNull().references(() => documents.id),
  versionLabel: text("version_label").notNull(),
  contentMarkdown: text("content_markdown").notNull(),
  renderedHtmlCache: text("rendered_html_cache"),
  changeSummary: text("change_summary").notNull().default(""),
  isStable: integer("is_stable", { mode: "boolean" }).notNull().default(false),
  createdBy: text("created_by").notNull().references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey(),
  actorUserId: text("actor_user_id").notNull().references(() => users.id),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  action: text("action").notNull(),
  metadataJson: text("metadata_json").notNull().default("{}"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const userRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  sessions: many(sessions)
}));
