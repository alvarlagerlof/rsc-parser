import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import htmlPlugin, { Options, ScriptTag } from "vite-plugin-html-config";

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
    },
    server: {
      port: 6020,
    },
  };
});
