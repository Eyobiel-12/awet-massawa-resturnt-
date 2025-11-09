"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Calendar,
  Clock,
  Users,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  RefreshCw,
  Trash2,
  Send,
  Download,
  List,
  Grid3x3,
  LogOut,
  TrendingUp,
  BarChart3,
  Sparkles,
  Shield,
  Activity,
  Zap,
} from "lucide-react"
import { format, parseISO, isToday, isPast, differenceInDays } from "date-fns"
import { nl } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"

interface Reservation {
  id: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: string
  message: string
  status: "pending" | "confirmed" | "cancelled"
  created_at: string
}

export default function AdminPage() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("")
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")
  const [sendingEmail, setSendingEmail] = useState<string | null>(null)
  const { toast } = useToast()

  // Check authentication
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = sessionStorage.getItem("admin_authenticated") === "true"
      const loginTime = sessionStorage.getItem("admin_login_time")
      
      if (loginTime) {
        const timeDiff = Date.now() - parseInt(loginTime)
        const hoursDiff = timeDiff / (1000 * 60 * 60)
        
        if (hoursDiff > 24) {
          sessionStorage.removeItem("admin_authenticated")
          sessionStorage.removeItem("admin_login_time")
          router.replace("/admin/login")
          return
        }
      }
      
      if (!isAuth) {
        router.replace("/admin/login")
      } else {
        setAuthenticated(true)
      }
    }
  }, [router])

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated")
    sessionStorage.removeItem("admin_login_time")
    router.push("/admin/login")
    toast({
      title: "Uitgelogd",
      description: "Je bent succesvol uitgelogd",
    })
  }

  const fetchReservations = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (dateFilter) params.append("date", dateFilter)

      const response = await fetch(`/api/reservations?${params.toString()}`)
      const data = await response.json()
      setReservations(data.reservations || [])
      setFilteredReservations(data.reservations || [])
    } catch (error) {
      console.error("Error fetching reservations:", error)
      toast({
        title: "Fout",
        description: "Kon reserveringen niet laden",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authenticated) {
      fetchReservations()
      const interval = setInterval(fetchReservations, 30000)
      return () => clearInterval(interval)
    }
  }, [statusFilter, dateFilter, authenticated])

  useEffect(() => {
    let filtered = reservations

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(term) ||
          r.email.toLowerCase().includes(term) ||
          r.phone.includes(term)
      )
    }

    setFilteredReservations(filtered)
  }, [searchTerm, reservations])

  const sendConfirmationEmail = async (reservation: Reservation) => {
    try {
      setSendingEmail(reservation.id)
      const response = await fetch("/api/send-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: reservation.name,
          email: reservation.email,
          date: reservation.date,
          time: reservation.time,
          guests: reservation.guests,
          message: reservation.message,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "✅ Email verstuurd!",
          description: `Bevestigingsmail is verstuurd naar ${reservation.email}`,
        })
      } else {
        throw new Error(data.error || "Email versturen mislukt")
      }
    } catch (error) {
      console.error("Error sending email:", error)
      toast({
        title: "❌ Fout",
        description: error instanceof Error ? error.message : "Kon email niet versturen",
      })
    } finally {
      setSendingEmail(null)
    }
  }

  const updateStatus = async (id: string, status: "pending" | "confirmed" | "cancelled") => {
    try {
      const response = await fetch("/api/reservations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      })

      if (response.ok) {
        const reservation = reservations.find((r) => r.id === id)
        
        if (status === "confirmed" && reservation) {
          await sendConfirmationEmail(reservation)
        }

        fetchReservations()
        toast({
          title: "✅ Status bijgewerkt",
          description: `Reservering is ${status === "confirmed" ? "bevestigd en email verstuurd" : status === "cancelled" ? "geannuleerd" : "teruggezet"}`,
        })
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "❌ Fout",
        description: "Kon status niet updaten",
      })
    }
  }

  const deleteReservation = async (id: string) => {
    if (!confirm("Weet je zeker dat je deze reservering wilt verwijderen?")) return

    try {
      const response = await fetch(`/api/reservations?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchReservations()
        toast({
          title: "✅ Verwijderd",
          description: "Reservering is verwijderd",
        })
      }
    } catch (error) {
      console.error("Error deleting reservation:", error)
      toast({
        title: "❌ Fout",
        description: "Kon reservering niet verwijderen",
      })
    }
  }

  const exportToCSV = () => {
    const headers = ["Naam", "Email", "Telefoon", "Datum", "Tijd", "Gasten", "Status", "Bericht"]
    const rows = filteredReservations.map((r) => [
      r.name,
      r.email,
      r.phone,
      format(parseISO(r.date), "dd-MM-yyyy"),
      r.time,
      r.guests,
      r.status,
      r.message || "",
    ])

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `reserveringen_${format(new Date(), "yyyy-MM-dd")}.csv`
    link.click()
    
    toast({
      title: "✅ Geëxporteerd",
      description: "CSV bestand is gedownload",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-600 border-green-500/40 shadow-lg backdrop-blur-sm">
            <CheckCircle2 className="w-3 h-3 mr-1.5" />
            Bevestigd
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-600 border-red-500/40 shadow-lg backdrop-blur-sm">
            <XCircle className="w-3 h-3 mr-1.5" />
            Geannuleerd
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 border-amber-500/40 shadow-lg backdrop-blur-sm">
            <AlertCircle className="w-3 h-3 mr-1.5" />
            In behandeling
          </Badge>
        )
    }
  }

  const stats = useMemo(() => {
    const upcoming = reservations.filter((r) => {
      const resDate = parseISO(r.date)
      return !isPast(resDate) || isToday(resDate)
    }).length

    return {
      total: reservations.length,
      pending: reservations.filter((r) => r.status === "pending").length,
      confirmed: reservations.filter((r) => r.status === "confirmed").length,
      today: reservations.filter((r) => isToday(parseISO(r.date))).length,
      upcoming,
    }
  }, [reservations])

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-slate-400">Authenticeren...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg blur-lg opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-amber-500 to-orange-600 p-2 rounded-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-xs text-slate-400">Massawa Restaurant</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-sm text-slate-300">Live</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-slate-300 hover:text-white hover:bg-red-500/20 border border-slate-700/50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Uitloggen
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Premium Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="col-span-2 md:col-span-1 border-slate-800/50 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 hover:scale-105 hover:border-amber-500/50 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Totaal</CardTitle>
                <BarChart3 className="w-5 h-5 text-amber-500/50 group-hover:text-amber-400 transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-1">{stats.total}</div>
              <p className="text-xs text-slate-500">Reserveringen</p>
            </CardContent>
          </Card>

          <Card className="border-slate-800/50 bg-gradient-to-br from-amber-900/40 to-orange-900/40 backdrop-blur-xl shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 hover:scale-105 hover:border-amber-500/50 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold text-amber-400/70 uppercase tracking-wider">Pending</CardTitle>
                <AlertCircle className="w-5 h-5 text-amber-500/50 group-hover:text-amber-400 transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-400 mb-1">{stats.pending}</div>
              <p className="text-xs text-amber-500/60">Wachten</p>
            </CardContent>
          </Card>

          <Card className="border-slate-800/50 bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-xl shadow-2xl hover:shadow-green-500/20 transition-all duration-500 hover:scale-105 hover:border-green-500/50 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold text-green-400/70 uppercase tracking-wider">Bevestigd</CardTitle>
                <CheckCircle2 className="w-5 h-5 text-green-500/50 group-hover:text-green-400 transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400 mb-1">{stats.confirmed}</div>
              <p className="text-xs text-green-500/60">Goedgekeurd</p>
            </CardContent>
          </Card>

          <Card className="border-slate-800/50 bg-gradient-to-br from-blue-900/40 to-cyan-900/40 backdrop-blur-xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-105 hover:border-blue-500/50 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold text-blue-400/70 uppercase tracking-wider">Vandaag</CardTitle>
                <Calendar className="w-5 h-5 text-blue-500/50 group-hover:text-blue-400 transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400 mb-1">{stats.today}</div>
              <p className="text-xs text-blue-500/60">Vandaag</p>
            </CardContent>
          </Card>

          <Card className="border-slate-800/50 bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-105 hover:border-purple-500/50 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold text-purple-400/70 uppercase tracking-wider">Komend</CardTitle>
                <TrendingUp className="w-5 h-5 text-purple-500/50 group-hover:text-purple-400 transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400 mb-1">{stats.upcoming}</div>
              <p className="text-xs text-purple-500/60">Komend</p>
            </CardContent>
          </Card>
        </div>

        {/* Premium Filters */}
        <Card className="mb-8 border-slate-800/50 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Zoek op naam, email, telefoon..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-amber-500/50 focus:ring-amber-500/20"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-[200px] h-12 bg-slate-800/50 border-slate-700/50 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">Alle statussen</SelectItem>
                  <SelectItem value="pending">In behandeling</SelectItem>
                  <SelectItem value="confirmed">Bevestigd</SelectItem>
                  <SelectItem value="cancelled">Geannuleerd</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full lg:w-[200px] h-12 bg-slate-800/50 border-slate-700/50 text-white focus:border-amber-500/50"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={fetchReservations} 
                  variant="outline" 
                  size="icon" 
                  className="h-12 w-12 bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-white hover:border-amber-500/50"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
                </Button>
                <Button 
                  onClick={exportToCSV} 
                  variant="outline" 
                  size="icon"
                  className="h-12 w-12 bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-white hover:border-amber-500/50"
                >
                  <Download className="w-5 h-5" />
                </Button>
                <Button
                  variant={viewMode === "cards" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("cards")}
                  className={`h-12 w-12 ${viewMode === "cards" ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0" : "bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50"}`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("table")}
                  className={`h-12 w-12 ${viewMode === "table" ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0" : "bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50"}`}
                >
                  <List className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Premium Content */}
        {loading ? (
          <Card className="border-slate-800/50 bg-slate-900/60 backdrop-blur-xl">
            <CardContent className="py-20 text-center">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <RefreshCw className="relative w-16 h-16 animate-spin text-amber-500 mx-auto mb-4" />
              </div>
              <p className="text-slate-400 text-lg">Laden...</p>
            </CardContent>
          </Card>
        ) : filteredReservations.length === 0 ? (
          <Card className="border-slate-800/50 bg-slate-900/60 backdrop-blur-xl border-dashed">
            <CardContent className="py-20 text-center">
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full blur-xl opacity-20"></div>
                <AlertCircle className="relative w-16 h-16 text-slate-500 mx-auto" />
              </div>
              <p className="text-slate-400 text-lg">Geen reserveringen gevonden</p>
            </CardContent>
          </Card>
        ) : viewMode === "table" ? (
          <Card className="overflow-hidden border-slate-800/50 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-b border-slate-700/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Naam</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Datum & Tijd</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Gasten</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Acties</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {filteredReservations.map((reservation) => {
                      const reservationDate = parseISO(reservation.date)
                      return (
                        <tr key={reservation.id} className="hover:bg-slate-800/30 transition-colors group">
                          <td className="px-6 py-4 font-semibold text-white">{reservation.name}</td>
                          <td className="px-6 py-4">
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2 text-slate-300">
                                <Mail className="w-4 h-4 text-slate-500" />
                                <span className="truncate max-w-[200px]">{reservation.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-300">
                                <Phone className="w-4 h-4 text-slate-500" />
                                {reservation.phone}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1 text-sm">
                              <div className="font-medium text-white">{format(reservationDate, "d MMM yyyy", { locale: nl })}</div>
                              <div className="text-slate-400">{reservation.time}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-white font-medium">{reservation.guests}</td>
                          <td className="px-6 py-4">{getStatusBadge(reservation.status)}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {reservation.status !== "confirmed" && (
                                <Button
                                  size="sm"
                                  onClick={() => updateStatus(reservation.id, "confirmed")}
                                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                                  Bevestig
                                </Button>
                              )}
                              {reservation.status === "confirmed" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => sendConfirmationEmail(reservation)}
                                  disabled={sendingEmail === reservation.id}
                                  className="border-slate-700/50 bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
                                >
                                  {sendingEmail === reservation.id ? (
                                    <RefreshCw className="w-4 h-4 mr-1.5 animate-spin" />
                                  ) : (
                                    <Send className="w-4 h-4 mr-1.5" />
                                  )}
                                  Email
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteReservation(reservation.id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReservations.map((reservation, index) => {
              const reservationDate = parseISO(reservation.date)
              const daysUntil = differenceInDays(reservationDate, new Date())

              return (
                <Card
                  key={reservation.id}
                  className={`group border-2 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl ${
                    reservation.status === "confirmed"
                      ? "border-green-500/30 shadow-green-500/10 hover:border-green-500/50"
                      : reservation.status === "cancelled"
                      ? "border-red-500/30 shadow-red-500/10 hover:border-red-500/50"
                      : "border-amber-500/30 shadow-amber-500/10 hover:border-amber-500/50"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardHeader className="pb-4 border-b border-slate-700/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                          {reservation.name}
                        </CardTitle>
                        {getStatusBadge(reservation.status)}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteReservation(reservation.id)}
                        className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/30">
                        <div className="p-2 bg-amber-500/20 rounded-lg">
                          <Calendar className="w-4 h-4 text-amber-400" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{format(reservationDate, "d MMM", { locale: nl })}</div>
                          <div className="text-xs text-slate-400">{format(reservationDate, "yyyy", { locale: nl })}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/30">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <Clock className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{reservation.time}</div>
                          <div className="text-xs text-slate-400">Tijd</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/30">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <Users className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{reservation.guests}</div>
                          <div className="text-xs text-slate-400">Gasten</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/30">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <Mail className="w-4 h-4 text-green-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-white truncate text-xs">{reservation.email}</div>
                          <div className="text-xs text-slate-400">Email</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/30">
                      <div className="p-2 bg-cyan-500/20 rounded-lg">
                        <Phone className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="font-medium text-white truncate">{reservation.phone}</div>
                    </div>

                    {reservation.message && (
                      <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                        <div className="flex items-start gap-3">
                          <MessageSquare className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="font-semibold text-slate-300 mb-1 text-xs uppercase tracking-wider">Verzoek</div>
                            <div className="text-sm text-slate-400 italic line-clamp-2">{reservation.message}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2 border-t border-slate-700/50">
                      {reservation.status !== "confirmed" && (
                        <Button
                          size="sm"
                          onClick={() => updateStatus(reservation.id, "confirmed")}
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Bevestig
                        </Button>
                      )}
                      {reservation.status === "confirmed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => sendConfirmationEmail(reservation)}
                          disabled={sendingEmail === reservation.id}
                          className="flex-1 border-slate-700/50 bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
                        >
                          {sendingEmail === reservation.id ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Verzenden...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Stuur Email
                            </>
                          )}
                        </Button>
                      )}
                      {reservation.status !== "cancelled" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(reservation.id, "cancelled")}
                          className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-500/70 px-3"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
