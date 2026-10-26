import {defineConfig} from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: [
      "src/ai-flavor-validation/**/*.test.ts",
      "src/fidelity-remake/**/*.test.ts",
      "src/dual-remake-406158/**/*.test.ts",
      "scripts/*fidelity*.test.ts",
    ],
  },
});
