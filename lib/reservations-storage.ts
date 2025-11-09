import { supabase } from "./supabase"

export interface Reservation {
  id: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: string
  message: string
  status: "pending" | "confirmed" | "cancelled"
  created_at: string
}

// Read reservations from Supabase
export async function getReservations(): Promise<Reservation[]> {
  try {
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching reservations:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching reservations:", error)
    return []
  }
}

// Add a new reservation
export async function addReservation(
  reservation: Omit<Reservation, "id" | "status" | "created_at">
): Promise<Reservation> {
  const { data, error } = await supabase
    .from("reservations")
    .insert({
      name: reservation.name,
      email: reservation.email,
      phone: reservation.phone,
      date: reservation.date,
      time: reservation.time,
      guests: reservation.guests,
      message: reservation.message || "",
      status: "pending",
    })
    .select()
    .single()

  if (error) {
    console.error("Error adding reservation:", error)
    throw new Error(`Failed to add reservation: ${error.message}`)
  }

  return data
}

// Update reservation status
export async function updateReservationStatus(
  id: string,
  status: "pending" | "confirmed" | "cancelled"
): Promise<Reservation | null> {
  const { data, error } = await supabase
    .from("reservations")
    .update({ status })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating reservation:", error)
    return null
  }

  return data
}

// Delete reservation
export async function deleteReservation(id: string): Promise<boolean> {
  const { error } = await supabase.from("reservations").delete().eq("id", id)

  if (error) {
    console.error("Error deleting reservation:", error)
    return false
  }

  return true
}
