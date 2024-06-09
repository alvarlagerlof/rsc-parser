// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      entryRoot: "./src",
      exclude: ["**/*.stories.tsx", "**/example-data/**"],
      rollupTypes: true,
    }),
  ],
  build: {
    outDir: "./dist",
    emptyOutDir: false,
    lib: {
      entry: {
        main: resolve(__dirname, "src/main.ts"),
        fetchPatcher: resolve(__dirname, "src/fetchPatcher.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["react", "react-dom"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: "React",
        },
      },
    },
    minify: false,
  },
});
