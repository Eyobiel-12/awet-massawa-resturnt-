import { Navigation } from "@/components/navigation"
import { Menu } from "@/components/menu"
import { Footer } from "@/components/footer"

export default function MenuPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* </CHANGE> */}
      <Menu />
      <Footer />
    </main>
  )
}
