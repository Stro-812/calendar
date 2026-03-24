# Run Screenshot Parser

Standalone web service: a user opens a URL, uploads a running screenshot, and immediately gets two values back:

- distance in kilometers
- workout duration

The frontend is built with React + Vite. The backend is a lightweight API route that sends the image to OpenAI `Responses API` and requires a strict JSON response.

## How it works

1. The browser reads the uploaded screenshot as a base64 data URL.
2. The frontend sends it to `POST /api/run-parse`.
3. The backend calls OpenAI with image input.
4. The model returns structured JSON:

```json
{
  "distance_km": 5.24,
  "duration_seconds": 1532,
  "duration_text": "25:32",
  "confidence": 0.94,
  "notes": ""
}
```

## Project structure

- `src/App.tsx` - standalone upload interface
- `src/api/runParserApi.ts` - browser client for the backend route
- `lib/runParser.js` - OpenAI request and response normalization
- `api/run-parse.js` - serverless API route for production hosting
- `vite.config.ts` - local dev middleware for `/api/run-parse`

## Environment variables

Create an env file or set variables in your hosting platform:

```bash
OPENAI_API_KEY=your_key_here
OPENAI_VISION_MODEL=gpt-4o-mini
```

`OPENAI_VISION_MODEL` is optional.

## Run locally

```bash
npm install
OPENAI_API_KEY=your_key_here npm run dev
```

Then open the local URL shown by Vite.

## Production deploy

This repo is ready to be deployed as a separate internet service.

Typical setup:

1. Deploy the project to Vercel.
2. Add `OPENAI_API_KEY` in project environment variables.
3. Attach your domain or subdomain, for example `run.yourdomain.com`.

The frontend will stay on the same origin as the backend route, so the browser can call `/api/run-parse` directly without extra CORS setup.
