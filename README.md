# Missed Call Text Back Service

Automatically texts back callers who hit voicemail, get a busy signal, or whose call fails, using Twilio + Express (wrapped with `serverless-http`) deployed as a Netlify Function.

## How it works

1. Configure your Twilio phone number's **Voice → Call Status Changes** webhook to point at:
   `https://<your-site>.netlify.app/api/twilio/status` (method: `HTTP POST`)
2. When a call to that number ends with status `no-answer`, `busy`, or `failed`, the webhook fires.
3. The function sends an SMS back to the caller (`From` number) via the Twilio REST API and responds with an empty TwiML `<Response></Response>`.

## Project structure

- `src/config` — validates and exposes required Twilio env vars
- `src/services/twilioClient.js` — Twilio SDK client instance
- `src/routes/twilio.js` — `POST /twilio/status` webhook handler
- `src/app.js` — Express app definition
- `netlify/functions/app.js` — wraps the Express app with `serverless-http` for Netlify
- `netlify.toml` — Netlify build config + `/api/*` redirect to the function

## Local setup

```bash
npm install
cp .env.example .env   # fill in your Twilio credentials
npm run dev             # runs `netlify dev`
```

`netlify dev` reads `.env` automatically and serves the function at
`http://localhost:8888/api/twilio/status`.

To test locally, expose your dev server with a tunnel (e.g. `netlify dev` prints one, or use `ngrok`) and point the Twilio number's status callback at the tunnel URL while testing.

## Environment variables

See `.env.example`:

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- `MISSED_CALL_MESSAGE` (optional, has a sensible default)

Set these in the Netlify dashboard under **Site configuration → Environment variables** for production/deploy previews.

## Deploying

Push to the connected branch; Netlify builds using `netlify.toml` and deploys `netlify/functions/app.js` as a serverless function.
