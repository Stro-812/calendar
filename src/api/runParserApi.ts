export type RunParseResult = {
  distance_km: number | null;
  duration_seconds: number | null;
  duration_text: string | null;
  confidence: number;
  notes: string;
};

export async function parseRunScreenshot(imageDataUrl: string) {
  const response = await fetch("/api/run-parse", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ imageDataUrl })
  });

  const data = (await response.json()) as RunParseResult | { error: string };

  if (!response.ok) {
    throw new Error("error" in data ? data.error : "Failed to parse screenshot");
  }

  return data as RunParseResult;
}
