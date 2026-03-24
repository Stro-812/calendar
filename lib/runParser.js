const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = process.env.OPENAI_VISION_MODEL || "gpt-4o-mini";

function getApiKey() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  return apiKey;
}

function getSchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: ["distance_km", "duration_seconds", "duration_text", "confidence", "notes"],
    properties: {
      distance_km: {
        type: ["number", "null"],
        description: "Distance in kilometers exactly as shown on the screenshot."
      },
      duration_seconds: {
        type: ["integer", "null"],
        description: "Workout duration converted to seconds."
      },
      duration_text: {
        type: ["string", "null"],
        description: "Workout duration exactly as shown on the screenshot, for example 24:31 or 01:24:31."
      },
      confidence: {
        type: "number",
        minimum: 0,
        maximum: 1,
        description: "Confidence in the extraction."
      },
      notes: {
        type: "string",
        description: "Short explanation if the screenshot is blurry, cropped, or values are not visible."
      }
    }
  };
}

function parseJsonResponse(response) {
  if (typeof response.output_text === "string" && response.output_text.trim()) {
    return JSON.parse(response.output_text);
  }

  const message = Array.isArray(response.output)
    ? response.output.find((entry) => entry.type === "message" && Array.isArray(entry.content))
    : null;
  const textChunk = message?.content?.find((entry) => entry.type === "output_text" && typeof entry.text === "string");

  if (!textChunk?.text) {
    throw new Error("OpenAI response did not contain output text");
  }

  return JSON.parse(textChunk.text);
}

function normalizeResult(payload) {
  return {
    distance_km: typeof payload.distance_km === "number" ? payload.distance_km : null,
    duration_seconds: Number.isInteger(payload.duration_seconds) ? payload.duration_seconds : null,
    duration_text: typeof payload.duration_text === "string" && payload.duration_text.trim() ? payload.duration_text : null,
    confidence: typeof payload.confidence === "number" ? payload.confidence : 0,
    notes: typeof payload.notes === "string" ? payload.notes.trim() : ""
  };
}

export async function extractRunMetrics(imageDataUrl) {
  if (typeof imageDataUrl !== "string" || !imageDataUrl.startsWith("data:image/")) {
    throw new Error("Expected imageDataUrl to be a base64 data URL");
  }

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getApiKey()}`
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "You extract running metrics from a device screenshot. Return JSON only. If a value cannot be read reliably, return null for that field and explain why in notes."
            }
          ]
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                "Read the screenshot and extract exactly two metrics: running distance in kilometers and total workout duration. Ignore pace, heart rate, calories and other numbers."
            },
            {
              type: "input_image",
              image_url: imageDataUrl,
              detail: "high"
            }
          ]
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "run_metrics",
          strict: true,
          schema: getSchema()
        }
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${errorText}`);
  }

  const payload = await response.json();
  return normalizeResult(parseJsonResponse(payload));
}
