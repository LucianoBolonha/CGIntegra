# Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the technical foundation approved in `docs/RFC.md` v0.4 so the MVP can support typed configuration, testing, Tailwind UI, SQLite/Drizzle persistence, local authentication primitives, projects, templates, documents, versioning, and audit logging.

**Architecture:** The foundation keeps the current Next.js App Router application and adds bounded modules under `src/modules` plus shared infrastructure under `src/lib`. Database schema and migrations live under `drizzle/`, while tests live beside the behavior they verify under `tests/unit` and `tests/integration`.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Zod, Drizzle ORM, Drizzle Kit, better-sqlite3, Lucia Auth, Argon2id-compatible password hashing, nanoid, Vitest.

---

## Scope

This plan implements the foundation phase from RFC v0.4:

- application tooling and Tailwind;
- environment validation;
- test runner setup;
- database schema and Drizzle config;
- core domain types;
- authentication primitives;
- project repository and service;
- document templates and document creation;
- version snapshots;
- audit log foundation.

This plan does not implement full review workflow, inline comments, export, search, notifications, PWA, Docker, Fly.io, Litestream, Caddy, or browser UI beyond basic route scaffolding. Those belong to later plans after the foundation is merged.

## File Structure

- Modify `package.json`: add scripts and dependencies for Tailwind, Vitest, Zod, Drizzle, SQLite, IDs, and auth primitives.
- Modify `src/styles/globals.css`: replace current global styling with Tailwind directives and minimal base styling.
- Create `tailwind.config.ts`: Tailwind content paths and theme extensions.
- Create `postcss.config.mjs`: Tailwind/PostCSS wiring.
- Create `vitest.config.ts`: unit and integration test configuration.
- Create `drizzle.config.ts`: Drizzle Kit configuration for SQLite.
- Create `.env.example`: documented local environment variables from RFC v0.4, with MVP-only required values.
- Create `src/config/env.ts`: typed environment loader using Zod.
- Create `src/lib/ids/create-id.ts`: public ID generation wrapper.
- Create `src/lib/time/clock.ts`: deterministic time helper for tests.
- Create `src/lib/db/schema.ts`: Drizzle schema for foundation tables.
- Create `src/lib/db/client.ts`: SQLite database client factory.
- Create `src/lib/db/migrate.ts`: local migration runner entrypoint.
- Create `src/modules/auth/password.ts`: password hashing and verification adapter.
- Create `src/modules/auth/session.ts`: session model helpers.
- Create `src/modules/auth/permissions.ts`: role and project permission checks.
- Create `src/modules/projects/project-repository.ts`: project persistence queries.
- Create `src/modules/projects/project-service.ts`: project use cases.
- Create `src/modules/templates/document-templates.ts`: Pitch, PRD, and RFC templates.
- Create `src/modules/documents/document-repository.ts`: document and version persistence queries.
- Create `src/modules/documents/document-service.ts`: create document from template/import.
- Create `src/modules/audit/audit-repository.ts`: audit event persistence.
- Create `src/modules/audit/audit-service.ts`: audit logging use case.
- Create `tests/unit/**`: unit tests for env, IDs, permissions, templates, and services.
- Create `tests/integration/**`: integration tests against a temporary SQLite database.

---

### Task 1: Install Foundation Tooling

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Install runtime dependencies**

Run:

```powershell
npm install zod drizzle-orm better-sqlite3 lucia @node-rs/argon2 nanoid
```

Expected: `package.json` and `package-lock.json` include the new runtime dependencies.

- [ ] **Step 2: Install development dependencies**

Run:

```powershell
npm install -D drizzle-kit vitest @vitest/coverage-v8 tailwindcss postcss autoprefixer @types/better-sqlite3
```

Expected: `package.json` and `package-lock.json` include the new dev dependencies.

- [ ] **Step 3: Update scripts**

