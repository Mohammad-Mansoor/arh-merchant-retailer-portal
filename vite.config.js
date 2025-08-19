import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  base: '/merchant/',
  plugins: [
    react(),
    svgr({
      exportAsDefault: false,
      svgrOptions: { icon: true },
    }),
    visualizer({
      open: true,
      template: 'treemap',
      filename: "stats.html",
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ["react", "react-dom", "exceljs", "fullcalendar", "react-dnd"],
  },
  server: {
    open: true,
    middlewareMode: false,
  },
});