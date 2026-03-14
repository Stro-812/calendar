import { fetchActivityDetails } from "../lib/activity.js";

export default async function handler(request, response) {
  const aid = request.query?.aid;

  if (!aid) {
    response.status(400).json({ error: "Missing aid" });
    return;
  }

  try {
    const data = await fetchActivityDetails(aid);
    response.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    response.status(200).json(data);
  } catch (error) {
    response.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
}
