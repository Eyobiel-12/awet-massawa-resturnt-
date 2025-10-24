import { Navigation } from "@/components/navigation"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <section className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sunset-gold via-sunset-amber to-sunset-coral opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(201,169,97,0.15),transparent_50%)]" />
        <div className="relative z-10 text-center space-y-4 px-4">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-foreground text-balance">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            We look forward to welcoming you to Massawa
          </p>
        </div>
      </section>
      {/* </CHANGE> */}
      <Contact />
      <Footer />
    </main>
  )
}
