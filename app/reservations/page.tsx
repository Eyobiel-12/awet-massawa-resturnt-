import { Navigation } from "@/components/navigation"
import { Reservation } from "@/components/reservation"
import { Footer } from "@/components/footer"

export default function ReservationsPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* </CHANGE> */}
      <Reservation />
      <Footer />
    </main>
  )
}
