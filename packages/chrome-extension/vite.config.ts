import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import htmlPlugin, { Options, ScriptTag } from 'vite-plugin-html-config';
import { resolve } from 'path';

const dev = {
  headScripts: [
    {
      src: 'http://localhost:6020/src/dev/reactPreamble.ts',
      type: 'module',
    } as ScriptTag,
    {
      src: 'http://localhost:6020/@vite/client',
      type: 'module',
    } as ScriptTag,
    {
      src: 'http://localhost:6020/src/main.tsx',
      type: 'module',
    } as ScriptTag,
  ],
} satisfies Options;

const build = {
  headScripts: [
    {
      async: false,
      src: './src/main.tsx',
      type: 'module',
    } as ScriptTag,
  ],
} satisfies Options;

export default defineConfig(({ mode }) => {
  if (mode === 'development') {
    return {
      // @ts-expect-error TODO: Fix type
      plugins: [react(), htmlPlugin(dev)],
      base: '',
      build: {
        outDir: './dist',
        minify: false,
        rollupOptions: {
          input: {
            main: resolve(__dirname, 'devtoolsPanel.html'),
            fetchPatcherInjector: resolve(
              __dirname,
              'src/assets/fetchPatcherInjector.ts',
            ),
            readNextJsScriptTagsInjector: resolve(
              __dirname,
              'src/assets/readNextJsScriptTagsInjector.ts',
            ),
            contentScript: resolve(__dirname, 'src/assets/contentScript.ts'),
            devtoolsPage: resolve(__dirname, 'src/assets/devtoolsPage.ts'),
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
    // @ts-expect-error TODO: Fix type
    plugins: [react(), htmlPlugin(build)],
    base: '',
    build: {
      outDir: './dist',
      minify: false,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'devtoolsPanel.html'),
          fetchPatcherInjector: resolve(
            __dirname,
            'src/assets/fetchPatcherInjector.ts',
          ),
          readNextJsScriptTagsInjector: resolve(
            __dirname,
            'src/assets/readNextJsScriptTagsInjector.ts',
          ),
          contentScript: resolve(__dirname, 'src/assets/contentScript.ts'),
          devtoolsPage: resolve(__dirname, 'src/assets/devtoolsPage.ts'),
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
