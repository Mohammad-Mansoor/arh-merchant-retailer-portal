import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    svgr({
      exportAsDefault: false,
      svgrOptions: { icon: true },
    }),
    visualizer({
      open: true,   
      template: 'treemap',
      filename: "stats.html", // optional file name
      gzipSize: true,
      brotliSize: true,
    }),

    // Optional: See what's in your bundle
  ],

  // ⚡ Improves reload speed by caching node_modules parsing
  optimizeDeps: {
     include: ["react", "react-dom", "exceljs", "fullcalendar", "react-dnd"],
  },

  // 🚀 Remove sourcemaps in dev for smaller transfers
  esbuild: {
    sourcemap: false,
  },

  build: {
    outDir: "../website/public/dashboard",
    emptyOutDir: true,
    sourcemap: false, // also no sourcemaps in production
    chunkSizeWarningLimit: 1000, // so Vite won't spam warnings for big chunks
  },

  server: {
    open: true,
    // Optional: enable compression so browser downloads less data in dev
    middlewareMode: false,
  },
});
