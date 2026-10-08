# Callflow proof

A minimal voice bot that answers a Twilio call, asks three short questions, extracts structured lead fields through Vercel AI Gateway, and creates a Bitrix24 lead through its REST webhook.

## Flow

`Public Twilio number → /api/twilio/voice → Twilio speech recognition → /api/twilio/answer → AI Gateway → Bitrix24 crm.lead.add`

The bot asks:

1. Desired service
2. Company name
3. Preferred contact channel

## Environment variables

Copy `.env.example` to `.env.local` for local development or add the same variables in Vercel project settings.

- `BITRIX24_WEBHOOK_URL`: Bitrix24 incoming webhook base URL, for example `https://your-portal.bitrix24.com/rest/1/xxx`
- `AI_MODEL`: Optional AI Gateway model. Defaults to `google/gemini-3-flash`.
- `TWILIO_VOICE`: Optional Twilio voice, defaults to `Polly.Joanna`.
- `BITRIX24_SOURCE_ID`: Optional Bitrix source ID, defaults to `CALL`.

AI Gateway authentication is supplied by the Vercel runtime. No AI provider key is required in this app.

## Twilio setup

1. Deploy this project to a public HTTPS URL.
2. Buy or connect a Twilio phone number with Voice enabled.
3. In the number's **Voice configuration**, set **A call comes in** to `https://YOUR_DOMAIN/api/twilio/voice` using `HTTP POST`.
4. Call the number and answer the three prompts with short sentences.
5. Confirm a new lead appears in Bitrix24.

Twilio's built-in speech recognition is used for this MVP, so no separate STT provider is needed. The server never exposes the Bitrix webhook to the browser.

## Local test

Run `pnpm dev`, expose the app through an HTTPS tunnel such as ngrok or Cloudflare Tunnel, then use that public URL in Twilio. A browser GET to `/api/twilio/voice` returns the same TwiML as a phone call, but the real acceptance test should be done from a phone because Twilio supplies the speech results.

## Bitrix24 mapping

The REST call creates a lead with the desired service in `TITLE`, the company in `COMPANY_TITLE`, the contact preference in `SOURCE_DESCRIPTION`, and the full normalized JSON in `COMMENTS`. The caller's Twilio number can be added to the lead later as a `PHONE` field once the demo's preferred ownership and consent policy are confirmed.

## Production notes

For a production launch, validate Twilio signatures, add retry/idempotency handling around Bitrix24, log call IDs, and add a fallback path when speech recognition confidence is low. The MVP intentionally keeps the conversation narrow so short-sentence replies are reliable.
