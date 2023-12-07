import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import UnocssPlugin from "@unocss/vite";
import path from "path";

// https://vitejs.dev/config/
// @ts-ignore
export default defineConfig(async () => ({
  plugins: [solidPlugin(), UnocssPlugin({})],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // "@assets": path.resolve(__dirname, "./src/assets"),
      // "@shared": path.resolve(__dirname, "./src/shared"),
      // "@store": path.resolve(__dirname, "./src/store/index.tsx"),
      // "@utils": path.resolve(__dirname, "./src/utils"),
      // "@i18n": path.resolve(__dirname, "./src/i18n"),
    },
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  // prevent vite from obscuring rust errors
  clearScreen: false,
  // tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
  },
  // to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    // Tauri supports es2021
    // biome-ignore lint/suspicious/noDoubleEquals: <explanation>
    target: process.env.TAURI_PLATFORM == "windows" ? "chrome105" : "safari13",
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
  },
}));
