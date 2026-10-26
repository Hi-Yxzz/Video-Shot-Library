import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const nextConfig = [...nextVitals, ...nextTs].filter(
  (config) => !config.ignores,
);

const eslintConfig = defineConfig([
  ...nextConfig,
  globalIgnores([
    ".next/**",
    "out/**",
    ".vinext/**",
    "dist/**",
    "node_modules/**",
    "demos/**",
    "references/**",
    "docs/**",
    "examples/**",
    "worker-configuration.d.ts",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
