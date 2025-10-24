import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "Massawa Restaurant | Authentic Ethiopian & Eritrean Fine Dining",
  description:
    "Experience the authentic flavors of Ethiopia and Eritrea in an atmosphere of refined elegance. Award-winning cuisine with family heritage recipes.",
  generator: 'v0.app',
  verification: {
    google: 'RVRrR7vz4FFR1eJvkHJbcfJdHwgKUNHR9eWpbGW8JcU'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body style={{ isolation: "isolate" }}>{children}</body>
    </html>
  )
}
