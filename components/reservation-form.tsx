"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, AlertCircle, Users, Calendar, MapPin, Clock, Mail } from "lucide-react"
import type { Event } from "@/lib/graphql"
import { formatDate } from "@/lib/utils"

interface ReservationFormProps {
  event: Event
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  notes: string
}

interface ReservationResult {
  success: boolean
  confirmationCode?: string
  message: string
  emailSent?: boolean
}

export default function ReservationForm({ event }: ReservationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reservationResult, setReservationResult] = useState<ReservationResult | null>(null)

  const isRegistrationOpen = new Date() < new Date(event.eventDetails.registrationDeadline)
  const eventStarted = new Date() > new Date(event.eventDetails.startDate)
  const availableSpots = event.eventDetails.maxAttendees - event.eventDetails.currentAttendees
  const isFull = availableSpots <= 0

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setReservationResult(null)

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          eventId: event.id,
          eventTitle: event.title,
          eventSlug: event.slug,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Erreur lors de la réservation")
      }

      setReservationResult({
        success: true,
        confirmationCode: result.confirmationCode,
        message: "Réservation confirmée avec succès !",
        emailSent: result.emailSent,
      })

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        notes: "",
      })
    } catch (error) {
      setReservationResult({
        success: false,
        message: error instanceof Error ? error.message : "Une erreur inattendue s'est produite",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (reservationResult?.success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Réservation Confirmée
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <div className="space-y-2">
                <p className="font-medium">{reservationResult.message}</p>
                <p>
                  <strong>Code de confirmation :</strong>{" "}
                  <span className="font-mono bg-green-100 px-2 py-1 rounded text-green-800">
                    {reservationResult.confirmationCode}
                  </span>
                </p>
                <p className="text-sm">Conservez ce code précieusement. Vous en aurez besoin le jour de l'événement.</p>
              </div>
            </AlertDescription>
          </Alert>

          {reservationResult.emailSent && (
            <Alert className="border-blue-200 bg-blue-50">
              <Mail className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <div className="space-y-1">
                  <p className="font-medium">📧 Email de confirmation envoyé</p>
                  <p className="text-sm">
                    Vérifiez votre boîte mail (et vos spams) pour retrouver tous les détails de l'événement.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(event.eventDetails.startDate, "long")}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{event.eventDetails.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Arrivée recommandée 15 minutes avant le début</span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {reservationResult.emailSent
                ? "Un email de confirmation détaillé vous a été envoyé avec toutes les informations nécessaires."
                : "Nous vous enverrons un email de confirmation sous peu avec tous les détails de l'événement."}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Free Registration
        </CardTitle>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Available Spots</span>
            <Badge variant={availableSpots <= 5 ? "destructive" : "secondary"}>
              {availableSpots} / {event.eventDetails.maxAttendees}
            </Badge>
          </div>
          {availableSpots <= 5 && availableSpots > 0 && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                Only {availableSpots} spot{availableSpots > 1 ? "s" : ""} left!
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {eventStarted ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>This event has already started. Reservations are no longer possible.</AlertDescription>
          </Alert>
        ) : !isRegistrationOpen ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Reservations are closed since {formatDate(event.eventDetails.registrationDeadline)}.
            </AlertDescription>
          </Alert>
        ) : isFull ? (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <div className="space-y-2">
                <p className="font-medium">Event is full</p>
                <p>All spots have been reserved. You can sign up for the waiting list.</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Join the waiting list
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {reservationResult && !reservationResult.success && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{reservationResult.message}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                placeholder="votre@email.com"
              />
              <p className="text-xs text-muted-foreground mt-1">📧 A confirmation email will be sent to this address</p>
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={isSubmitting}
                placeholder="+33 1 23 45 67 89"
              />
            </div>

            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                disabled={isSubmitting}
                placeholder="Nom de votre entreprise"
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes or Questions</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                disabled={isSubmitting}
                placeholder="Régime alimentaire, accessibilité, questions..."
              />
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-medium">Price</div>
                  <div className="text-2xl font-bold text-accent">Free</div>
                </div>
                <Badge variant="secondary" className="text-white">
                  Free event
                </Badge>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Reserving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirm my free reservation
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground mt-2 text-center">
                By booking, you agree to receive information about this event.
                <br />📧 A confirmation email will be sent to you automatically.
              </p>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
