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
