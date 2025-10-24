import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-10 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-10 sm:mb-12">
          {/* Brand */}
          <div className="space-y-4 text-center sm:text-left">
            <div className="flex items-center space-x-3 justify-center sm:justify-start">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                <Image
                  src="/images/design-mode/logo.jpeg"
                  alt="Massawa Restaurant Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <div className="font-serif text-lg sm:text-xl font-bold">Massawa</div>
                <div className="text-xs text-background/70 tracking-wider">RESTAURANT</div>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-background/70 leading-relaxed max-w-xs mx-auto sm:mx-0">
              Where tradition meets the table. Experience authentic Ethiopian and Eritrean cuisine.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h3 className="font-serif text-base sm:text-lg font-bold mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: "Home", href: "/" },
                { label: "Menu", href: "/menu" },
                { label: "Gallery", href: "/gallery" },
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-background/70 hover:text-background transition-colors inline-block tap-target"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center sm:text-left">
            <h3 className="font-serif text-base sm:text-lg font-bold mb-3 sm:mb-4">Contact</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-background/70">
              <li>Amsterdamsestraatweg 54</li>
              <li>3513 AG Utrecht</li>
              <li>+31 20 123 4567</li>
              <li>info@massawa-restaurant.nl</li>
            </ul>
          </div>

          {/* Hours */}
          <div className="text-center sm:text-left">
            <h3 className="font-serif text-base sm:text-lg font-bold mb-3 sm:mb-4">Opening Hours</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-background/70">
              <li>Tuesday - Sunday</li>
              <li>17:00 - 23:00</li>
              <li className="pt-2">Monday: Closed</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-background/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs sm:text-sm text-background/70 text-center md:text-left">
              © {new Date().getFullYear()} Massawa Restaurant. All rights reserved.
            </p>
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="#"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors tap-target"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link
                href="#"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors tap-target"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link
                href="#"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors tap-target"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
