import tailwindcssPostcss from "@tailwindcss/postcss";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const playerRoot = dirname(fileURLToPath(import.meta.url));
const remocnSourceRoot = resolve(playerRoot, "../../library-sources/remocn");

export default defineConfig({
  root: playerRoot,
  base: "/players/remocn/",
  publicDir: resolve(playerRoot, "../../library-sources/remocn/public"),
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcssPostcss({
          base: remocnSourceRoot,
        }),
      ],
    },
  },
  resolve: {
    tsconfigPaths: true,
    dedupe: ["react", "react-dom", "remotion"],
  },
  build: {
    outDir: resolve(playerRoot, "../../public/players/remocn"),
    emptyOutDir: true,
  },
});
