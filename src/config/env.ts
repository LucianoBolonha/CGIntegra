import { z } from "zod";

function emptyStringToUndefined(value: unknown) {
  return value === "" ? undefined : value;
}

const optionalString = z.preprocess(emptyStringToUndefined, z.string().optional());
const optionalUrl = z.preprocess(emptyStringToUndefined, z.string().url().optional());
const optionalEmail = z.preprocess(emptyStringToUndefined, z.string().email().optional());
const optionalPositiveInt = z.preprocess(
  emptyStringToUndefined,
  z.coerce.number().int().positive().optional()
);

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1),
  AUTH_SECRET: z.string().min(32),
  APP_BASE_URL: z.string().url(),
  SMTP_HOST: optionalString,
  SMTP_PORT: optionalPositiveInt,
  SMTP_USER: optionalString,
  SMTP_PASS: optionalString,
  SMTP_FROM: optionalEmail,
  LITESTREAM_BUCKET: optionalString,
  LITESTREAM_ACCESS_KEY_ID: optionalString,
  LITESTREAM_SECRET_ACCESS_KEY: optionalString,
  ATTACHMENTS_PATH: z.string().min(1),
  ATTACHMENTS_BACKUP_BUCKET: optionalString,
  WHATSAPP_PROVIDER: optionalString,
  EVOLUTION_API_URL: optionalUrl,
  EVOLUTION_API_TOKEN: optionalString,
  WHATSAPP_CLOUD_ACCESS_TOKEN: optionalString,
  NOMINATIM_BASE_URL: optionalUrl
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
