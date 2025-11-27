# Massawa Retell Voice Agent

This folder contains everything you need to deploy the production-ready Retell reservation assistant for Massawa.

## Webhook Overview

- **Endpoint:** `POST /api/retell-webhook`
- **Auth:** Set `RETELL_WEBHOOK_SECRET` and send it as `Authorization: Bearer <secret>` (or `x-retell-webhook-secret` header).
- **Storage:** Persists reservations into the existing Supabase `reservations` table used by the admin panel.
- **Capacity Guard:** Declines automatically when 10 active bookings exist for the same date/time or if the party exceeds 10 guests.
- **Business Rules:** Enforces opening days (Tue–Sun), seating window (17:00–21:30), 90-minute dining time, and future-only bookings.

### Request Shape

```json
{
  "name": "John Doe",
  "phone": "+31612345678",
  "party_size": 4,
  "date": "2025-02-21",
  "time": "19:00",
  "special_requests": "Vegan, verjaardag",
  "source": "retell",
  "language": "nl-NL"
}
```

### Success Response

```json
{
  "status": "confirmed",
  "message": "Reservering bevestigd voor 2025-02-21 om 19:00.",
  "reservation_id": "a6e3d9d0-73d8-4b14-981d-3b78021e44e1",
  "dining_window_minutes": 90
}
```

### Decline Example (capacity reached)

```json
{
  "status": "full",
  "message": "Dat tijdslot is volgeboekt. Zal ik een ander tijdstip of dag voorstellen?"
}
```

## Required Environment Variables

| Variable | Description |
| --- | --- |
| `SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_URL` | Existing project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key with `reservations` table access |
| `RETELL_WEBHOOK_SECRET` | Shared secret for webhook calls (set in Retell console) |
| `RETELL_FALLBACK_EMAIL` | Optional default email when caller does not provide one |

> **Security Tip:** Never expose the service role key to the browser. It is only used inside the server-side webhook.

## Retell Assets

- `conversation-flow.json` – Importable flow definition with tone, policies, and hand-off logic.
- `prompt.md` – Final agent system prompt used inside Retell Studio / API.
- `training-utterances.json` – 55 Dutch + English example sentences for NLU fine-tuning.

## Operational Notes

- All reservations created by the agent are flagged via the `message` field (`[Voice Agent]` prefix) so your admin dashboard can recognise them instantly.
- If the caller does not share an email address, the webhook inserts `RETELL_FALLBACK_EMAIL` and annotates the note to confirm by phone manually.
- When the capacity check fails or the party is larger than 10, the webhook returns actionable text instructing the agent to hand off to a human (+31 6 24834382).
- Logs are emitted server-side via `console.error` to aid monitoring (use Vercel/Logtail/Datadog to capture them in production).

