import { describe, it, expect } from "vitest";
import { ok, err, isOk, isErr } from "@/shared/domain/result";

describe("Result", () => {
  it("ok wraps a value", () => {
    const r = ok(42);
    expect(isOk(r)).toBe(true);
    if (isOk(r)) expect(r.value).toBe(42);
  });
  it("err wraps an error", () => {
    const r = err("boom");
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBe("boom");
  });
});
