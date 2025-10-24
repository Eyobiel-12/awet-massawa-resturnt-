"use client"

import { Award, Heart, Users, Sparkles, ChefHat, MapPin, Clock } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const features = [
  {
    icon: Award,
    title: "Award-Winning Cuisine",
    description:
      "Recognized internationally for our authentic preparation and innovative presentation of traditional Eritrean and Ethiopian dishes",
    stat: "15+",
    statLabel: "Awards",
  },
  {
    icon: ChefHat,
    title: "Master Chefs",
    description:
      "Our culinary team brings decades of experience, trained in the art of traditional Horn of Africa cooking techniques",
    stat: "25+",
    statLabel: "Years Experience",
  },
  {
    icon: Heart,
    title: "Intimate Atmosphere",
    description:
      "Carefully curated ambiance that celebrates rich cultural heritage while providing modern luxury and comfort",
    stat: "5★",
    statLabel: "Rating",
  },
  {
    icon: Users,
    title: "Family Heritage",
    description:
      "Authentic recipes passed down through generations, prepared with love, respect, and dedication to tradition",
    stat: "100+",
    statLabel: "Traditional Recipes",
  },
  {
    icon: MapPin,
    title: "Coastal Inspiration",
    description:
      "Named after the historic port city of Massawa, bringing the flavors and spirit of the Red Sea coast to your table",
    stat: "2",
    statLabel: "Cultures United",
  },
  {
    icon: Clock,
    title: "Fresh Daily",
    description:
      "Every dish is prepared fresh daily using the finest ingredients, traditional spices, and time-honored cooking methods",
    stat: "100%",
    statLabel: "Fresh Ingredients",
  },
]

export function Features() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="features"
      className="py-20 lg:py-32 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(251,146,60,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(251,113,133,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(217,119,6,0.05),transparent_60%)] pointer-events-none" />

      <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-full blur-3xl animate-float-delayed" />
      <div
        className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-accent/10 to-secondary/10 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "1s" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">Why Choose Massawa</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-4 mb-4">
            Experience Excellence
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            Discover what makes Massawa the premier destination for authentic Eritrean and Ethiopian cuisine
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative h-full p-8 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2">
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Icon container */}
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-primary/20">
                  <feature.icon className="w-10 h-10 transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-500" />
                </div>

                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-100 scale-90">
                  <div className="bg-gradient-to-br from-primary/90 to-accent/90 text-white px-3 py-2 rounded-lg shadow-lg">
                    <div className="text-xl font-bold font-serif">{feature.stat}</div>
                    <div className="text-xs opacity-90">{feature.statLabel}</div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-pretty">{feature.description}</p>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent w-0 group-hover:w-full transition-all duration-700 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
