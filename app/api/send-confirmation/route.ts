import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, date, time, guests, message } = body

    if (!name || !email || !date || !time || !guests) {
      return NextResponse.json(
        { success: false, error: "Ontbrekende parameters" },
        { status: 400 }
      )
    }

    const serviceId = "service_t722xgi"
    const templateId = "template_99b3wut"
    const publicKey = "2ZQ3WgKUpnfTZho4p"
    const privateKey = process.env.EMAILJS_PRIVATE_KEY

    const templateParams = {
      to_name: name,
      to_email: email,
      reservation_date: date,
      reservation_time: time,
      reservation_guests: guests,
      reservation_message: message || "Geen speciale verzoeken",
      restaurant_name: "Massawa Restaurant",
      restaurant_address: "Amsterdamsestraatweg 54, 3513 AG Utrecht",
      restaurant_phone: "+31 6 34440775",
      restaurant_email: "info@massawa-restaurant.nl",
      email: email,
    }

    const response = await fetch(
      `https://api.emailjs.com/api/v1.0/email/send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          accessToken: privateKey,
          template_params: templateParams,
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("EmailJS API error:", errorText)
      throw new Error(`Email versturen mislukt: ${errorText}`)
    }

    const result = await response.text()
    console.log("Bevestigingsmail verzonden succesvol:", result)

    return NextResponse.json(
      { success: true, message: "Bevestigingsmail verstuurd aan klant" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error sending confirmation:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Kon bevestigingsmail niet versturen",
      },
      { status: 500 }
    )
  }
}

