// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import preserveDirectives from 'rollup-plugin-preserve-directives';

export default defineConfig({
  plugins: [react(), dts()],
  build: {
    outDir: './dist/js',
    emptyOutDir: false,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'RscDevtoolsPanel.tsx'),
      name: 'embedded',
      // the proper extensions will be added
      fileName: 'embedded',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', 'react-dom'],
      output: {
        preserveModules: true,
      },
      plugins: [preserveDirectives()],
    },
    minify: false,
  },
});
