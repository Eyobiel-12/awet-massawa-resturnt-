import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerName = searchParams.get("name")
    const customerEmail = searchParams.get("email")
    const date = searchParams.get("date")
    const time = searchParams.get("time")
    const guests = searchParams.get("guests")
    const message = searchParams.get("message")

    if (!customerName || !customerEmail || !date || !time || !guests) {
      return NextResponse.json(
        { success: false, error: "Ontbrekende parameters" },
        { status: 400 }
      )
    }

    // EmailJS service details
    const serviceId = "service_t722xgi"
    const templateId = "template_99b3wut"
    const publicKey = "2ZQ3WgKUpnfTZho4p"
    // Private key for server-side API calls
    const privateKey = process.env.EMAILJS_PRIVATE_KEY

    // EmailJS template parameters
    const templateParams = {
      to_name: customerName,
      to_email: customerEmail,  // This is used by EmailJS to set the recipient
      reservation_date: date,
      reservation_time: time,
      reservation_guests: guests,
      reservation_message: message || "Geen speciale verzoeken",
      restaurant_name: "Massawa Restaurant",
      restaurant_address: "Amsterdamsestraatweg 54, 3513 AG Utrecht",
      restaurant_phone: "+31 6 24834382",
      restaurant_email: "info@massawa-restaurant.nl",
      email: customerEmail,  // Extra parameter voor compatibiliteit
    }

    // Log what we're sending for debugging
    console.log("Sending email to:", customerEmail)
    console.log("Template params:", templateParams)

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
          accessToken: privateKey, // Required for strict mode API calls
          template_params: templateParams,
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("EmailJS API error:", errorText)
      throw new Error(`Email versturen mislukt: ${errorText}`)
    }

    // EmailJS returns "OK" as plain text when successful, not JSON
    const result = await response.text()
    console.log("Email verzonden succesvol:", result)

    return NextResponse.json(
      { success: true, message: "Bevestigingsmail verstuurd aan klant" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error confirming reservation:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Kon bevestigingsmail niet versturen"
      },
      { status: 500 }
    )
  }
}

