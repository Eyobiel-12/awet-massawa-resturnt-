"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock, Eye, EyeOff, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminLogin() {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Redirect if already authenticated
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = sessionStorage.getItem("admin_authenticated") === "true"
      const loginTime = sessionStorage.getItem("admin_login_time")
      
      if (isAuth && loginTime) {
        const timeDiff = Date.now() - parseInt(loginTime)
        const hoursDiff = timeDiff / (1000 * 60 * 60)
        
        if (hoursDiff <= 24) {
          router.replace("/admin")
        } else {
          sessionStorage.removeItem("admin_authenticated")
          sessionStorage.removeItem("admin_login_time")
        }
      }
    }
  }, [router])

  // Default password - in production, use environment variable
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "massawa2024"

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (password === ADMIN_PASSWORD) {
      // Store authentication in sessionStorage
      sessionStorage.setItem("admin_authenticated", "true")
      sessionStorage.setItem("admin_login_time", Date.now().toString())
      
      toast({
        title: "✅ Toegang verleend",
        description: "Welkom bij het admin dashboard",
      })
      
      router.replace("/admin")
    } else {
      toast({
        title: "❌ Toegang geweigerd",
        description: "Onjuist wachtwoord",
      })
      setPassword("")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-4">
      <div className="w-full max-w-md">
        <Card className="border-2 shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Admin Toegang</CardTitle>
              <CardDescription className="mt-2">
                Voer het wachtwoord in om toegang te krijgen
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Wachtwoord"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12"
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold shadow-lg transition-all"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Lock className="w-4 h-4 mr-2 animate-pulse" />
                    Inloggen...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Inloggen
                  </>
                )}
              </Button>
            </form>
            <p className="text-xs text-center text-muted-foreground mt-6">
              Standaard wachtwoord: <code className="bg-muted px-1.5 py-0.5 rounded">massawa2024</code>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

