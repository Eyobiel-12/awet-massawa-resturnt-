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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/gallery", label: "Gallery" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/98 backdrop-blur-md shadow-lg border-b border-amber-200/20"
          : "bg-black/85 backdrop-blur-sm shadow-md"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group z-10">
            <div className="relative w-12 h-12 lg:w-16 lg:h-16 transition-all duration-300 group-hover:scale-110">
              <Image
                src="/images/design-mode/logo.jpeg"
                alt="Massawa Restaurant Logo"
                fill
                className="object-contain rounded-lg"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <div className={`font-serif text-xl lg:text-2xl font-bold transition-colors duration-300 ${
                isScrolled 
                  ? "bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent" 
                  : "text-white"
              }`}>
                Massawa
              </div>
              <div className={`text-xs tracking-[0.3em] uppercase transition-colors duration-300 ${
                isScrolled ? "text-foreground/70" : "text-white/90"
              }`}>
                Restaurant
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm tracking-wider uppercase transition-all duration-300 rounded-lg group ${
                    isScrolled
                      ? isActive
                        ? "text-amber-600 font-semibold bg-amber-50"
                        : "text-foreground/90 hover:text-amber-600 hover:bg-amber-50/50"
                      : isActive
                        ? "text-amber-300 font-semibold bg-white/15"
                        : "text-white hover:text-amber-200 hover:bg-white/10"
                  }`}
                >
                  {link.label}
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-8 bg-gradient-to-r from-transparent via-amber-400 to-transparent transition-opacity duration-300 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`} />
                </Link>
              )
            })}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 hover:from-amber-700 hover:via-orange-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 font-semibold tracking-wide"
            >
              <Link href="/reservations">Reserve Table</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-all duration-300 z-10 ${
              isScrolled 
                ? "text-foreground hover:bg-amber-50" 
                : "text-white hover:bg-white/10"
            } ${isMobileMenuOpen ? "rotate-90" : ""}`}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 top-20 bg-black transition-all duration-500 ease-in-out z-40 ${
          isMobileMenuOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="container mx-auto px-4 py-8 space-y-3">
          {navLinks.map((link, index) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-5 py-4 text-lg tracking-wider uppercase transition-all duration-300 rounded-xl font-bold ${
                  isActive
                    ? "text-white bg-amber-700 border-l-4 border-amber-400 shadow-xl"
                    : "text-white bg-gray-900 hover:text-amber-200 hover:bg-gray-800 hover:pl-6 border border-gray-700"
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {link.label}
              </Link>
            )
          })}
          
          <div className="pt-6 border-t border-amber-500 mt-6">
            <Button
              asChild
              size="lg"
              className="w-full bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 hover:from-amber-700 hover:via-orange-600 hover:to-amber-700 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 font-bold text-base tracking-wider"
            >
              <Link href="/reservations" onClick={() => setIsMobileMenuOpen(false)}>
                Reserve Your Table
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
