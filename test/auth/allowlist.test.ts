import { describe, it, expect } from "vitest";
import { isAllowed } from "@/modules/auth/domain/allowlist";

describe("isAllowed", () => {
  it("allows the configured login case-insensitively", () => {
    expect(isAllowed("sagnikmitra", "sagnikmitra")).toBe(true);
    expect(isAllowed("SagnikMitra", "sagnikmitra")).toBe(true);
  });
  it("rejects others and undefined", () => {
    expect(isAllowed("someone", "sagnikmitra")).toBe(false);
    expect(isAllowed(undefined, "sagnikmitra")).toBe(false);
  });
});
