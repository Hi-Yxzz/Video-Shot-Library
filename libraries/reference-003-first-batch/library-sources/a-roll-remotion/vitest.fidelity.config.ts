import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: [
      "src/fidelity-remake/**/*.test.ts",
      "src/reference-003/**/*.test.ts",
      "scripts/*fidelity*.test.ts",
    ],
  },
});
