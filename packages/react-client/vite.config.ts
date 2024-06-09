// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      rollupTypes: true,
    }),
  ],
  build: {
    outDir: "./dist",
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, "flight.ts"),
      fileName: "flight",
      formats: ["es"],
    },
    minify: false,
  },
});
