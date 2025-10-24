import { Navigation } from "@/components/navigation"
import { Gallery } from "@/components/gallery"
import { Footer } from "@/components/footer"

export default function GalleryPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* </CHANGE> */}
      <Gallery />
      <Footer />
    </main>
  )
}
