"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react"

function ConfirmContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const confirmReservation = async () => {
      const name = searchParams.get("name")
      const email = searchParams.get("email")
      const date = searchParams.get("date")
      const time = searchParams.get("time")
      const guests = searchParams.get("guests")
      const msg = searchParams.get("message")

      if (!name || !email || !date || !time || !guests) {
        setStatus("error")
        setMessage("Ontbrekende parameters")
        return
      }

      try {
        const response = await fetch(
          `/api/confirm-reservation?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}&guests=${encodeURIComponent(guests)}&message=${encodeURIComponent(msg || "")}`
        )

        if (response.ok) {
          setStatus("success")
          setMessage("Bevestigingsmail succesvol verstuurd naar de klant")
        } else {
          setStatus("error")
          setMessage("Kon bevestigingsmail niet versturen")
        }
      } catch (error) {
        console.error("Error:", error)
        setStatus("error")
        setMessage("Er is een fout opgetreden")
      }
    }

    confirmReservation()
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          {status === "loading" && (
            <>
              <Loader2 className="w-16 h-16 text-amber-600 mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Bevestigingsmail versturen...
              </h2>
              <p className="text-gray-600">
                Even geduld terwijl we de bevestigingsmail naar de klant sturen
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                ✅ Succesvol!
              </h2>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
                De klant ontvangt nu een bevestigingsmail met alle reservering details.
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Fout opgetreden
              </h2>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
                Probeer het opnieuw of neem handmatig contact op met de klant.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <Loader2 className="w-16 h-16 text-amber-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Laden...</h2>
          </div>
        </div>
      </div>
    }>
      <ConfirmContent />
    </Suspense>
  )
}

