// vite.config.ts
import { resolve } from "path";
import { defineConfig } from "file:///Users/alvar/Code/alvarlagerlof/rsc-parser/node_modules/vite/dist/node/index.js";
import react from "file:///Users/alvar/Code/alvarlagerlof/rsc-parser/node_modules/@vitejs/plugin-react/dist/index.mjs";
import dts from "file:///Users/alvar/Code/alvarlagerlof/rsc-parser/node_modules/vite-plugin-dts/dist/index.mjs";
import preserveDirectives from "file:///Users/alvar/Code/alvarlagerlof/rsc-parser/node_modules/rollup-plugin-preserve-directives/dist/index.js";
var __vite_injected_original_dirname = "/Users/alvar/Code/alvarlagerlof/rsc-parser/packages/embedded";
var vite_config_default = defineConfig({
  plugins: [react(), dts()],
  build: {
    outDir: "./dist/js",
    emptyOutDir: false,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__vite_injected_original_dirname, "RscDevtoolsPanel.tsx"),
      name: "embedded",
      // the proper extensions will be added
      fileName: "embedded",
      formats: ["es"]
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["react"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: "React"
        },
        preserveModules: true
      },
      plugins: [preserveDirectives()]
    },
    minify: false
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYWx2YXIvQ29kZS9hbHZhcmxhZ2VybG9mL3JzYy1wYXJzZXIvcGFja2FnZXMvZW1iZWRkZWRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9hbHZhci9Db2RlL2FsdmFybGFnZXJsb2YvcnNjLXBhcnNlci9wYWNrYWdlcy9lbWJlZGRlZC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvYWx2YXIvQ29kZS9hbHZhcmxhZ2VybG9mL3JzYy1wYXJzZXIvcGFja2FnZXMvZW1iZWRkZWQvdml0ZS5jb25maWcudHNcIjsvLyB2aXRlLmNvbmZpZy5qc1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IGR0cyBmcm9tIFwidml0ZS1wbHVnaW4tZHRzXCI7XG5pbXBvcnQgcHJlc2VydmVEaXJlY3RpdmVzIGZyb20gXCJyb2xsdXAtcGx1Z2luLXByZXNlcnZlLWRpcmVjdGl2ZXNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCksIGR0cygpXSxcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6IFwiLi9kaXN0L2pzXCIsXG4gICAgZW1wdHlPdXREaXI6IGZhbHNlLFxuICAgIGxpYjoge1xuICAgICAgLy8gQ291bGQgYWxzbyBiZSBhIGRpY3Rpb25hcnkgb3IgYXJyYXkgb2YgbXVsdGlwbGUgZW50cnkgcG9pbnRzXG4gICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsIFwiUnNjRGV2dG9vbHNQYW5lbC50c3hcIiksXG4gICAgICBuYW1lOiBcImVtYmVkZGVkXCIsXG4gICAgICAvLyB0aGUgcHJvcGVyIGV4dGVuc2lvbnMgd2lsbCBiZSBhZGRlZFxuICAgICAgZmlsZU5hbWU6IFwiZW1iZWRkZWRcIixcbiAgICAgIGZvcm1hdHM6IFtcImVzXCJdLFxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgLy8gbWFrZSBzdXJlIHRvIGV4dGVybmFsaXplIGRlcHMgdGhhdCBzaG91bGRuJ3QgYmUgYnVuZGxlZFxuICAgICAgLy8gaW50byB5b3VyIGxpYnJhcnlcbiAgICAgIGV4dGVybmFsOiBbXCJyZWFjdFwiXSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICAvLyBQcm92aWRlIGdsb2JhbCB2YXJpYWJsZXMgdG8gdXNlIGluIHRoZSBVTUQgYnVpbGRcbiAgICAgICAgLy8gZm9yIGV4dGVybmFsaXplZCBkZXBzXG4gICAgICAgIGdsb2JhbHM6IHtcbiAgICAgICAgICByZWFjdDogXCJSZWFjdFwiLFxuICAgICAgICB9LFxuICAgICAgICBwcmVzZXJ2ZU1vZHVsZXM6IHRydWUsXG4gICAgICB9LFxuICAgICAgcGx1Z2luczogW3ByZXNlcnZlRGlyZWN0aXZlcygpXSxcbiAgICB9LFxuICAgIG1pbmlmeTogZmFsc2UsXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxTQUFTLGVBQWU7QUFDeEIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sU0FBUztBQUNoQixPQUFPLHdCQUF3QjtBQUwvQixJQUFNLG1DQUFtQztBQU96QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUFBLEVBQ3hCLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLGFBQWE7QUFBQSxJQUNiLEtBQUs7QUFBQTtBQUFBLE1BRUgsT0FBTyxRQUFRLGtDQUFXLHNCQUFzQjtBQUFBLE1BQ2hELE1BQU07QUFBQTtBQUFBLE1BRU4sVUFBVTtBQUFBLE1BQ1YsU0FBUyxDQUFDLElBQUk7QUFBQSxJQUNoQjtBQUFBLElBQ0EsZUFBZTtBQUFBO0FBQUE7QUFBQSxNQUdiLFVBQVUsQ0FBQyxPQUFPO0FBQUEsTUFDbEIsUUFBUTtBQUFBO0FBQUE7QUFBQSxRQUdOLFNBQVM7QUFBQSxVQUNQLE9BQU87QUFBQSxRQUNUO0FBQUEsUUFDQSxpQkFBaUI7QUFBQSxNQUNuQjtBQUFBLE1BQ0EsU0FBUyxDQUFDLG1CQUFtQixDQUFDO0FBQUEsSUFDaEM7QUFBQSxJQUNBLFFBQVE7QUFBQSxFQUNWO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
