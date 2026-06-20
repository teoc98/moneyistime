import { defineConfig, loadEnv } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import solidPlugin from "vite-plugin-solid";
import devtools from "solid-devtools/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base: env.VITE_BASE_URL || "/",
    plugins: [devtools(), solidPlugin()],
    server: {
      port: 3000,
    },
    build: {
      target: "esnext",
    },
  };
});
