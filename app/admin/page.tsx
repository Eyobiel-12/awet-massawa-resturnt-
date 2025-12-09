"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
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
  Shield,
  Activity,
  Zap,
  Filter,
  Calendar as CalendarIcon,
  Clock4,
  ArrowRight,
  Sparkles,
  Star,
  Bell,
  BellRing,
  Command,
  Settings,
  FileText,
  FileSpreadsheet,
  Eye,
  Edit,
  Copy,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  SortAsc,
  SortDesc,
  X,
  Check,
  Plus,
  Minus,
  CalendarDays,
  LineChart,
  PieChart,
  MousePointerClick,
  Keyboard,
  Info,
  Play,
  Pause,
} from "lucide-react"
import { format, parseISO, isToday, isPast, differenceInDays, startOfDay, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns"
import { nl } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"
import { Bar, BarChart, Line, LineChart as RechartsLineChart, Pie, PieChart as RechartsPieChart, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from "recharts"

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
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [viewMode, setViewMode] = useState<"cards" | "table" | "kanban" | "calendar" | "analytics">("cards")
  const [sendingEmail, setSendingEmail] = useState<string | null>(null)
  const [selectedReservations, setSelectedReservations] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<"date" | "name" | "created">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [showFilters, setShowFilters] = useState(false)
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: "", to: "" })
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { toast } = useToast()

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for command palette
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setShowCommandPalette(true)
      }
      // Escape to close modals
      if (e.key === "Escape") {
        setShowCommandPalette(false)
        setSelectedReservation(null)
      }
      // Cmd/Ctrl + F for search
      if ((e.metaKey || e.ctrlKey) && e.key === "f") {
        e.preventDefault()
        document.querySelector<HTMLInputElement>('input[placeholder*="Zoek"]')?.focus()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

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
      const response = await fetch(`/api/reservations`)
      const data = await response.json()
      setReservations(data.reservations || [])
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
      if (autoRefresh) {
        const interval = setInterval(fetchReservations, 30000)
        return () => clearInterval(interval)
      }
    }
  }, [authenticated, autoRefresh])

  useEffect(() => {
    if (!isMobile) {
      setMobileFiltersOpen(false)
      return
    }
    if (["table", "kanban", "analytics"].includes(viewMode)) {
      setViewMode("cards")
    }
  }, [isMobile, viewMode])

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
        // Trigger confetti effect
        triggerConfetti()
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

  const triggerConfetti = () => {
    // Simple confetti effect using CSS
    const confetti = document.createElement("div")
    confetti.className = "fixed inset-0 pointer-events-none z-50"
    confetti.innerHTML = Array.from({ length: 50 }, (_, i) => {
      const colors = ["#f59e0b", "#ef4444", "#10b981", "#3b82f6", "#8b5cf6"]
      const color = colors[Math.floor(Math.random() * colors.length)]
      const left = Math.random() * 100
      const delay = Math.random() * 0.5
      const duration = 1 + Math.random() * 2
      return `<div class="absolute w-2 h-2 rounded-full" style="left: ${left}%; top: -10px; background: ${color}; animation: confetti-fall ${duration}s ease-out ${delay}s forwards;"></div>`
    }).join("")
    document.body.appendChild(confetti)
    setTimeout(() => confetti.remove(), 3000)
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
        if (status === "confirmed") {
          triggerConfetti()
        }
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "❌ Fout",
        description: "Kon status niet updaten",
      })
    }
  }

  const bulkUpdateStatus = async (status: "pending" | "confirmed" | "cancelled") => {
    if (selectedReservations.size === 0) return

    try {
      const promises = Array.from(selectedReservations).map((id) =>
        fetch("/api/reservations", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status }),
        })
      )

      await Promise.all(promises)
      fetchReservations()
      setSelectedReservations(new Set())
      toast({
        title: "✅ Bulk update",
        description: `${selectedReservations.size} reserveringen zijn ${status === "confirmed" ? "bevestigd" : status === "cancelled" ? "geannuleerd" : "teruggezet"}`,
      })
    } catch (error) {
      console.error("Error bulk updating:", error)
      toast({
        title: "❌ Fout",
        description: "Kon reserveringen niet updaten",
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

  const bulkDelete = async () => {
    if (selectedReservations.size === 0) return
    if (!confirm(`Weet je zeker dat je ${selectedReservations.size} reserveringen wilt verwijderen?`)) return

    try {
      const promises = Array.from(selectedReservations).map((id) =>
        fetch(`/api/reservations?id=${id}`, { method: "DELETE" })
      )

      await Promise.all(promises)
      fetchReservations()
      setSelectedReservations(new Set())
      toast({
        title: "✅ Verwijderd",
        description: `${selectedReservations.size} reserveringen zijn verwijderd`,
      })
    } catch (error) {
      console.error("Error bulk deleting:", error)
      toast({
        title: "❌ Fout",
        description: "Kon reserveringen niet verwijderen",
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "✅ Gekopieerd",
      description: "Naar klembord gekopieerd",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/40 shadow-lg backdrop-blur-sm">
            <CheckCircle2 className="w-3 h-3 mr-1.5" />
            Bevestigd
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-400 border-red-500/40 shadow-lg backdrop-blur-sm">
            <XCircle className="w-3 h-3 mr-1.5" />
            Geannuleerd
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/40 shadow-lg backdrop-blur-sm animate-pulse">
            <AlertCircle className="w-3 h-3 mr-1.5" />
            In behandeling
          </Badge>
        )
    }
  }

  // Filter and sort reservations
  const filteredReservations = useMemo(() => {
    let filtered = reservations

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter((r) => r.status === activeTab)
    }

    // Filter by search
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(term) ||
          r.email.toLowerCase().includes(term) ||
          r.phone.includes(term) ||
          r.message.toLowerCase().includes(term)
      )
    }

    // Filter by date range
    if (dateRange.from && dateRange.to) {
      filtered = filtered.filter((r) => {
        const resDate = r.date
        return resDate >= dateRange.from && resDate <= dateRange.to
      })
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0
      if (sortBy === "date") {
        const dateA = new Date(`${a.date}T${a.time}`)
        const dateB = new Date(`${b.date}T${b.time}`)
        comparison = dateA.getTime() - dateB.getTime()
      } else if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name)
      } else if (sortBy === "created") {
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [reservations, activeTab, searchTerm, dateRange, sortBy, sortOrder])

  const stats = useMemo(() => {
    const today = startOfDay(new Date())
    const upcoming = reservations.filter((r) => {
      const resDate = parseISO(r.date)
      return resDate >= today
    }).length

    const past = reservations.filter((r) => {
      const resDate = parseISO(r.date)
      return resDate < today
    }).length

    return {
      total: reservations.length,
      pending: reservations.filter((r) => r.status === "pending").length,
      confirmed: reservations.filter((r) => r.status === "confirmed").length,
      cancelled: reservations.filter((r) => r.status === "cancelled").length,
      today: reservations.filter((r) => isToday(parseISO(r.date))).length,
      upcoming,
      past,
    }
  }, [reservations])

  // Chart data
  const chartData = useMemo(() => {
    const last7Days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date(),
    })

    return last7Days.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd")
      return {
        date: format(day, "d MMM", { locale: nl }),
        Bevestigd: reservations.filter(
          (r) => r.status === "confirmed" && r.date === dayStr
        ).length,
        Wachten: reservations.filter(
          (r) => r.status === "pending" && r.date === dayStr
        ).length,
        Geannuleerd: reservations.filter(
          (r) => r.status === "cancelled" && r.date === dayStr
        ).length,
      }
    })
  }, [reservations])

  const statusChartData = [
    { name: "Bevestigd", value: stats.confirmed, color: "#10b981" },
    { name: "Wachten", value: stats.pending, color: "#f59e0b" },
    { name: "Geannuleerd", value: stats.cancelled, color: "#ef4444" },
  ]

  const advancedFiltersContent = (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="flex items-center gap-2">
        <label className="text-sm text-slate-400 whitespace-nowrap">Sorteer op:</label>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as "date" | "name" | "created")}>
          <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="date">Datum</SelectItem>
            <SelectItem value="name">Naam</SelectItem>
            <SelectItem value="created">Aangemaakt</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="text-slate-400 hover:text-white"
        >
          {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
        </Button>
      </div>
      <Input
        type="date"
        placeholder="Van datum"
        value={dateRange.from}
        onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
        className="bg-slate-800/50 border-slate-700/50 text-white"
      />
      <Input
        type="date"
        placeholder="Tot datum"
        value={dateRange.to}
        onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
        className="bg-slate-800/50 border-slate-700/50 text-white"
      />
      <Button
        variant="outline"
        onClick={() => setDateRange({ from: "", to: "" })}
        className="bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50"
      >
        <X className="w-4 h-4 mr-2" />
        Reset
      </Button>
    </div>
  )

  const bulkActionsContent =
    selectedReservations.size > 0 ? (
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40">
          {selectedReservations.size} geselecteerd
        </Badge>
        <Button
          size="sm"
          onClick={() => bulkUpdateStatus("confirmed")}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Bevestig alle
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => bulkUpdateStatus("cancelled")}
          className="border-red-500/50 text-red-400 hover:bg-red-500/20"
        >
          <XCircle className="w-4 h-4 mr-2" />
          Annuleer alle
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={bulkDelete}
          className="border-red-500/50 text-red-400 hover:bg-red-500/20"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Verwijder alle
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setSelectedReservations(new Set())}
          className="text-slate-400"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    ) : null

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedReservations)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    setSelectedReservations(newSelection)
  }

  const selectAll = () => {
    if (selectedReservations.size === filteredReservations.length) {
      setSelectedReservations(new Set())
    } else {
      setSelectedReservations(new Set(filteredReservations.map((r) => r.id)))
    }
  }

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
      {/* Premium Animated Header */}
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
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent animate-gradient">
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
                onClick={() => setAutoRefresh(!autoRefresh)}
                variant="ghost"
                size="icon"
                className="text-slate-300 hover:text-white hover:bg-slate-700/50"
                title={autoRefresh ? "Auto-refresh aan" : "Auto-refresh uit"}
              >
                {autoRefresh ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
              <Button
                onClick={() => setShowCommandPalette(true)}
                variant="ghost"
                className="hidden md:flex items-center gap-2 text-slate-300 hover:text-white hover:bg-slate-700/50 border border-slate-700/50"
              >
                <Command className="w-4 h-4" />
                <span className="text-sm">⌘K</span>
              </Button>
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
        {/* Advanced Stats Grid with Animations */}
        <div className="-mx-2 mb-8 overflow-x-auto pb-4 md:mx-0">
          <div className="min-w-[680px] grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
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

          <Card className="border-slate-800/50 bg-gradient-to-br from-amber-900/40 to-orange-900/40 backdrop-blur-xl shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 hover:scale-105 hover:border-amber-500/50 group cursor-pointer" onClick={() => setActiveTab("pending")}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold text-amber-400/70 uppercase tracking-wider">Wachten</CardTitle>
                <BellRing className="w-5 h-5 text-amber-500/50 group-hover:text-amber-400 transition-colors animate-pulse" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-400 mb-1">{stats.pending}</div>
              <p className="text-xs text-amber-500/60">Op actie</p>
            </CardContent>
          </Card>

          <Card className="border-slate-800/50 bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-xl shadow-2xl hover:shadow-green-500/20 transition-all duration-500 hover:scale-105 hover:border-green-500/50 group cursor-pointer" onClick={() => setActiveTab("confirmed")}>
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

          <Card className="border-slate-800/50 bg-gradient-to-br from-red-900/40 to-rose-900/40 backdrop-blur-xl shadow-2xl hover:shadow-red-500/20 transition-all duration-500 hover:scale-105 hover:border-red-500/50 group cursor-pointer" onClick={() => setActiveTab("cancelled")}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold text-red-400/70 uppercase tracking-wider">Geannuleerd</CardTitle>
                <XCircle className="w-5 h-5 text-red-500/50 group-hover:text-red-400 transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-400 mb-1">{stats.cancelled}</div>
              <p className="text-xs text-red-500/60">Afgewezen</p>
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
              <p className="text-xs text-purple-500/60">Toekomst</p>
            </CardContent>
          </Card>

          <Card className="border-slate-800/50 bg-gradient-to-br from-slate-800/40 to-slate-700/40 backdrop-blur-xl shadow-2xl hover:shadow-slate-500/20 transition-all duration-500 hover:scale-105 hover:border-slate-500/50 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold text-slate-400/70 uppercase tracking-wider">Verlopen</CardTitle>
                <Clock4 className="w-5 h-5 text-slate-500/50 group-hover:text-slate-400 transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-400 mb-1">{stats.past}</div>
              <p className="text-xs text-slate-500/60">Voorbij</p>
            </CardContent>
          </Card>
        </div>
        </div>

        {/* Advanced Search and Filters */}
        <Card className="mb-6 border-slate-800/50 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-6">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    placeholder="Zoek op naam, email, telefoon, bericht... (⌘F)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-amber-500/50 focus:ring-amber-500/20"
                  />
                </div>
                <div className="flex flex-wrap gap-2 md:flex-nowrap md:justify-end">
                  {isMobile ? (
                    <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                      <SheetTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-12 bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 flex-1 md:flex-none"
                        >
                          <Filter className="w-4 h-4 mr-2" />
                          Filters
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="bottom" className="bg-slate-900/95 border-t border-slate-800 text-white">
                        <SheetHeader className="pb-0">
                          <SheetTitle>Filters & sortering</SheetTitle>
                          <SheetDescription>Pas de resultaten aan voor dit apparaat</SheetDescription>
                        </SheetHeader>
                        <div className="space-y-6 p-4 pt-0">
                          {advancedFiltersContent}
                          {bulkActionsContent && (
                            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-4 space-y-3">
                              {bulkActionsContent}
                            </div>
                          )}
                        </div>
                      </SheetContent>
                    </Sheet>
                  ) : (
                    <Button
                      onClick={() => setShowFilters(!showFilters)}
                      variant="outline"
                      className="h-12 bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                      {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                    </Button>
                  )}
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
                </div>
              </div>

              {!isMobile && showFilters && (
                <div className="pt-4 border-t border-slate-700/50 animate-fade-in">{advancedFiltersContent}</div>
              )}

              {!isMobile && bulkActionsContent && (
                <div className="pt-4 border-t border-slate-700/50 animate-fade-in">{bulkActionsContent}</div>
              )}

              {/* View Mode Toggle */}
              <div className="flex flex-col gap-3 pt-4 border-t border-slate-700/50 md:flex-row md:items-center md:justify-between">
                <div className="flex w-full flex-wrap gap-2 overflow-x-auto md:w-auto">
                  <Button
                    variant={viewMode === "cards" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("cards")}
                    className={viewMode === "cards" ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0" : "bg-slate-800/50 border-slate-700/50 text-slate-300"}
                  >
                    <Grid3x3 className="w-4 h-4 mr-2" />
                    Cards
                  </Button>
                  <Button
                    variant={viewMode === "table" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                    className={viewMode === "table" ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0" : "bg-slate-800/50 border-slate-700/50 text-slate-300"}
                  >
                    <List className="w-4 h-4 mr-2" />
                    Tabel
                  </Button>
                  <Button
                    variant={viewMode === "kanban" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("kanban")}
                    className={viewMode === "kanban" ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0" : "bg-slate-800/50 border-slate-700/50 text-slate-300"}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Kanban
                  </Button>
                  <Button
                    variant={viewMode === "calendar" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("calendar")}
                    className={viewMode === "calendar" ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0" : "bg-slate-800/50 border-slate-700/50 text-slate-300"}
                  >
                    <CalendarDays className="w-4 h-4 mr-2" />
                    Kalender
                  </Button>
                  <Button
                    variant={viewMode === "analytics" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("analytics")}
                    className={viewMode === "analytics" ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0" : "bg-slate-800/50 border-slate-700/50 text-slate-300"}
                  >
                    <LineChart className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                </div>
                <div className="text-xs text-slate-500">
                  {filteredReservations.length} van {reservations.length} reserveringen
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Tabs Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 p-1 rounded-lg">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white text-slate-400 transition-all duration-300"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Alle ({stats.total})
            </TabsTrigger>
            <TabsTrigger 
              value="pending"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white text-slate-400 transition-all duration-300"
            >
              <BellRing className="w-4 h-4 mr-2" />
              Wachten ({stats.pending})
            </TabsTrigger>
            <TabsTrigger 
              value="confirmed"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white text-slate-400 transition-all duration-300"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Bevestigd ({stats.confirmed})
            </TabsTrigger>
            <TabsTrigger 
              value="cancelled"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-rose-500 data-[state=active]:text-white text-slate-400 transition-all duration-300"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Geannuleerd ({stats.cancelled})
            </TabsTrigger>
          </TabsList>

          {/* Content for each tab */}
          {["all", "pending", "confirmed", "cancelled"].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-0">
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
                    {searchTerm && (
                      <p className="text-slate-500 text-sm mt-2">Probeer een andere zoekterm</p>
                    )}
                  </CardContent>
                </Card>
              ) : viewMode === "analytics" ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-slate-800/50 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
                    <CardHeader>
                      <CardTitle className="text-white">Reserveringen Over Tijd</CardTitle>
                      <CardDescription className="text-slate-400">Laatste 7 dagen</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={{
                        Bevestigd: { label: "Bevestigd", color: "#10b981" },
                        Wachten: { label: "Wachten", color: "#f59e0b" },
                        Geannuleerd: { label: "Geannuleerd", color: "#ef4444" },
                      }}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="date" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Bar dataKey="Bevestigd" fill="#10b981" radius={[8, 8, 0, 0]} />
                          <Bar dataKey="Wachten" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                          <Bar dataKey="Geannuleerd" fill="#ef4444" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-800/50 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
                    <CardHeader>
                      <CardTitle className="text-white">Status Verdeling</CardTitle>
                      <CardDescription className="text-slate-400">Overzicht per status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={{
                        Bevestigd: { label: "Bevestigd", color: "#10b981" },
                        Wachten: { label: "Wachten", color: "#f59e0b" },
                        Geannuleerd: { label: "Geannuleerd", color: "#ef4444" },
                      }}>
                        <RechartsPieChart>
                          <Pie
                            data={statusChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {statusChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </RechartsPieChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-2 border-slate-800/50 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
                    <CardHeader>
                      <CardTitle className="text-white">Trend Lijn</CardTitle>
                      <CardDescription className="text-slate-400">Reserveringen trend laatste 7 dagen</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={{
                        Bevestigd: { label: "Bevestigd", color: "#10b981" },
                        Wachten: { label: "Wachten", color: "#f59e0b" },
                        Geannuleerd: { label: "Geannuleerd", color: "#ef4444" },
                      }}>
                        <RechartsLineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="date" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Line type="monotone" dataKey="Bevestigd" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981" }} />
                          <Line type="monotone" dataKey="Wachten" stroke="#f59e0b" strokeWidth={2} dot={{ fill: "#f59e0b" }} />
                          <Line type="monotone" dataKey="Geannuleerd" stroke="#ef4444" strokeWidth={2} dot={{ fill: "#ef4444" }} />
                        </RechartsLineChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>
              ) : viewMode === "calendar" ? (
                <Card className="border-slate-800/50 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-white">Kalender Overzicht</CardTitle>
                    <CardDescription className="text-slate-400">Reserveringen per dag</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-2">
                      {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((day) => (
                        <div key={day} className="text-center text-sm font-semibold text-slate-400 py-2">
                          {day}
                        </div>
                      ))}
                      {Array.from({ length: 35 }).map((_, i) => {
                        const date = new Date()
                        date.setDate(date.getDate() - date.getDay() + i)
                        const dateStr = format(date, "yyyy-MM-dd")
                        const dayReservations = filteredReservations.filter((r) => r.date === dateStr)
                        const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")

                        return (
                          <div
                            key={i}
                            className={`p-2 rounded-lg border-2 min-h-[80px] ${
                              isToday
                                ? "border-amber-500/50 bg-amber-500/10"
                                : "border-slate-700/30 bg-slate-800/30"
                            }`}
                          >
                            <div className={`text-xs font-semibold mb-1 ${isToday ? "text-amber-400" : "text-slate-400"}`}>
                              {format(date, "d")}
                            </div>
                            {dayReservations.length > 0 && (
                              <div className="space-y-1">
                                {dayReservations.slice(0, 2).map((r) => (
                                  <div
                                    key={r.id}
                                    className={`text-xs p-1 rounded ${
                                      r.status === "confirmed"
                                        ? "bg-green-500/20 text-green-400"
                                        : r.status === "cancelled"
                                        ? "bg-red-500/20 text-red-400"
                                        : "bg-amber-500/20 text-amber-400"
                                    } cursor-pointer hover:opacity-80`}
                                    onClick={() => setSelectedReservation(r)}
                                  >
                                    {r.time} - {r.name}
                                  </div>
                                ))}
                                {dayReservations.length > 2 && (
                                  <div className="text-xs text-slate-500">
                                    +{dayReservations.length - 2} meer
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              ) : viewMode === "kanban" ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Pending Column */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-900/40 to-orange-900/40 rounded-lg border border-amber-500/30">
                      <div className="flex items-center gap-2">
                        <BellRing className="w-5 h-5 text-amber-400 animate-pulse" />
                        <h3 className="font-bold text-amber-400">Wachten</h3>
                      </div>
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40">
                        {filteredReservations.filter((r) => r.status === "pending").length}
                      </Badge>
                    </div>
                    <div className="space-y-3 min-h-[400px]">
                      {filteredReservations
                        .filter((r) => r.status === "pending")
                        .map((reservation, index) => (
                          <ReservationKanbanCard
                            key={reservation.id}
                            reservation={reservation}
                            index={index}
                            onConfirm={() => updateStatus(reservation.id, "confirmed")}
                            onCancel={() => updateStatus(reservation.id, "cancelled")}
                            onDelete={() => deleteReservation(reservation.id)}
                            onSendEmail={() => sendConfirmationEmail(reservation)}
                            sendingEmail={sendingEmail === reservation.id}
                            onView={() => setSelectedReservation(reservation)}
                            isSelected={selectedReservations.has(reservation.id)}
                            onToggleSelect={() => toggleSelection(reservation.id)}
                          />
                        ))}
                    </div>
                  </div>

                  {/* Confirmed Column */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-900/40 to-emerald-900/40 rounded-lg border border-green-500/30">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                        <h3 className="font-bold text-green-400">Bevestigd</h3>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/40">
                        {filteredReservations.filter((r) => r.status === "confirmed").length}
                      </Badge>
                    </div>
                    <div className="space-y-3 min-h-[400px]">
                      {filteredReservations
                        .filter((r) => r.status === "confirmed")
                        .map((reservation, index) => (
                          <ReservationKanbanCard
                            key={reservation.id}
                            reservation={reservation}
                            index={index}
                            onConfirm={() => updateStatus(reservation.id, "confirmed")}
                            onCancel={() => updateStatus(reservation.id, "cancelled")}
                            onDelete={() => deleteReservation(reservation.id)}
                            onSendEmail={() => sendConfirmationEmail(reservation)}
                            sendingEmail={sendingEmail === reservation.id}
                            onView={() => setSelectedReservation(reservation)}
                            isSelected={selectedReservations.has(reservation.id)}
                            onToggleSelect={() => toggleSelection(reservation.id)}
                          />
                        ))}
                    </div>
                  </div>

                  {/* Cancelled Column */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-900/40 to-rose-900/40 rounded-lg border border-red-500/30">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-400" />
                        <h3 className="font-bold text-red-400">Geannuleerd</h3>
                      </div>
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/40">
                        {filteredReservations.filter((r) => r.status === "cancelled").length}
                      </Badge>
                    </div>
                    <div className="space-y-3 min-h-[400px]">
                      {filteredReservations
                        .filter((r) => r.status === "cancelled")
                        .map((reservation, index) => (
                          <ReservationKanbanCard
                            key={reservation.id}
                            reservation={reservation}
                            index={index}
                            onConfirm={() => updateStatus(reservation.id, "confirmed")}
                            onCancel={() => updateStatus(reservation.id, "cancelled")}
                            onDelete={() => deleteReservation(reservation.id)}
                            onSendEmail={() => sendConfirmationEmail(reservation)}
                            sendingEmail={sendingEmail === reservation.id}
                            onView={() => setSelectedReservation(reservation)}
                            isSelected={selectedReservations.has(reservation.id)}
                            onToggleSelect={() => toggleSelection(reservation.id)}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              ) : viewMode === "table" ? (
                <Card className="overflow-hidden border-slate-800/50 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-b border-slate-700/50">
                          <tr>
                            <th className="px-6 py-4 text-left">
                              <input
                                type="checkbox"
                                checked={selectedReservations.size === filteredReservations.length && filteredReservations.length > 0}
                                onChange={selectAll}
                                className="rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500"
                              />
                            </th>
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
                              <tr 
                                key={reservation.id} 
                                className={`hover:bg-slate-800/30 transition-colors group ${
                                  selectedReservations.has(reservation.id) ? "bg-amber-500/10" : ""
                                }`}
                              >
                                <td className="px-6 py-4">
                                  <input
                                    type="checkbox"
                                    checked={selectedReservations.has(reservation.id)}
                                    onChange={() => toggleSelection(reservation.id)}
                                    className="rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500"
                                  />
                                </td>
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
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => setSelectedReservation(reservation)}
                                      className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
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
                    const isUrgent = daysUntil <= 1 && reservation.status === "pending"

                    return (
                      <Card
                        key={reservation.id}
                        className={`group border-2 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl cursor-pointer ${
                          reservation.status === "confirmed"
                            ? "border-green-500/30 shadow-green-500/10 hover:border-green-500/50"
                            : reservation.status === "cancelled"
                            ? "border-red-500/30 shadow-red-500/10 hover:border-red-500/50"
                            : isUrgent
                            ? "border-amber-500/50 shadow-amber-500/20 hover:border-amber-500/70 animate-pulse"
                            : "border-amber-500/30 shadow-amber-500/10 hover:border-amber-500/50"
                        } ${selectedReservations.has(reservation.id) ? "ring-2 ring-amber-500" : ""}`}
                        style={{ animationDelay: `${index * 50}ms` }}
                        onClick={() => setSelectedReservation(reservation)}
                      >
                        {isUrgent && (
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-bounce z-10">
                            <Zap className="w-3 h-3 inline mr-1" />
                            Urgent!
                          </div>
                        )}
                        <CardHeader className="pb-4 border-b border-slate-700/50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <input
                                  type="checkbox"
                                  checked={selectedReservations.has(reservation.id)}
                                  onChange={(e) => {
                                    e.stopPropagation()
                                    toggleSelection(reservation.id)
                                  }}
                                  className="rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500"
                                />
                                <CardTitle className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                                  {reservation.name}
                                </CardTitle>
                              </div>
                              {getStatusBadge(reservation.status)}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteReservation(reservation.id)
                              }}
                              className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/30 hover:border-amber-500/50 transition-colors">
                              <div className="p-2 bg-amber-500/20 rounded-lg">
                                <Calendar className="w-4 h-4 text-amber-400" />
                              </div>
                              <div>
                                <div className="font-semibold text-white">{format(reservationDate, "d MMM", { locale: nl })}</div>
                                <div className="text-xs text-slate-400">{format(reservationDate, "yyyy", { locale: nl })}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/30 hover:border-blue-500/50 transition-colors">
                              <div className="p-2 bg-blue-500/20 rounded-lg">
                                <Clock className="w-4 h-4 text-blue-400" />
                              </div>
                              <div>
                                <div className="font-semibold text-white">{reservation.time}</div>
                                <div className="text-xs text-slate-400">Tijd</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/30 hover:border-purple-500/50 transition-colors">
                              <div className="p-2 bg-purple-500/20 rounded-lg">
                                <Users className="w-4 h-4 text-purple-400" />
                              </div>
                              <div>
                                <div className="font-semibold text-white">{reservation.guests}</div>
                                <div className="text-xs text-slate-400">Gasten</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/30 hover:border-green-500/50 transition-colors">
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
                            <div className="font-medium text-white truncate flex-1">{reservation.phone}</div>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                copyToClipboard(reservation.phone)
                              }}
                              className="h-6 w-6 text-slate-400 hover:text-white"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
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
                                onClick={(e) => {
                                  e.stopPropagation()
                                  updateStatus(reservation.id, "confirmed")
                                }}
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
                                onClick={(e) => {
                                  e.stopPropagation()
                                  sendConfirmationEmail(reservation)
                                }}
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
                                onClick={(e) => {
                                  e.stopPropagation()
                                  updateStatus(reservation.id, "cancelled")
                                }}
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
            </TabsContent>
          ))}
        </Tabs>

        {isMobile && bulkActionsContent && (
          <div className="md:hidden fixed bottom-4 inset-x-4 z-40">
            <Card className="border-slate-800/80 bg-slate-950/90 backdrop-blur-xl shadow-2xl">
              <CardContent className="space-y-3">{bulkActionsContent}</CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Command Palette */}
      {showCommandPalette && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-32" onClick={() => setShowCommandPalette(false)}>
          <div className="w-full max-w-2xl mx-4" onClick={(e) => e.stopPropagation()}>
            <Card className="border-slate-800/50 bg-slate-900/95 backdrop-blur-xl shadow-2xl">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Command className="w-5 h-5 text-amber-400" />
                  <CardTitle className="text-white">Command Palette</CardTitle>
                </div>
                <CardDescription className="text-slate-400">Druk Escape om te sluiten</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <CommandItem icon={<Search />} label="Zoeken" shortcut="⌘F" onClick={() => {
                    setShowCommandPalette(false)
                    document.querySelector<HTMLInputElement>('input[placeholder*="Zoek"]')?.focus()
                  }} />
                  <CommandItem icon={<BarChart3 />} label="Analytics weergave" shortcut="" onClick={() => {
                    setViewMode("analytics")
                    setShowCommandPalette(false)
                  }} />
                  <CommandItem icon={<CalendarDays />} label="Kalender weergave" shortcut="" onClick={() => {
                    setViewMode("calendar")
                    setShowCommandPalette(false)
                  }} />
                  <CommandItem icon={<Grid3x3 />} label="Cards weergave" shortcut="" onClick={() => {
                    setViewMode("cards")
                    setShowCommandPalette(false)
                  }} />
                  <CommandItem icon={<Download />} label="Exporteer CSV" shortcut="" onClick={() => {
                    exportToCSV()
                    setShowCommandPalette(false)
                  }} />
                  <CommandItem icon={<RefreshCw />} label="Vernieuw data" shortcut="" onClick={() => {
                    fetchReservations()
                    setShowCommandPalette(false)
                  }} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Reservation Detail Dialog */}
      {selectedReservation && (
        <Dialog open={!!selectedReservation} onOpenChange={() => setSelectedReservation(null)}>
          <DialogContent className="max-w-2xl bg-slate-900 border-slate-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white">{selectedReservation.name}</DialogTitle>
              <DialogDescription className="text-slate-400">
                Volledige reservering details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/30">
                  <div className="text-xs text-slate-400 mb-1">Datum</div>
                  <div className="text-white font-semibold">{format(parseISO(selectedReservation.date), "d MMMM yyyy", { locale: nl })}</div>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/30">
                  <div className="text-xs text-slate-400 mb-1">Tijd</div>
                  <div className="text-white font-semibold">{selectedReservation.time}</div>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/30">
                  <div className="text-xs text-slate-400 mb-1">Gasten</div>
                  <div className="text-white font-semibold">{selectedReservation.guests}</div>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/30">
                  <div className="text-xs text-slate-400 mb-1">Status</div>
                  <div>{getStatusBadge(selectedReservation.status)}</div>
                </div>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/30">
                <div className="text-xs text-slate-400 mb-2">Email</div>
                <div className="flex items-center justify-between">
                  <div className="text-white">{selectedReservation.email}</div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(selectedReservation.email)}
                    className="text-slate-400 hover:text-white"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/30">
                <div className="text-xs text-slate-400 mb-2">Telefoon</div>
                <div className="flex items-center justify-between">
                  <div className="text-white">{selectedReservation.phone}</div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(selectedReservation.phone)}
                    className="text-slate-400 hover:text-white"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {selectedReservation.message && (
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/30">
                  <div className="text-xs text-slate-400 mb-2">Speciale Verzoeken</div>
                  <div className="text-white">{selectedReservation.message}</div>
                </div>
              )}
              <div className="flex gap-2 pt-4">
                {selectedReservation.status !== "confirmed" && (
                  <Button
                    onClick={() => {
                      updateStatus(selectedReservation.id, "confirmed")
                      setSelectedReservation(null)
                    }}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Bevestig
                  </Button>
                )}
                {selectedReservation.status === "confirmed" && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      sendConfirmationEmail(selectedReservation)
                    }}
                    disabled={sendingEmail === selectedReservation.id}
                    className="flex-1 border-slate-700/50 bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
                  >
                    {sendingEmail === selectedReservation.id ? (
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
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedReservation(null)
                  }}
                  className="border-slate-700/50 bg-slate-800/50 text-slate-300"
                >
                  Sluiten
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Kanban Card Component
function ReservationKanbanCard({
  reservation,
  index,
  onConfirm,
  onCancel,
  onDelete,
  onSendEmail,
  sendingEmail,
  onView,
  isSelected,
  onToggleSelect,
}: {
  reservation: Reservation
  index: number
  onConfirm: () => void
  onCancel: () => void
  onDelete: () => void
  onSendEmail: () => void
  sendingEmail: boolean
  onView: () => void
  isSelected: boolean
  onToggleSelect: () => void
}) {
  const reservationDate = parseISO(reservation.date)
  const daysUntil = differenceInDays(reservationDate, new Date())
  const isUrgent = daysUntil <= 1 && reservation.status === "pending"

  return (
    <Card
      className={`group border-2 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl cursor-move ${
        reservation.status === "confirmed"
          ? "border-green-500/30 shadow-green-500/10"
          : reservation.status === "cancelled"
          ? "border-red-500/30 shadow-red-500/10"
          : isUrgent
          ? "border-amber-500/50 shadow-amber-500/20 animate-pulse"
          : "border-amber-500/30 shadow-amber-500/10"
      } ${isSelected ? "ring-2 ring-amber-500" : ""}`}
      style={{ animationDelay: `${index * 30}ms` }}
      onClick={onView}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                  e.stopPropagation()
                  onToggleSelect()
                }}
                className="rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500"
              />
              <CardTitle className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                {reservation.name}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Calendar className="w-3 h-3" />
              {format(reservationDate, "d MMM", { locale: nl })} om {reservation.time}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="h-6 w-6 text-slate-400 hover:text-red-400 hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-slate-500" />
          <span className="text-white">{reservation.guests} gasten</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Mail className="w-4 h-4 text-slate-500" />
          <span className="text-slate-300 truncate text-xs">{reservation.email}</span>
        </div>
        <div className="flex gap-2 pt-2 border-t border-slate-700/50">
          {reservation.status !== "confirmed" && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onConfirm()
              }}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-xs"
            >
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Bevestig
            </Button>
          )}
          {reservation.status === "confirmed" && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                onSendEmail()
              }}
              disabled={sendingEmail}
              className="flex-1 border-slate-700/50 bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 text-xs"
            >
              {sendingEmail ? (
                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
              ) : (
                <Send className="w-3 h-3 mr-1" />
              )}
              Email
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Command Item Component
function CommandItem({
  icon,
  label,
  shortcut,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  shortcut: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/50 transition-colors text-left group"
    >
      <div className="flex items-center gap-3">
        <div className="text-slate-400 group-hover:text-amber-400 transition-colors">
          {icon}
        </div>
        <span className="text-white">{label}</span>
      </div>
      {shortcut && (
        <kbd className="px-2 py-1 text-xs bg-slate-800 border border-slate-700 rounded text-slate-400">
          {shortcut}
        </kbd>
      )}
    </button>
  )
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const mediaQuery = window.matchMedia(query)
    const handler = () => setMatches(mediaQuery.matches)

    handler()
    mediaQuery.addEventListener("change", handler)

    return () => mediaQuery.removeEventListener("change", handler)
  }, [query])

  return matches
}
