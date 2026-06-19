import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `base` is "/" for local dev and is overridden in CI (GitHub Pages serves
// the prototype under https://<user>.github.io/<repo>/).
export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  plugins: [react()]
});
