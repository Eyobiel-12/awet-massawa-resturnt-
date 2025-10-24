import { Navigation } from "@/components/navigation"
import { About } from "@/components/about"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <section className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sunset-amber via-sunset-coral to-sunset-gold opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(247,147,30,0.15),transparent_50%)]" />
        <div className="relative z-10 text-center space-y-4 px-4">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-foreground text-balance">
            Our Story
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">Where tradition meets the table</p>
        </div>
      </section>
      {/* </CHANGE> */}
      <About />
      <Footer />
    </main>
  )
}
