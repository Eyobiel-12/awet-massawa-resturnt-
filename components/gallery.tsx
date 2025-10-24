"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X } from "lucide-react"

const galleryImages = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-10-18%20at%2015.59.48-2ccaaEf4tUEeVhg1pE6klHQ4dTjkKd.jpeg",
    alt: "Elegant bar area with creative LED-lit fish shelves and hanging globe lights",
    category: "Interior",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-10-18%20at%2015.59.49%20%281%29-eComnH1MTj9mdslRfPiLv4UZIMU65P.jpeg",
    alt: "Main dining room with woven basket pendant lights and traditional Ethiopian artwork",
    category: "Interior",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-10-18%20at%2015.59.49-2iXUF1loJislSGaI5aGZ0adhNaDrPg.jpeg",
    alt: "Spacious dining area with natural light and comfortable seating arrangements",
    category: "Interior",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-10-18%20at%2015.59.49%20%282%29-iV2863lmpm6OU3eiuFFoM0II4cGCBr.jpeg",
    alt: "Full view of restaurant showcasing traditional decor and patterned tile flooring",
    category: "Interior",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-10-18%20at%2015.59.48%20%281%29-gpTHQ3qlRCcvKjh3qH2oUSyj4bnC8t.jpeg",
    alt: "Cozy window-side seating with traditional Ethiopian coffee pots display",
    category: "Interior",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-10-18%20at%2015.59.48%20%282%29-TMnnWPyOFmRKBR9atD7l3f56wSKoVA.jpeg",
    alt: "Traditional Ethiopian coffee ceremony artwork with tropical seating below",
    category: "Culture",
  },
]

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <section id="gallery" className="py-12 sm:py-16 md:py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3 sm:space-y-4">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance">
            Gallery
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty px-4 sm:px-0">
            Step into our world of culinary artistry and cultural heritage
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer tap-target"
              onClick={() => setSelectedImage(image.src)}
            >
              <img
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-xs sm:text-sm font-medium mb-1">{image.category}</p>
                <p className="text-xs text-white/80 line-clamp-2">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-7xl w-[95vw] sm:w-full p-0 bg-black/95 border-0">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50 p-2 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors tap-target"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
          {selectedImage && (
            <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh]">
              <img
                src={selectedImage || "/placeholder.svg"}
                alt="Gallery image"
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
