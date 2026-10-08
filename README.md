# Callflow to Bitrix24

**Developer:** Afaq Ahmad

A deployable voice bot proof-of-concept that answers an incoming phone call, asks three focused questions, understands short spoken replies, extracts structured lead data, and creates a new lead in Bitrix24 automatically.

## End-to-end flow

```text
Public phone number
  -> Twilio Voice webhook: /api/twilio/voice
  -> Twilio speech recognition
  -> Conversation handler: /api/twilio/answer
  -> Structured NLP extraction
  -> Bitrix24 crm.lead.add
```

The bot asks:

1. What service does the caller need?
2. What is the company name?
3. Which contact channel does the caller prefer?

## Backend files

- `app/api/twilio/voice/route.ts` returns TwiML for the first greeting and question.
- `app/api/twilio/answer/route.ts` receives each speech result and continues the call.
- `lib/lead-flow.ts` extracts the answer into typed fields and sends the completed lead to Bitrix24.
- `app/page.tsx` provides a simple public status page describing the demo.

## Environment variables

Copy `.env.example` to `.env.local` for local development, or add the variables to the deployment environment.

- `BITRIX24_WEBHOOK_URL` — Bitrix24 incoming webhook base URL, such as `https://your-portal.bitrix24.com/rest/1/xxx`
- `AI_MODEL` — optional model identifier; defaults to `google/gemini-3-flash`
- `TWILIO_VOICE` — optional Polly voice; defaults to `Polly.Joanna`
- `BITRIX24_SOURCE_ID` — optional Bitrix24 source ID; defaults to `CALL`

The AI gateway is authenticated by the hosting runtime. No provider API key is exposed to the browser.

## Run locally

```bash
pnpm install
pnpm dev
```

For a real phone call, expose the local app through an HTTPS tunnel such as ngrok or Cloudflare Tunnel. The endpoint must be publicly reachable by Twilio.

## Configure Twilio

1. Buy or connect a Twilio phone number with Voice enabled.
2. Open the phone number's Voice configuration.
3. Set **A call comes in** to `https://YOUR_DOMAIN/api/twilio/voice` using HTTP POST.
4. Call the number and answer each question in a short sentence.
5. Confirm that a new lead appears in Bitrix24.

## Bitrix24 mapping

The completed record is created through `crm.lead.add` with:

- `TITLE`: desired service
- `COMPANY_TITLE`: company name
- `SOURCE_DESCRIPTION`: preferred contact channel
- `COMMENTS`: normalized JSON containing all captured fields

The caller's phone number is available from Twilio and can be added to the Bitrix24 phone field when the demo's consent and ownership rules are finalized.

## Security and production hardening

The Bitrix24 webhook is used only on the server and is never sent to the browser. Before production use, add Twilio signature validation, request idempotency keyed by call ID, structured call logging, rate limiting, and a retry/fallback path for low-confidence speech recognition.

## Developer

Built and maintained by **Afaq Ahmad**.

This MVP intentionally keeps the dialog narrow so short-sentence answers can be processed reliably without human intervention.
