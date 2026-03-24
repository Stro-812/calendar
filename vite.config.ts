import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { extractRunMetrics } from "./lib/runParser.js";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "run-parser-api-dev-middleware",
      configureServer(server) {
        server.middlewares.use("/api/run-parse", async (req, res) => {
          if (req.method !== "POST") {
            res.statusCode = 405;
            res.setHeader("Allow", "POST");
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Method not allowed" }));
            return;
          }

          try {
            const chunks = [];

            for await (const chunk of req) {
              chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
            }

            const body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
            const imageDataUrl = body.imageDataUrl;

            if (!imageDataUrl) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Missing imageDataUrl" }));
              return;
            }

            const data = await extractRunMetrics(imageDataUrl);
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
