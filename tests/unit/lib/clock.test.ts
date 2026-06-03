import { describe, expect, it } from "vitest";
import { systemClock } from "@/lib/time/clock";

describe("systemClock", () => {
  it("returns Date instances", () => {
    expect(systemClock.now()).toBeInstanceOf(Date);
  });
});