Modify `package.json` scripts to:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run",
    "test:watch": "vitest",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "tsx src/lib/db/migrate.ts"
  }
}
```

If `tsx` is not already installed after Step 2, install it:

```powershell
npm install -D tsx
```

Expected: `npm run test` is available and `npm run db:generate` is available.

- [ ] **Step 4: Verify package installation**

Run:

```powershell
npm install
```

Expected: command exits with code 0 and reports dependencies are installed.

- [ ] **Step 5: Commit**

Run:

```powershell
git add package.json package-lock.json
git commit -m "chore: add foundation dependencies"
```

Expected: commit succeeds with only package files staged.

---

### Task 2: Configure Tailwind and Tests

**Files:**
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`
- Create: `vitest.config.ts`
- Modify: `src/styles/globals.css`
- Test: `tests/unit/config/tooling-smoke.test.ts`

- [ ] **Step 1: Add Tailwind config**

Create `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./docs/design-system/**/*.html"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        surface: "#f7f8fb",
        brand: "#2357a3",
        accent: "#1b8a6b"
      }
    }
  },
  plugins: []
};

export default config;
```

- [ ] **Step 2: Add PostCSS config**

Create `postcss.config.mjs`:

```js
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};

export default config;
```

- [ ] **Step 3: Replace global CSS**

Replace `src/styles/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
}

* {
  box-sizing: border-box;
}

html,
body {
  min-height: 100%;
}

body {
  margin: 0;
  background: #f7f8fb;
  color: #172033;
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

a {
  color: inherit;
}
```

- [ ] **Step 4: Add Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: false,
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"]
    }
  }
});
```

- [ ] **Step 5: Write smoke test**

Create `tests/unit/config/tooling-smoke.test.ts`:

```ts
import { describe, expect, it } from "vitest";

