import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import htmlPlugin, { Options, ScriptTag } from "vite-plugin-html-config";
import { resolve } from "path";

const dev = {
  headScripts: [
    {
      src: "http://localhost:6020/src/react-preamble.ts",
      type: "module",
    } as ScriptTag,
    {
      src: "http://localhost:6020/@vite/client",
      type: "module",
    } as ScriptTag,
    {
      src: "http://localhost:6020/src/main.tsx",
      type: "module",
    } as ScriptTag,
  ],
} satisfies Options;

const build = {
  headScripts: [
    {
      async: false,
      src: "./src/main.tsx",
      type: "module",
    } as ScriptTag,
  ],
} satisfies Options;

export default defineConfig(({ mode }) => {
  if (mode === "development") {
    return {
      plugins: [react(), htmlPlugin(dev)],
      base: "",
      build: {
        outDir: "./dist",
        minify: false,
        rollupOptions: {
          input: {
            main: resolve(__dirname, "index.html"),
            "fetch-patch": resolve(__dirname, "src/fetch-patch.ts"),
            "content-script": resolve(__dirname, "src/content-script.ts"),
            devtools: resolve(__dirname, "src/devtools.ts"),
          },
          output: {
            entryFileNames: `assets/[name].js`,
            chunkFileNames: `assets/[name].js`,
            assetFileNames: `assets/[name].[ext]`,
          },
        },
      },
      server: {
        port: 6020,
      },
    };
  }

  return {
    plugins: [react(), htmlPlugin(build)],
    base: "",
    build: {
      outDir: "./dist",
      minify: false,
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
          "fetch-patch": resolve(__dirname, "src/fetch-patch.ts"),
          "content-script": resolve(__dirname, "src/content-script.ts"),
          devtools: resolve(__dirname, "src/devtools.ts"),
        },
        output: {
          entryFileNames: `assets/[name].js`,
          chunkFileNames: `assets/[name].js`,
          assetFileNames: `assets/[name].[ext]`,
        },
      },
    },
    server: {
      port: 6020,
    },
  };
});
