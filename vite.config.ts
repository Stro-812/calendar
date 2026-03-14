import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fetchActivityDetails } from "./lib/activity.js";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "activity-api-dev-middleware",
      configureServer(server) {
        server.middlewares.use("/api/activity", async (req, res) => {
          try {
            const url = new URL(req.url ?? "", "http://localhost");
            const aid = url.searchParams.get("aid");

            if (!aid) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Missing aid" }));
              return;
            }

            const data = await fetchActivityDetails(aid);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(data));
          } catch (error) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }));
          }
        });
      }
    }
  ]
});
