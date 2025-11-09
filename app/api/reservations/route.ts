import { NextRequest, NextResponse } from "next/server"
import {
  getReservations,
  addReservation,
  updateReservationStatus,
  deleteReservation,
  type Reservation,
} from "@/lib/reservations-storage"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const date = searchParams.get("date")
    const searchQuery = searchParams.get("search")

    let reservations = await getReservations()

    // Filter by status
    if (status && status !== "all") {
      reservations = reservations.filter((r) => r.status === status)
    }

    // Filter by date
    if (date) {
      reservations = reservations.filter((r) => r.date === date)
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      reservations = reservations.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.email.toLowerCase().includes(query) ||
          r.phone.includes(query) ||
          r.message.toLowerCase().includes(query)
      )
    }

    // Sort by date and time (newest first)
    reservations.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`)
      const dateB = new Date(`${b.date}T${b.time}`)
      return dateB.getTime() - dateA.getTime()
    })

    return NextResponse.json({ reservations })
  } catch (error) {
    console.error("Error fetching reservations:", error)
    return NextResponse.json(
      { error: "Kon reserveringen niet laden" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, date, time, guests, message } = body

    if (!name || !email || !phone || !date || !time || !guests) {
      return NextResponse.json(
        { success: false, error: "Ontbrekende verplichte velden" },
        { status: 400 }
      )
    }

    const reservation = await addReservation({
      name,
      email,
      phone,
      date,
      time,
      guests,
      message: message || "",
    })

    return NextResponse.json({ success: true, reservation }, { status: 201 })
  } catch (error) {
    console.error("Error creating reservation:", error)
    return NextResponse.json(
      { success: false, error: "Kon reservering niet aanmaken" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "ID en status zijn verplicht" },
        { status: 400 }
      )
    }

    const reservation = await updateReservationStatus(id, status as "pending" | "confirmed" | "cancelled")

    if (!reservation) {
      return NextResponse.json(
        { success: false, error: "Reservering niet gevonden" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, reservation })
  } catch (error) {
    console.error("Error updating reservation:", error)
    return NextResponse.json(
      { success: false, error: "Kon reservering niet updaten" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is verplicht" },
        { status: 400 }
      )
    }

    const deleted = await deleteReservation(id)

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Reservering niet gevonden" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting reservation:", error)
    return NextResponse.json(
      { success: false, error: "Kon reservering niet verwijderen" },
      { status: 500 }
    )
  }
}
