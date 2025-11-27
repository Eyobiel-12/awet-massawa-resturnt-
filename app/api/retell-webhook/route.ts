import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { supabaseAdmin } from "@/lib/supabase-admin"

const MAX_TABLES = 10
const OPENING_MINUTES = 17 * 60 // 17:00
const LAST_SEATING_MINUTES = 21 * 60 + 30 // 21:30
const DINING_WINDOW_MINUTES = 90
const CLOSED_WEEKDAY = 1 // Monday

const reservationSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
  party_size: z.number().int().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  special_requests: z.string().optional().nullable(),
  source: z.string().optional().default("retell"),
  language: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
})

type ReservationPayload = z.infer<typeof reservationSchema>

export async function POST(request: NextRequest) {
  const secret = process.env.RETELL_WEBHOOK_SECRET
  if (secret) {
    const supplied =
      request.headers.get("authorization") ??
      request.headers.get("x-retell-webhook-secret") ??
      ""
    const normalized = supplied.startsWith("Bearer ")
      ? supplied.slice(7)
      : supplied
    if (normalized !== secret) {
      return NextResponse.json(
        {
          status: "unauthorized",
          message: "Webhook signature mismatch",
        },
        { status: 401 }
      )
    }
  }

  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json(
      {
        status: "invalid_payload",
        message: "Kon geen JSON payload lezen",
      },
      { status: 400 }
    )
  }

  const parsed = reservationSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        status: "validation_failed",
        message: "Controleer de opgegeven gegevens",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    )
  }

  const payload = parsed.data

  const partySizeValidation = validatePartySize(payload.party_size)
  if (!partySizeValidation.isValid) {
    return NextResponse.json(partySizeValidation.response, {
      status: partySizeValidation.status,
    })
  }

  const businessValidation = validateBusinessRules(payload)
  if (!businessValidation.isValid) {
    return NextResponse.json(businessValidation.response, {
      status: businessValidation.status,
    })
  }

  const capacityValidation = await ensureCapacity(payload)
  if (!capacityValidation.isValid) {
    return NextResponse.json(capacityValidation.response, {
      status: capacityValidation.status,
    })
  }

  const insertResult = await persistReservation(payload)
  if (!insertResult.isValid) {
    return NextResponse.json(insertResult.response, {
      status: insertResult.status,
    })
  }

  return NextResponse.json(
    {
      status: "confirmed",
      message: `Reservering bevestigd voor ${payload.date} om ${payload.time}.`,
      reservation_id: insertResult.reservationId,
      dining_window_minutes: DINING_WINDOW_MINUTES,
    },
    { status: 201 }
  )
}

function validatePartySize(partySize: number) {
  if (partySize > MAX_TABLES) {
    return {
      isValid: false,
      status: 409,
      response: {
        status: "requires_handoff",
        message:
          "Voor groepen groter dan tien personen helpt ons team u graag persoonlijk via +31 6 24834382.",
      },
    }
  }

  return { isValid: true }
}

function validateBusinessRules(payload: ReservationPayload) {
  const requestedDate = parseDateOnly(payload.date)
  if (!requestedDate) {
    return {
      isValid: false,
      status: 400,
      response: {
        status: "validation_failed",
        message: "Ongeldige datum opgegeven.",
      },
    }
  }

  const weekday = requestedDate.getUTCDay()
  if (weekday === CLOSED_WEEKDAY) {
    return {
      isValid: false,
      status: 409,
      response: {
        status: "closed",
        message: "Massawa is op maandag gesloten. Kies een dag tussen dinsdag en zondag.",
      },
    }
  }

  const requestedDateTime = parseDateTime(payload.date, payload.time)
  if (!requestedDateTime) {
    return {
      isValid: false,
      status: 400,
      response: {
        status: "validation_failed",
        message: "Ongeldige datum-tijd combinatie opgegeven.",
      },
    }
  }

  const now = new Date()
  if (requestedDateTime <= now) {
    return {
      isValid: false,
      status: 409,
      response: {
        status: "past_date",
        message: "Reserveren kan alleen voor toekomstige datums.",
      },
    }
  }

  const timeMinutes = toMinutes(payload.time)
  if (timeMinutes === null) {
    return {
      isValid: false,
      status: 400,
      response: {
        status: "validation_failed",
        message: "Ongeldige tijd opgegeven.",
      },
    }
  }

  if (timeMinutes < OPENING_MINUTES || timeMinutes > LAST_SEATING_MINUTES) {
    return {
      isValid: false,
      status: 409,
      response: {
        status: "outside_hours",
        message:
          "Reserveren kan tussen 17:00 en 21:30. Kies een tijd binnen dit venster.",
      },
    }
  }

  return { isValid: true }
}

async function ensureCapacity(payload: ReservationPayload) {
  const { date, time } = payload
  const { data, error } = await supabaseAdmin
    .from("reservations")
    .select("id, status")
    .eq("date", date)
    .eq("time", time)
    .neq("status", "cancelled")

  if (error) {
    console.error("Capacity check failed:", error)
    return {
      isValid: false,
      status: 500,
      response: {
        status: "capacity_check_failed",
        message: "We konden de beschikbaarheid niet bevestigen. Probeer het later opnieuw.",
      },
    }
  }

  if ((data?.length ?? 0) >= MAX_TABLES) {
    return {
      isValid: false,
      status: 409,
      response: {
        status: "full",
        message:
          "Dat tijdslot is volgeboekt. Zal ik een ander tijdstip of dag voorstellen?",
      },
    }
  }

  return { isValid: true }
}

async function persistReservation(payload: ReservationPayload) {
  const emailFallback =
    payload.email && payload.email.length > 0
      ? payload.email
      : process.env.RETELL_FALLBACK_EMAIL ?? "voice-agent@massawa-habesha.nl"

  const composedMessage = buildMessage(payload)

  const { data, error } = await supabaseAdmin
    .from("reservations")
    .insert({
      name: payload.name,
      email: emailFallback,
      phone: payload.phone,
      date: payload.date,
      time: payload.time,
      guests: String(payload.party_size),
      message: composedMessage,
      status: "pending",
    })
    .select("id")
    .single()

  if (error) {
    console.error("Persist reservation failed:", error)
    return {
      isValid: false,
      status: 500,
      response: {
        status: "storage_error",
        message: "Reservering kon niet worden opgeslagen. Probeer het later opnieuw.",
      },
    }
  }

  return { isValid: true, reservationId: data.id }
}

function parseDateOnly(dateStr: string) {
  const isoString = `${dateStr}T00:00:00Z`
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) {
    return null
  }
  return date
}

function parseDateTime(dateStr: string, timeStr: string) {
  const isoString = `${dateStr}T${timeStr}:00Z`
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) {
    return null
  }
  return date
}

function toMinutes(time: string) {
  const [hh, mm] = time.split(":").map(Number)
  if (
    Number.isNaN(hh) ||
    Number.isNaN(mm) ||
    hh < 0 ||
    hh > 23 ||
    mm < 0 ||
    mm > 59
  ) {
    return null
  }
  return hh * 60 + mm
}

function buildMessage(payload: ReservationPayload) {
  const noteLines = [
    "[Voice Agent] Reservering aangemaakt via Retell.",
    `Bron: ${payload.source}`,
    payload.special_requests
      ? `Speciale verzoeken: ${payload.special_requests}`
      : undefined,
    !payload.email || payload.email.length === 0
      ? "Geen e-mailadres opgegeven; bevestig telefonisch."
      : undefined,
  ].filter(Boolean)

  return noteLines.join("\n")
}

