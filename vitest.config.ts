import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    environment: "node",
    // Two abandoned agent worktrees under .claude/ were being collected, inflating the
    // suite by 66.4% with duplicate runs of a pre-work commit. See docs/mdmax/PLAN.md S0.
    exclude: ["**/node_modules/**", "**/dist/**", "**/.claude/**"],
    setupFiles: ["./test/setup.ts"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
