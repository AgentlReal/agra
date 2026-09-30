import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    reporters: ["verbose"],
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
    // Exclude tests/ directory because tests/ is strictly reserved for the QA team
    exclude: ["node_modules", "dist", ".next", "tests/**"],
    include: ["src/**/*.test.ts", "src/**/*.spec.ts"],
    setupFiles: ["./src/shared/testing/setup.ts"],
  },
});
