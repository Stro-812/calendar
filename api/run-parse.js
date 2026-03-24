import { extractRunMetrics } from "../lib/runParser.js";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const imageDataUrl = request.body?.imageDataUrl;

  if (!imageDataUrl) {
    response.status(400).json({ error: "Missing imageDataUrl" });
    return;
  }

  try {
    const result = await extractRunMetrics(imageDataUrl);
    response.status(200).json(result);
  } catch (error) {
    response.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
}
