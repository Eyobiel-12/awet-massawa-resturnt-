"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown, Sparkles } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-10-18%20at%2015.59.49%20%281%29-eComnH1MTj9mdslRfPiLv4UZIMU65P.jpeg)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900/70 via-rose-900/60 to-amber-900/70" />
        <div
          className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/20 animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-secondary/10 to-transparent animate-float" />
      </div>

      <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-40 h-40 bg-rose-400/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-32 left-1/4 w-36 h-36 bg-orange-400/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-amber-200 rounded-full animate-sparkle" />
        <div className="absolute top-1/2 left-1/4 w-1.5 h-1.5 bg-rose-200 rounded-full animate-sparkle-delayed" />
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-orange-200 rounded-full animate-sparkle-slow" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          <div
            className="animate-fade-in-up opacity-0"
            style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/10 backdrop-blur-md border border-amber-200/30 mb-4 sm:mb-6">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-amber-200 animate-pulse" />
              <span className="text-xs sm:text-sm text-amber-100 font-medium">
                Authentic Ethiopian & Eritrean Cuisine
              </span>
            </div>
          </div>

          <h1
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight text-balance drop-shadow-2xl animate-fade-in-up opacity-0 px-4 sm:px-0"
            style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
          >
            Where Tradition
            <br />
            <span className="text-amber-200 inline-block animate-shimmer bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 bg-clip-text text-transparent bg-[length:200%_100%]">
              Meets the Table
            </span>
          </h1>

          <p
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-amber-50/95 max-w-2xl mx-auto leading-relaxed text-pretty drop-shadow-lg animate-fade-in-up opacity-0 px-4 sm:px-0"
            style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
          >
            Experience the authentic flavors of Ethiopia and Eritrea in an atmosphere of refined elegance
          </p>

          <div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 animate-fade-in-up opacity-0 px-4 sm:px-0"
            style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
          >
            <Button
              asChild
              size="lg"
              className="group relative bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 text-white text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 h-auto shadow-2xl border-0 overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(251,146,60,0.5)] w-full sm:w-auto"
            >
              <Link href="/reservations" className="relative z-10">
                <span className="relative z-10">Reserve Your Table</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="group bg-white/15 backdrop-blur-md border-amber-200/40 text-white hover:bg-white/25 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 h-auto shadow-xl transition-all duration-300 hover:scale-105 hover:border-amber-200/60 w-full sm:w-auto"
            >
              <Link href="/menu">
                Explore Menu
                <ChevronDown className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-y-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <Link
        href="#features"
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce hidden sm:block"
      >
        <div className="flex flex-col items-center gap-2 group cursor-pointer">
          <span className="text-xs text-amber-200/80 uppercase tracking-wider">Scroll to explore</span>
          <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8 text-amber-200/90 group-hover:text-amber-100 transition-colors" />
        </div>
      </Link>
    </section>
  )
}
