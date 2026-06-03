import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { env } from "@/config/env";

const sqlite = new Database(env.DATABASE_URL.replace(/^file:/, ""));
const db = drizzle(sqlite);

migrate(db, { migrationsFolder: "drizzle/migrations" });
sqlite.close();
