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
