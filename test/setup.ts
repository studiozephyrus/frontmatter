import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Clean up the DOM after each test (no-op in node env — harmless)
afterEach(() => {
  cleanup();
});
