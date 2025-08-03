import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      exportAsDefault: false, // Ensures named exports, so no default export
      svgrOptions: {
        icon: true,
        // 'namedExport' option is not standard; to export ReactComponent, use exportAsDefault: false
        // Any other SVGR options can be placed here
      },
    }),
  ],
});
