import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    // The CLI spawns real child processes and touches a temporary DSH home in several suites,
    // so tests get room to finish rather than a default that trims the slowest honest ones.
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
});
