import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const playerRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: playerRoot,
  base: "/players/remotion-bits/",
  plugins: [react()],
  resolve: {
    alias: {
      "remotion-bits": resolve(
        playerRoot,
        "../../library-sources/remotion-bits/src/index.ts",
      ),
    },
    dedupe: ["react", "react-dom", "remotion"],
  },
  build: {
    outDir: resolve(playerRoot, "../../public/players/remotion-bits"),
    emptyOutDir: true,
  },
});
