import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      ".trycloudflare.com",
      ".ngrok-free.app",
      ".loca.lt",
      "localhost",
      true,
    ],
    base: "./",
    port: 5173,
    // or allow all (less secure, but fine for dev)
    // allowedHosts: true
  },

  build: {
    outDir: "dist",
  },
});