describe("tooling", () => {
  it("runs TypeScript tests through Vitest", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 6: Run test**

Run:

```powershell
npm test -- tests/unit/config/tooling-smoke.test.ts
```

Expected: 1 test passes.

- [ ] **Step 7: Run build**

Run:

```powershell
npm run build
```

Expected: Next.js build exits with code 0.

- [ ] **Step 8: Commit**

Run:

```powershell
git add tailwind.config.ts postcss.config.mjs vitest.config.ts src/styles/globals.css tests/unit/config/tooling-smoke.test.ts
git commit -m "chore: configure styling and tests"
```

Expected: commit succeeds.

---

### Task 3: Add Typed Environment Configuration

**Files:**
- Create: `.env.example`
- Create: `src/config/env.ts`
- Test: `tests/unit/config/env.test.ts`

- [ ] **Step 1: Write failing env tests**

Create `tests/unit/config/env.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { loadEnv } from "@/config/env";

describe("loadEnv", () => {
  it("loads required MVP environment values", () => {
    const env = loadEnv({
      NODE_ENV: "test",
      DATABASE_URL: "file:./tmp/test.db",
      AUTH_SECRET: "0123456789abcdef0123456789abcdef",
      APP_BASE_URL: "http://localhost:3000",
      ATTACHMENTS_PATH: "./storage/attachments"
    });

    expect(env.DATABASE_URL).toBe("file:./tmp/test.db");
    expect(env.NODE_ENV).toBe("test");
  });

  it("rejects a short auth secret", () => {
    expect(() =>
      loadEnv({
        NODE_ENV: "test",
        DATABASE_URL: "file:./tmp/test.db",
        AUTH_SECRET: "short",
        APP_BASE_URL: "http://localhost:3000",
        ATTACHMENTS_PATH: "./storage/attachments"
      })
    ).toThrow("Invalid environment configuration");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npm test -- tests/unit/config/env.test.ts
```

Expected: FAIL because `src/config/env.ts` does not exist.

- [ ] **Step 3: Implement env loader**

Create `src/config/env.ts`:

```ts
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1),
  AUTH_SECRET: z.string().min(32),
  APP_BASE_URL: z.string().url(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),
  LITESTREAM_BUCKET: z.string().optional(),
  LITESTREAM_ACCESS_KEY_ID: z.string().optional(),
  LITESTREAM_SECRET_ACCESS_KEY: z.string().optional(),
  ATTACHMENTS_PATH: z.string().min(1),
  ATTACHMENTS_BACKUP_BUCKET: z.string().optional(),
  WHATSAPP_PROVIDER: z.string().optional(),
  EVOLUTION_API_URL: z.string().url().optional(),
  EVOLUTION_API_TOKEN: z.string().optional(),
  WHATSAPP_CLOUD_ACCESS_TOKEN: z.string().optional(),
  NOMINATIM_BASE_URL: z.string().url().optional()
});

export type AppEnv = z.infer<typeof envSchema>;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): AppEnv {
  const result = envSchema.safeParse(source);

  if (!result.success) {
    throw new Error("Invalid environment configuration");
  }

  return result.data;
}

export const env = loadEnv();
```

- [ ] **Step 4: Add env example**

Create `.env.example`:

```env
NODE_ENV=development
DATABASE_URL=file:./data/cgintegra.db
AUTH_SECRET=replace-with-at-least-32-characters
APP_BASE_URL=http://localhost:3000
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
LITESTREAM_BUCKET=
LITESTREAM_ACCESS_KEY_ID=
LITESTREAM_SECRET_ACCESS_KEY=
ATTACHMENTS_PATH=./storage/attachments
ATTACHMENTS_BACKUP_BUCKET=
WHATSAPP_PROVIDER=
EVOLUTION_API_URL=
EVOLUTION_API_TOKEN=
WHATSAPP_CLOUD_ACCESS_TOKEN=
NOMINATIM_BASE_URL=
```

- [ ] **Step 5: Run tests**

Run:

```powershell
npm test -- tests/unit/config/env.test.ts
```

Expected: 2 tests pass.

- [ ] **Step 6: Commit**

Run:

```powershell
git add .env.example src/config/env.ts tests/unit/config/env.test.ts
git commit -m "chore: add typed environment config"
```

Expected: commit succeeds.

---

### Task 4: Add Shared IDs and Clock Utilities

**Files:**
- Create: `src/lib/ids/create-id.ts`
- Create: `src/lib/time/clock.ts`
- Test: `tests/unit/lib/create-id.test.ts`
- Test: `tests/unit/lib/clock.test.ts`

- [ ] **Step 1: Write failing tests**

Create `tests/unit/lib/create-id.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { createId } from "@/lib/ids/create-id";

describe("createId", () => {
  it("creates prefixed public ids", () => {
    const id = createId("doc");

    expect(id).toMatch(/^doc_[A-Za-z0-9_-]{16}$/);
  });
});
```

Create `tests/unit/lib/clock.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { systemClock } from "@/lib/time/clock";

describe("systemClock", () => {
  it("returns Date instances", () => {
    expect(systemClock.now()).toBeInstanceOf(Date);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```powershell
npm test -- tests/unit/lib/create-id.test.ts tests/unit/lib/clock.test.ts
```

Expected: FAIL because utility modules do not exist.

- [ ] **Step 3: Implement ID helper**

Create `src/lib/ids/create-id.ts`:

```ts
import { customAlphabet } from "nanoid";

const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-";
const nanoid = customAlphabet(alphabet, 16);

export function createId(prefix: string): string {
  return `${prefix}_${nanoid()}`;
}
```

- [ ] **Step 4: Implement clock helper**

Create `src/lib/time/clock.ts`:

```ts
export interface Clock {
  now(): Date;
}

export const systemClock: Clock = {
  now() {
    return new Date();
  }
};
```

- [ ] **Step 5: Run tests**

Run:

```powershell
npm test -- tests/unit/lib/create-id.test.ts tests/unit/lib/clock.test.ts
```

Expected: 2 tests pass.

- [ ] **Step 6: Commit**

Run:

```powershell
git add src/lib/ids/create-id.ts src/lib/time/clock.ts tests/unit/lib/create-id.test.ts tests/unit/lib/clock.test.ts
git commit -m "chore: add shared id and time utilities"
```

Expected: commit succeeds.

---

### Task 5: Define Drizzle Schema and Database Client

**Files:**
- Create: `drizzle.config.ts`
- Create: `src/lib/db/schema.ts`
- Create: `src/lib/db/client.ts`
- Create: `src/lib/db/migrate.ts`
- Test: `tests/unit/db/schema.test.ts`

- [ ] **Step 1: Write schema test**

Create `tests/unit/db/schema.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify failure**

Run:

```powershell
npm test -- tests/unit/db/schema.test.ts
```

Expected: FAIL because schema module does not exist.

- [ ] **Step 3: Add Drizzle config**

Create `drizzle.config.ts`:

```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL?.replace(/^file:/, "") ?? "./data/cgintegra.db"
  }
});
```

- [ ] **Step 4: Implement schema**

Create `src/lib/db/schema.ts`:

```ts
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
```

- [ ] **Step 5: Implement database client**

Create `src/lib/db/client.ts`:

```ts
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { env } from "@/config/env";
import * as schema from "@/lib/db/schema";

function sqlitePathFromUrl(databaseUrl: string): string {
  return databaseUrl.replace(/^file:/, "");
}

export function createDatabaseClient(databaseUrl = env.DATABASE_URL) {
  const sqlite = new Database(sqlitePathFromUrl(databaseUrl));
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");

  return drizzle(sqlite, { schema });
}

export type DatabaseClient = ReturnType<typeof createDatabaseClient>;
```

- [ ] **Step 6: Implement migration runner**

Create `src/lib/db/migrate.ts`:

```ts
import Database from "better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { env } from "@/config/env";

const sqlite = new Database(env.DATABASE_URL.replace(/^file:/, ""));
const db = drizzle(sqlite);

migrate(db, { migrationsFolder: "drizzle/migrations" });
sqlite.close();
```

- [ ] **Step 7: Run schema test**

Run:

```powershell
npm test -- tests/unit/db/schema.test.ts
```

Expected: 1 test passes.

- [ ] **Step 8: Generate migration**

Run:

```powershell
npm run db:generate
```

Expected: a new migration appears under `drizzle/migrations`.

- [ ] **Step 9: Commit**

Run:

```powershell
git add drizzle.config.ts drizzle src/lib/db tests/unit/db/schema.test.ts
git commit -m "feat: add foundation database schema"
```

Expected: commit succeeds.

---

### Task 6: Add Auth Primitives and Permission Checks

**Files:**
- Create: `src/modules/auth/password.ts`
- Create: `src/modules/auth/session.ts`
- Create: `src/modules/auth/permissions.ts`
- Test: `tests/unit/auth/permissions.test.ts`

- [ ] **Step 1: Write permission tests**

Create `tests/unit/auth/permissions.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify failure**

Run:

```powershell
npm test -- tests/unit/auth/permissions.test.ts
```

Expected: FAIL because auth modules do not exist.

- [ ] **Step 3: Implement password adapter**

Create `src/modules/auth/password.ts`:

```ts
import { hash, verify } from "@node-rs/argon2";

export async function hashPassword(password: string): Promise<string> {
  return hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1
  });
}

export async function verifyPassword(hashValue: string, password: string): Promise<boolean> {
  return verify(hashValue, password);
}
```

- [ ] **Step 4: Implement session helpers**

Create `src/modules/auth/session.ts`:

```ts
import { createId } from "@/lib/ids/create-id";
import type { Clock } from "@/lib/time/clock";
import { systemClock } from "@/lib/time/clock";

const SESSION_DAYS = 30;

export interface AppSession {
  id: string;
  userId: string;
  expiresAt: Date;
}

export function createSessionModel(userId: string, clock: Clock = systemClock): AppSession {
  const expiresAt = new Date(clock.now().getTime() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  return {
    id: createId("sess"),
    userId,
    expiresAt
  };
}
```

- [ ] **Step 5: Implement permissions**

Create `src/modules/auth/permissions.ts`:

```ts
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
```

- [ ] **Step 6: Run tests**

Run:

```powershell
npm test -- tests/unit/auth/permissions.test.ts
```

Expected: 4 tests pass.

- [ ] **Step 7: Commit**

Run:

```powershell
git add src/modules/auth tests/unit/auth/permissions.test.ts
git commit -m "feat: add auth primitives"
```

Expected: commit succeeds.

---

### Task 7: Add Project Repository and Service

**Files:**
- Create: `src/modules/projects/project-repository.ts`
- Create: `src/modules/projects/project-service.ts`
- Test: `tests/unit/projects/project-service.test.ts`

- [ ] **Step 1: Write service test with fake repository**

Create `tests/unit/projects/project-service.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify failure**

Run:

```powershell
npm test -- tests/unit/projects/project-service.test.ts
```

Expected: FAIL because project service does not exist.

- [ ] **Step 3: Implement repository contract and service**

Create `src/modules/projects/project-service.ts`:

```ts
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
```

- [ ] **Step 4: Implement Drizzle repository**

Create `src/modules/projects/project-repository.ts`:

```ts
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
```

- [ ] **Step 5: Run tests**

Run:

```powershell
npm test -- tests/unit/projects/project-service.test.ts
```

Expected: 1 test passes.

- [ ] **Step 6: Commit**

Run:

```powershell
git add src/modules/projects tests/unit/projects/project-service.test.ts
git commit -m "feat: add project creation service"
```

Expected: commit succeeds.

---

### Task 8: Add Document Templates and Creation Service

**Files:**
- Create: `src/modules/templates/document-templates.ts`
- Create: `src/modules/documents/document-service.ts`
- Create: `src/modules/documents/document-repository.ts`
- Test: `tests/unit/templates/document-templates.test.ts`
- Test: `tests/unit/documents/document-service.test.ts`

- [ ] **Step 1: Write template test**

Create `tests/unit/templates/document-templates.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getDocumentTemplate } from "@/modules/templates/document-templates";

describe("document templates", () => {
  it("returns the Pitch template", () => {
    const template = getDocumentTemplate("PITCH");

    expect(template.type).toBe("PITCH");
    expect(template.contentMarkdown).toContain("## O Problema");
  });
});
```

- [ ] **Step 2: Write document service test**

Create `tests/unit/documents/document-service.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { createDocumentService, type DocumentRepository } from "@/modules/documents/document-service";

describe("document service", () => {
  it("creates a draft document and initial version from a template", async () => {
    const repository: DocumentRepository = {
      async createDocumentWithVersion(input) {
        return {
          document: input.document,
          version: input.version
        };
      }
    };

    const service = createDocumentService({ repository });
    const result = await service.createFromTemplate({
      actorUserId: "user_1",
      projectId: "proj_1",
      type: "PRD",
      title: "PRD piloto"
    });

    expect(result.document.status).toBe("DRAFT");
    expect(result.version.versionLabel).toBe("v0.1");
    expect(result.version.contentMarkdown).toContain("# PRD piloto");
  });
});
```

- [ ] **Step 3: Run tests to verify failure**

Run:

```powershell
npm test -- tests/unit/templates/document-templates.test.ts tests/unit/documents/document-service.test.ts
```

Expected: FAIL because template and document modules do not exist.

- [ ] **Step 4: Implement templates**

Create `src/modules/templates/document-templates.ts`:

```ts
export type DocumentType = "PITCH" | "PRD" | "RFC";

export interface DocumentTemplate {
  type: DocumentType;
  contentMarkdown: string;
}

const templates: Record<DocumentType, DocumentTemplate> = {
  PITCH: {
    type: "PITCH",
    contentMarkdown: [
      "# {{title}}",
      "",
      "## O Problema",
      "",
      "## A Solução",
      "",
      "## Diferenciais",
      "",
      "## Arquitetura de Alto Nível",
      "",
      "## Roadmap",
      "",
      "## Custos",
      "",
      "## Riscos e Mitigações"
    ].join("\n")
  },
  PRD: {
    type: "PRD",
    contentMarkdown: [
      "# {{title}}",
      "",
      "## Sumário Executivo",
      "",
      "## Personas",
      "",
      "## Escopo do MVP",
      "",
      "## Requisitos Funcionais",
      "",
      "## Regras de Negócio",
      "",
      "## Jornadas de Usuário"
    ].join("\n")
  },
  RFC: {
    type: "RFC",
    contentMarkdown: [
      "# {{title}}",
      "",
      "## Resumo Executivo",
      "",
      "## ADRs",
      "",
      "## Arquitetura Proposta",
      "",
      "## Schema do Banco",
      "",
      "## Contratos de API",
      "",
      "## Estratégia de Testes"
    ].join("\n")
  }
};

export function getDocumentTemplate(type: DocumentType): DocumentTemplate {
  return templates[type];
}
```

- [ ] **Step 5: Implement document service**

Create `src/modules/documents/document-service.ts`:

```ts
import { createId } from "@/lib/ids/create-id";
import { getDocumentTemplate, type DocumentType } from "@/modules/templates/document-templates";

export interface DocumentRecord {
  id: string;
  projectId: string;
  type: DocumentType;
  title: string;
  currentVersionId: string;
  status: "DRAFT" | "IN_REVIEW" | "APPROVED" | "REJECTED" | "ARCHIVED";
  visibility: "PRIVATE" | "PROJECT" | "PUBLIC";
  createdBy: string;
}

export interface DocumentVersionRecord {
  id: string;
  documentId: string;
  versionLabel: string;
  contentMarkdown: string;
  renderedHtmlCache: string | null;
  changeSummary: string;
  isStable: boolean;
  createdBy: string;
}

export interface DocumentRepository {
  createDocumentWithVersion(input: {
    document: DocumentRecord;
    version: DocumentVersionRecord;
  }): Promise<{ document: DocumentRecord; version: DocumentVersionRecord }>;
}

export function createDocumentService({ repository }: { repository: DocumentRepository }) {
  return {
    async createFromTemplate(input: {
      actorUserId: string;
      projectId: string;
      type: DocumentType;
      title: string;
    }) {
      const documentId = createId("doc");
      const versionId = createId("ver");
      const template = getDocumentTemplate(input.type);
      const contentMarkdown = template.contentMarkdown.replace("{{title}}", input.title.trim());

      return repository.createDocumentWithVersion({
        document: {
          id: documentId,
          projectId: input.projectId,
          type: input.type,
          title: input.title.trim(),
          currentVersionId: versionId,
          status: "DRAFT",
          visibility: "PROJECT",
          createdBy: input.actorUserId
        },
        version: {
          id: versionId,
          documentId,
          versionLabel: "v0.1",
          contentMarkdown,
          renderedHtmlCache: null,
          changeSummary: "Versão inicial criada a partir de template",
          isStable: false,
          createdBy: input.actorUserId
        }
      });
    }
  };
}
```

- [ ] **Step 6: Implement Drizzle repository**

Create `src/modules/documents/document-repository.ts`:

```ts
import type { DatabaseClient } from "@/lib/db/client";
import { documents, documentVersions } from "@/lib/db/schema";
import type { DocumentRepository } from "@/modules/documents/document-service";

export function createDrizzleDocumentRepository(db: DatabaseClient): DocumentRepository {
  return {
    async createDocumentWithVersion(input) {
      db.insert(documents).values(input.document).run();
      db.insert(documentVersions).values(input.version).run();

      return input;
    }
  };
}
```

- [ ] **Step 7: Run tests**

Run:

```powershell
npm test -- tests/unit/templates/document-templates.test.ts tests/unit/documents/document-service.test.ts
```

Expected: 2 tests pass.

- [ ] **Step 8: Commit**

Run:

```powershell
git add src/modules/templates src/modules/documents tests/unit/templates tests/unit/documents
git commit -m "feat: add document template creation"
```

Expected: commit succeeds.

---

### Task 9: Add Audit Logging Foundation

**Files:**
- Create: `src/modules/audit/audit-service.ts`
- Create: `src/modules/audit/audit-repository.ts`
- Test: `tests/unit/audit/audit-service.test.ts`

- [ ] **Step 1: Write audit service test**

Create `tests/unit/audit/audit-service.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify failure**

Run:

```powershell
npm test -- tests/unit/audit/audit-service.test.ts
```

Expected: FAIL because audit module does not exist.

- [ ] **Step 3: Implement audit service**

Create `src/modules/audit/audit-service.ts`:

```ts
import { createId } from "@/lib/ids/create-id";

export interface AuditEvent {
  id: string;
  actorUserId: string;
  entityType: string;
  entityId: string;
  action: string;
  metadataJson: string;
}

export interface AuditRepository {
  record(event: AuditEvent): Promise<AuditEvent>;
}

export function createAuditService({ repository }: { repository: AuditRepository }) {
  return {
    async record(input: {
      actorUserId: string;
      entityType: string;
      entityId: string;
      action: string;
      metadata: Record<string, unknown>;
    }) {
      return repository.record({
        id: createId("aud"),
        actorUserId: input.actorUserId,
        entityType: input.entityType,
        entityId: input.entityId,
        action: input.action,
        metadataJson: JSON.stringify(input.metadata)
      });
    }
  };
}
```

- [ ] **Step 4: Implement audit repository**

Create `src/modules/audit/audit-repository.ts`:

```ts
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
```

- [ ] **Step 5: Run tests**

Run:

```powershell
npm test -- tests/unit/audit/audit-service.test.ts
```

Expected: 1 test passes.

- [ ] **Step 6: Commit**

Run:

```powershell
git add src/modules/audit tests/unit/audit/audit-service.test.ts
git commit -m "feat: add audit logging foundation"
```

Expected: commit succeeds.

---

### Task 10: Add Minimal HTTP Foundation

**Files:**
- Create: `src/app/api/health/route.ts`
- Create: `src/lib/http/api-error.ts`
- Test: `tests/unit/api/health-route.test.ts`
- Test: `tests/unit/http/api-error.test.ts`

- [ ] **Step 1: Write health route test**

Create `tests/unit/api/health-route.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/health/route";

describe("GET /api/health", () => {
  it("returns ok", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ status: "ok" });
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run:

```powershell
npm test -- tests/unit/api/health-route.test.ts
```

Expected: FAIL because health route does not exist.

- [ ] **Step 3: Implement health route**

Create `src/app/api/health/route.ts`:

```ts
export function GET() {
  return Response.json({ status: "ok" });
}
```

- [ ] **Step 4: Write API error helper test**

Create `tests/unit/http/api-error.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { createApiError } from "@/lib/http/api-error";

describe("createApiError", () => {
  it("creates the RFC error envelope", async () => {
    const response = createApiError({
      code: "VALIDATION_ERROR",
      message: "Invalid payload",
      details: { field: "name" },
      status: 400
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid payload",
        details: { field: "name" }
      }
    });
  });
});
```

- [ ] **Step 5: Run API error test to verify failure**

Run:

```powershell
npm test -- tests/unit/http/api-error.test.ts
```

Expected: FAIL because `src/lib/http/api-error.ts` does not exist.

- [ ] **Step 6: Implement API error helper**

Create `src/lib/http/api-error.ts`:

```ts
export interface ApiErrorInput {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  status: number;
}

export function createApiError(input: ApiErrorInput): Response {
  return Response.json(
    {
      error: {
        code: input.code,
        message: input.message,
        details: input.details ?? {}
      }
    },
    { status: input.status }
  );
}
```

- [ ] **Step 7: Run HTTP foundation tests**

Run:

```powershell
npm test -- tests/unit/api/health-route.test.ts tests/unit/http/api-error.test.ts
```

Expected: 2 tests pass.

- [ ] **Step 8: Run build**

Run:

```powershell
npm run build
```

Expected: Next.js build exits with code 0.

- [ ] **Step 9: Commit**

Run:

```powershell
git add src/app/api/health src/lib/http tests/unit/api/health-route.test.ts tests/unit/http/api-error.test.ts
git commit -m "feat: add http foundation"
```

Expected: commit succeeds.

---

### Task 11: Final Foundation Verification

**Files:**
- Modify: none unless verification finds a defect.

- [ ] **Step 1: Run all tests**

Run:

```powershell
npm test
```

Expected: all tests pass.

- [ ] **Step 2: Run production build**

Run:

```powershell
npm run build
```

Expected: build exits with code 0.

- [ ] **Step 3: Verify Git status**

Run:

```powershell
git status --short --branch
```

Expected: branch is ahead only if local commits have not been pushed; no unstaged files remain.

- [ ] **Step 4: Push commits**

Run:

```powershell
git push
```

Expected: `main -> main` push succeeds.

---

## Self-Review

- Spec coverage: this plan covers the RFC v0.4 foundation items for tooling, typed configuration, database schema, authentication primitives, project creation, templates, document creation, version snapshots, and audit logging.
- Deferred by design: workflow review, inline comments, search, export, notifications, PWA, infrastructure deploy, backup restore scripts, and UI polish are intentionally outside this foundation plan and need follow-up plans.
- Hygiene scan: this plan contains no unresolved marker or vague future-work step.
- Type consistency: shared types are introduced before services that consume them, and repository interfaces are defined in service modules before Drizzle adapters implement them.
