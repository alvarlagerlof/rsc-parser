// vite.config.js
import { resolve } from 'path';
import { defineConfig, esmExternalRequirePlugin } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    dts({
      entryRoot: './src',
      exclude: ['**/*.stories.tsx', '**/example-data/**'],
      rollupTypes: true,
    }),
    esmExternalRequirePlugin({
      external: ['react', 'react-dom', /^node:/],
    }),
  ],
  build: {
    outDir: './dist',
    emptyOutDir: false,
    lib: {
      entry: {
        main: resolve(__dirname, 'src/main.ts'),
        fetchPatcher: resolve(__dirname, 'src/fetchPatcher.ts'),
        readNextJsScriptTags: resolve(__dirname, 'src/readNextJsScriptTags.ts'),
        events: resolve(__dirname, 'src/events.ts'),
      },
      formats: ['es'],
    },
    minify: false,
    sourcemap: mode === 'development' ? 'inline' : false,
  },
}));
