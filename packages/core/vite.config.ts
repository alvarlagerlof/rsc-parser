// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      entryRoot: './src',
      exclude: ['**/*.stories.tsx', '**/example-data/**'],
      rollupTypes: true,
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
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', 'react-dom'],
    },
    minify: false,
  },
});
