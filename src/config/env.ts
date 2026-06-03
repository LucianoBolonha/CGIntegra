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
