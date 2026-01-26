"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Calendar,
  Clock,
  Users,
  Mail,
  Phone,
  User,
  MessageSquare,
  Sparkles,
  Check,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import emailjs from "@emailjs/browser"

export function Reservation() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "",
    message: "",
  })

  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [completedFields, setCompletedFields] = useState<Set<string>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Restaurant business hours
  const BUSINESS_HOURS = {
    open: "17:00",
    close: "23:00",
    kitchenClose: "22:00",
    closedDays: [] // Open 7 days a week
  }

  // Validation functions
  const validateDate = (date: string): string => {
    if (!date) return "Datum is verplicht"
    
    const selectedDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (selectedDate < today) {
      return "Je kunt geen reservering maken voor een datum in het verleden"
    }
    
    // Check if date is more than 7 days in the future
    const maxDate = new Date(today)
    maxDate.setDate(maxDate.getDate() + 7)
    maxDate.setHours(23, 59, 59, 999)
    
    if (selectedDate > maxDate) {
      return "Reserveringen kunnen alleen worden gemaakt voor de komende 7 dagen"
    }
    
    // Restaurant is open 7 days a week - no closed days check needed
    
    // Check if booking is at least 2 hours in advance
    const now = new Date()
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000)
    
    if (selectedDate.getTime() === today.getTime() && now.getHours() >= 15) {
      return "Voor reserveringen vandaag moet je minimaal 2 uur van tevoren boeken"
    }
    
    return ""
  }

  const validateTime = (time: string, date: string): string => {
    if (!time) return "Tijd is verplicht"
    if (!date) return "Selecteer eerst een datum"
    
    const [hours, minutes] = time.split(':').map(Number)
    const [openHours, openMinutes] = BUSINESS_HOURS.open.split(':').map(Number)
    const [closeHours, closeMinutes] = BUSINESS_HOURS.close.split(':').map(Number)
    const [kitchenCloseHours, kitchenCloseMinutes] = BUSINESS_HOURS.kitchenClose.split(':').map(Number)
    
    const selectedTime = hours * 60 + minutes
    const openTime = openHours * 60 + openMinutes
    const closeTime = closeHours * 60 + closeMinutes
    const kitchenCloseTime = kitchenCloseHours * 60 + kitchenCloseMinutes
    
    if (selectedTime < openTime) {
      return `Het restaurant opent om ${BUSINESS_HOURS.open}`
    }
    
    if (selectedTime >= closeTime) {
      return `Het restaurant sluit om ${BUSINESS_HOURS.close}`
    }
    
    if (selectedTime >= kitchenCloseTime) {
      return `De keuken sluit om ${BUSINESS_HOURS.kitchenClose}. Kies een eerdere tijd.`
    }
    
    // Check if it's today and time has passed
    const selectedDate = new Date(date)
    const today = new Date()
    
    if (selectedDate.getTime() === today.getTime()) {
      const now = new Date()
      const currentTime = now.getHours() * 60 + now.getMinutes()
      
      if (selectedTime <= currentTime) {
        return "Deze tijd is al verstreken. Kies een latere tijd."
      }
    }
    
    return ""
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    
    // Basic validations
    if (!formData.name.trim()) errors.name = "Naam is verplicht"
    if (!formData.email.trim()) errors.email = "Email is verplicht"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Voer een geldig email adres in"
    }
    if (!formData.phone.trim()) errors.phone = "Telefoonnummer is verplicht"
    if (!formData.guests) errors.guests = "Aantal gasten is verplicht"
    
    // Date and time validations
    const dateError = validateDate(formData.date)
    if (dateError) errors.date = dateError
    
    const timeError = validateTime(formData.time, formData.date)
    if (timeError) errors.time = timeError
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form before submission
    if (!validateForm()) {
      setIsSubmitting(false)
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage("")
    setValidationErrors({})

    try {
      emailjs.init("2ZQ3WgKUpnfTZho4p")

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        guests: formData.guests,
        message: formData.message || "No special requests",
        to_email: "massawarestaurant@gmail.com",
      }

      const response = await emailjs.send("service_t722xgi", "template_wyyw00j", templateParams)

      console.log("[v0] Email sent successfully:", response)

      // Save reservation to database
      try {
        await fetch("/api/reservations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            date: formData.date,
            time: formData.time,
            guests: formData.guests,
            message: formData.message || "",
          }),
        })
      } catch (error) {
        console.error("Error saving reservation:", error)
        // Don't fail the form submission if saving fails
      }

      setSubmitStatus("success")

      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          date: "",
          time: "",
          guests: "",
          message: "",
        })
        setCompletedFields(new Set())
        setSubmitStatus("idle")
      }, 5000)
    } catch (error) {
      console.error("[v0] Failed to send email:", error)
      setSubmitStatus("error")
      setErrorMessage("Failed to send reservation. Please try again or call us directly.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      const newErrors = { ...validationErrors }
      delete newErrors[field]
      setValidationErrors(newErrors)
    }
    
    // Real-time validation for date and time
    if (field === "date") {
      const dateError = validateDate(value)
      if (dateError) {
        setValidationErrors(prev => ({ ...prev, date: dateError }))
      }
      // Also validate time if it's already set
      if (formData.time) {
        const timeError = validateTime(formData.time, value)
        if (timeError) {
          setValidationErrors(prev => ({ ...prev, time: timeError }))
        }
      }
    }
    
    if (field === "time") {
      const timeError = validateTime(value, formData.date)
      if (timeError) {
        setValidationErrors(prev => ({ ...prev, time: timeError }))
      }
    }
    
    if (value.trim()) {
      setCompletedFields(new Set(completedFields).add(field))
    } else {
      const newCompleted = new Set(completedFields)
      newCompleted.delete(field)
      setCompletedFields(newCompleted)
    }
  }

  return (
    <section
      id="reservation"
      className="py-20 lg:py-32 relative overflow-hidden bg-gradient-to-b from-background via-amber-50/30 to-background"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-orange-500/10 to-rose-500/10 rounded-full blur-3xl animate-pulse-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-rose-500/5 rounded-full blur-3xl animate-spin-slow" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-amber-400/5 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-orange-400/5 rounded-full blur-2xl animate-float-delayed" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-amber-600 animate-pulse" />
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
              <Sparkles className="w-6 h-6 text-amber-600 animate-pulse-delayed" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent text-balance animate-gradient bg-[length:200%_auto]">
              Reserve Your Table
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty max-w-2xl mx-auto">
              Join us for an unforgettable dining experience. Book your table and let us create memories together.
            </p>
            
            {/* Business Hours Info */}
            <div className="mt-8 p-4 bg-amber-50/50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-amber-900 dark:text-amber-100">Openingstijden</h3>
              </div>
              <div className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
                <p>Dinsdag - Zondag: 17:00 - 23:00</p>
                <p>Maandag: Gesloten</p>
                <p className="text-xs opacity-75">Keuken sluit om 22:00</p>
              </div>
            </div>
            
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent mt-6 mx-auto animate-pulse" />
          </div>

          <Card className="border-0 shadow-2xl bg-white/70 dark:bg-card/70 backdrop-blur-2xl relative overflow-hidden group animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-gradient-rotate" />
            <div className="absolute inset-[2px] bg-white/95 dark:bg-card/95 rounded-lg backdrop-blur-2xl" />

            <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-2xl animate-float" />
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-to-br from-orange-400/20 to-rose-400/20 rounded-full blur-2xl animate-float-delayed" />
            <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-rose-400/15 to-amber-400/15 rounded-full blur-xl animate-float-slow" />
            <div className="relative">
              <CardHeader className="space-y-3 pb-8">
                <CardTitle className="font-serif text-3xl bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                  Make a Reservation
                </CardTitle>
                <CardDescription className="text-base">
                  Please fill out the form below and we'll confirm your reservation shortly
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3 animate-in fade-in slide-in-from-left duration-500 delay-100">
                      <Label
                        htmlFor="name"
                        className={`text-sm font-medium flex items-center gap-2 transition-all duration-300 ${
                          focusedField === "name" ? "text-amber-600 scale-105" : ""
                        }`}
                      >
                        <User
                          className={`w-4 h-4 transition-all duration-300 ${focusedField === "name" ? "text-amber-600 scale-110 rotate-12" : "text-muted-foreground"}`}
                        />
                        Full Name *
                        {completedFields.has("name") && (
                          <Check className="w-4 h-4 text-green-600 ml-auto animate-in zoom-in duration-300" />
                        )}
                      </Label>
                      <div className="relative group/input">
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => handleFieldChange("name", e.target.value)}
                          onFocus={() => setFocusedField("name")}
                          onBlur={() => setFocusedField(null)}
                          required
                          className={`h-12 border-2 transition-all duration-300 focus:shadow-lg bg-white/50 dark:bg-background/50 backdrop-blur-sm hover:bg-white/70 focus:scale-[1.01] ${
                            validationErrors.name 
                              ? "border-red-500 focus:border-red-500 focus:shadow-red-500/20" 
                              : "border-muted focus:border-amber-500 focus:shadow-amber-500/20 hover:border-amber-300"
                          }`}
                        />
                        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 opacity-0 group-hover/input:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      </div>
                      {validationErrors.name && (
                        <p className="text-red-600 text-sm mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top duration-300">
                          <AlertCircle className="w-4 h-4" />
                          {validationErrors.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 animate-in fade-in slide-in-from-right duration-500 delay-150">
                      <Label
                        htmlFor="email"
                        className={`text-sm font-medium flex items-center gap-2 transition-all duration-300 ${
                          focusedField === "email" ? "text-amber-600 scale-105" : ""
                        }`}
                      >
                        <Mail
                          className={`w-4 h-4 transition-all duration-300 ${focusedField === "email" ? "text-amber-600 scale-110 rotate-12" : "text-muted-foreground"}`}
                        />
                        Email *
                        {completedFields.has("email") && (
                          <Check className="w-4 h-4 text-green-600 ml-auto animate-in zoom-in duration-300" />
                        )}
                      </Label>
                      <div className="relative group/input">
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => handleFieldChange("email", e.target.value)}
                          onFocus={() => setFocusedField("email")}
                          onBlur={() => setFocusedField(null)}
                          required
                          className={`h-12 border-2 transition-all duration-300 focus:shadow-lg bg-white/50 dark:bg-background/50 backdrop-blur-sm hover:bg-white/70 focus:scale-[1.01] ${
                            validationErrors.email 
                              ? "border-red-500 focus:border-red-500 focus:shadow-red-500/20" 
                              : "border-muted focus:border-amber-500 focus:shadow-amber-500/20 hover:border-amber-300"
                          }`}
                        />
                        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 opacity-0 group-hover/input:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      </div>
                      {validationErrors.email && (
                        <p className="text-red-600 text-sm mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top duration-300">
                          <AlertCircle className="w-4 h-4" />
                          {validationErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3 animate-in fade-in slide-in-from-left duration-500 delay-200">
                      <Label
                        htmlFor="phone"
                        className={`text-sm font-medium flex items-center gap-2 transition-all duration-300 ${
                          focusedField === "phone" ? "text-amber-600 scale-105" : ""
                        }`}
                      >
                        <Phone
                          className={`w-4 h-4 transition-all duration-300 ${focusedField === "phone" ? "text-amber-600 scale-110 rotate-12" : "text-muted-foreground"}`}
                        />
                        Phone Number *
                        {completedFields.has("phone") && (
                          <Check className="w-4 h-4 text-green-600 ml-auto animate-in zoom-in duration-300" />
                        )}
                      </Label>
                      <div className="relative group/input">
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+31 6 34440775"
                          value={formData.phone}
                          onChange={(e) => handleFieldChange("phone", e.target.value)}
                          onFocus={() => setFocusedField("phone")}
                          onBlur={() => setFocusedField(null)}
                          required
                          className={`h-12 border-2 transition-all duration-300 focus:shadow-lg bg-white/50 dark:bg-background/50 backdrop-blur-sm hover:bg-white/70 focus:scale-[1.01] ${
                            validationErrors.phone 
                              ? "border-red-500 focus:border-red-500 focus:shadow-red-500/20" 
                              : "border-muted focus:border-amber-500 focus:shadow-amber-500/20 hover:border-amber-300"
                          }`}
                        />
                        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 opacity-0 group-hover/input:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      </div>
                      {validationErrors.phone && (
                        <p className="text-red-600 text-sm mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top duration-300">
                          <AlertCircle className="w-4 h-4" />
                          {validationErrors.phone}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 animate-in fade-in slide-in-from-right duration-500 delay-250">
                      <Label
                        htmlFor="guests"
                        className={`text-sm font-medium flex items-center gap-2 transition-all duration-300 ${
                          focusedField === "guests" ? "text-amber-600 scale-105" : ""
                        }`}
                      >
                        <Users
                          className={`w-4 h-4 transition-all duration-300 ${focusedField === "guests" ? "text-amber-600 scale-110 rotate-12" : "text-muted-foreground"}`}
                        />
                        Number of Guests *
                        {completedFields.has("guests") && (
                          <Check className="w-4 h-4 text-green-600 ml-auto animate-in zoom-in duration-300" />
                        )}
                      </Label>
                      <div className="relative group/input">
                        <Select
                          value={formData.guests}
                          onValueChange={(value) => handleFieldChange("guests", value)}
                          onOpenChange={(open) => {
                            if (open) setFocusedField("guests")
                            else setFocusedField(null)
                          }}
                        >
                          <SelectTrigger
                            id="guests"
                            className={`h-12 border-2 transition-all duration-300 focus:shadow-lg bg-white/50 dark:bg-background/50 backdrop-blur-sm hover:bg-white/70 focus:scale-[1.01] ${
                              validationErrors.guests 
                                ? "border-red-500 focus:border-red-500 focus:shadow-red-500/20" 
                                : "border-muted focus:border-amber-500 focus:shadow-amber-500/20 hover:border-amber-300"
                            }`}
                          >
                            <SelectValue placeholder="Select guests" />
                          </SelectTrigger>
                          <SelectContent
                            className="z-[100] bg-white dark:bg-gray-900 border-2 border-amber-200 dark:border-amber-800 shadow-2xl backdrop-blur-xl"
                            position="popper"
                            sideOffset={5}
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                              <SelectItem
                                key={num}
                                value={num.toString()}
                                className="cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-900/20 focus:bg-amber-100 dark:focus:bg-amber-900/30 transition-colors"
                              >
                                {num} {num === 1 ? "Guest" : "Guests"}
                              </SelectItem>
                            ))}
                            <SelectItem
                              value="9+"
                              className="cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-900/20 focus:bg-amber-100 dark:focus:bg-amber-900/30 transition-colors"
                            >
                              9+ Guests
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 opacity-0 group-hover/input:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      </div>
                      {validationErrors.guests && (
                        <p className="text-red-600 text-sm mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top duration-300">
                          <AlertCircle className="w-4 h-4" />
                          {validationErrors.guests}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3 animate-in fade-in slide-in-from-left duration-500 delay-300">
                      <Label
                        htmlFor="date"
                        className={`text-sm font-medium flex items-center gap-2 transition-all duration-300 ${
                          focusedField === "date" ? "text-amber-600 scale-105" : ""
                        }`}
                      >
                        <Calendar
                          className={`w-4 h-4 transition-all duration-300 ${focusedField === "date" ? "text-amber-600 scale-110 rotate-12" : "text-muted-foreground"}`}
                        />
                        Date *
                        {completedFields.has("date") && (
                          <Check className="w-4 h-4 text-green-600 ml-auto animate-in zoom-in duration-300" />
                        )}
                      </Label>
                      <div className="relative group/input">
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => handleFieldChange("date", e.target.value)}
                          onFocus={() => setFocusedField("date")}
                          onBlur={() => setFocusedField(null)}
                          required
                          min={new Date().toISOString().split('T')[0]}
                          max={(() => {
                            const maxDate = new Date()
                            maxDate.setDate(maxDate.getDate() + 7)
                            return maxDate.toISOString().split('T')[0]
                          })()}
                          className={`h-12 border-2 transition-all duration-300 focus:shadow-lg bg-white/50 dark:bg-background/50 backdrop-blur-sm hover:bg-white/70 focus:scale-[1.01] ${
                            validationErrors.date 
                              ? "border-red-500 focus:border-red-500 focus:shadow-red-500/20" 
                              : "border-muted focus:border-amber-500 focus:shadow-amber-500/20 hover:border-amber-300"
                          }`}
                        />
                        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 opacity-0 group-hover/input:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      </div>
                      {validationErrors.date && (
                        <p className="text-red-600 text-sm mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top duration-300">
                          <AlertCircle className="w-4 h-4" />
                          {validationErrors.date}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 animate-in fade-in slide-in-from-right duration-500 delay-350">
                      <Label
                        htmlFor="time"
                        className={`text-sm font-medium flex items-center gap-2 transition-all duration-300 ${
                          focusedField === "time" ? "text-amber-600 scale-105" : ""
                        }`}
                      >
                        <Clock
                          className={`w-4 h-4 transition-all duration-300 ${focusedField === "time" ? "text-amber-600 scale-110 rotate-12" : "text-muted-foreground"}`}
                        />
                        Time *
                        {completedFields.has("time") && (
                          <Check className="w-4 h-4 text-green-600 ml-auto animate-in zoom-in duration-300" />
                        )}
                      </Label>
                      <div className="relative group/input">
                        <Input
                          id="time"
                          type="time"
                          value={formData.time}
                          onChange={(e) => handleFieldChange("time", e.target.value)}
                          onFocus={() => setFocusedField("time")}
                          onBlur={() => setFocusedField(null)}
                          required
                          min="17:00"
                          max="22:00"
                          className={`h-12 border-2 transition-all duration-300 focus:shadow-lg bg-white/50 dark:bg-background/50 backdrop-blur-sm hover:bg-white/70 focus:scale-[1.01] ${
                            validationErrors.time 
                              ? "border-red-500 focus:border-red-500 focus:shadow-red-500/20" 
                              : "border-muted focus:border-amber-500 focus:shadow-amber-500/20 hover:border-amber-300"
                          }`}
                        />
                        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 opacity-0 group-hover/input:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      </div>
                      {validationErrors.time && (
                        <p className="text-red-600 text-sm mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top duration-300">
                          <AlertCircle className="w-4 h-4" />
                          {validationErrors.time}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 animate-in fade-in slide-in-from-bottom duration-500 delay-400">
                    <Label
                      htmlFor="message"
                      className={`text-sm font-medium flex items-center gap-2 transition-all duration-300 ${
                        focusedField === "message" ? "text-amber-600 scale-105" : ""
                      }`}
                    >
                      <MessageSquare
                        className={`w-4 h-4 transition-all duration-300 ${focusedField === "message" ? "text-amber-600 scale-110 rotate-12" : "text-muted-foreground"}`}
                      />
                      Special Requests (Optional)
                      {completedFields.has("message") && (
                        <Check className="w-4 h-4 text-green-600 ml-auto animate-in zoom-in duration-300" />
                      )}
                    </Label>
                    <div className="relative group/input">
                      <Textarea
                        id="message"
                        placeholder="Any dietary restrictions, allergies, or special occasions we should know about?"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => handleFieldChange("message", e.target.value)}
                        onFocus={() => setFocusedField("message")}
                        onBlur={() => setFocusedField(null)}
                        className="border-2 border-muted focus:border-amber-500 transition-all duration-300 focus:shadow-lg focus:shadow-amber-500/20 resize-none bg-white/50 dark:bg-background/50 backdrop-blur-sm hover:border-amber-300 hover:bg-white/70 focus:scale-[1.01]"
                      />
                      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 opacity-0 group-hover/input:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    </div>
                  </div>

                  <div className="animate-in fade-in slide-in-from-bottom duration-500 delay-500">
                    {submitStatus === "success" && (
                      <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top duration-500">
                        <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-green-900 dark:text-green-100">Reservation Submitted!</p>
                          <p className="text-sm text-green-700 dark:text-green-200">
                            We'll confirm your reservation shortly via email.
                          </p>
                        </div>
                      </div>
                    )}

                    {submitStatus === "error" && (
                      <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top duration-500">
                        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-red-900 dark:text-red-100">Submission Failed</p>
                          <p className="text-sm text-red-700 dark:text-red-200">{errorMessage}</p>
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full h-14 text-base font-semibold bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 hover:from-amber-500 hover:via-orange-400 hover:to-amber-500 text-white shadow-lg hover:shadow-2xl hover:shadow-amber-500/50 transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group/btn bg-[length:200%_auto] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Sending Reservation...
                          </>
                        ) : (
                          <>
                            <Calendar className="w-5 h-5 group-hover/btn:rotate-12 transition-transform duration-300" />
                            Confirm Reservation
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000 skew-x-12" />
                      <div className="absolute inset-0 bg-white/20 scale-0 group-hover/btn:scale-100 rounded-lg transition-transform duration-700 ease-out" />
                      <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 bg-gradient-to-r from-amber-400/20 via-orange-400/20 to-amber-400/20 blur-xl transition-opacity duration-500" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-rotate {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-20px) translateX(10px);
          }
          66% {
            transform: translateY(-10px) translateX(-10px);
          }
        }
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-30px) translateX(-15px);
          }
          66% {
            transform: translateY(-15px) translateX(15px);
          }
        }
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-25px) scale(1.1);
          }
        }
        @keyframes spin-slow {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        @keyframes pulse-delayed {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-gradient {
          animation: gradient-rotate 3s ease infinite;
        }
        .animate-gradient-rotate {
          background-size: 200% 200%;
          animation: gradient-rotate 3s ease infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-pulse-delayed {
          animation: pulse-delayed 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          animation-delay: 500ms;
        }
      `}</style>
    </section>
  )
}
