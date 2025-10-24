"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/gallery", label: "Gallery" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-bold bg-[rgba(172,171,171,1)] ${
        isScrolled
          ? "bg-background/98 backdrop-blur-xl shadow-xl border-b border-primary/10"
          : "bg-gradient-to-b from-black/40 to-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 lg:w-16 lg:h-16 transition-transform group-hover:scale-110">
              <Image
                src="/images/design-mode/logo.jpeg"
                alt="Massawa Restaurant Logo"
                fill
                className="object-contain tracking-normal"
              />
            </div>
            <div className="hidden sm:block">
              <div className="font-serif text-xl lg:text-2xl font-bold text-sunset-gradient">Massawa</div>
              <div className="text-xs text-muted-foreground tracking-[0.3em] uppercase">Restaurant</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm tracking-wider uppercase transition-colors relative group ${
                    isScrolled
                      ? isActive
                        ? "text-primary font-semibold"
                        : "text-foreground/80 hover:text-primary"
                      : isActive
                        ? "text-amber-200 font-semibold"
                        : "text-white/90 hover:text-amber-200"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              )
            })}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all animate-sunset-glow"
            >
              <Link href="/reservations">Reserve Table</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 transition-colors ${isScrolled ? "text-foreground" : "text-white"}`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#2C1810]/98 backdrop-blur-xl border-t border-amber-500/20 shadow-2xl">
          <div className="container mx-auto px-4 py-6 space-y-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block text-lg tracking-wider uppercase transition-colors py-3 ${
                    isActive ? "text-amber-300 font-semibold" : "text-white hover:text-amber-200"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <Button
              asChild
              size="lg"
              className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-2xl transition-all duration-300 animate-sunset-glow border border-amber-400/20 hover:border-amber-400/40 mt-6 font-bold text-base tracking-wider font-mono"
            >
              <Link href="/reservations" onClick={() => setIsMobileMenuOpen(false)}>
                Reserve Your Table
              </Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
