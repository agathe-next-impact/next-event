"use client"

import React, { useState } from "react"
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
  reservedSeats: number
  onReservationSuccess?: () => void // Appelée pour mise à jour locale
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

export default function ReservationForm({ event, reservedSeats, onReservationSuccess }: ReservationFormProps) {

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
  const [confirmedCount, setConfirmedCount] = useState(reservedSeats)

  // Synchroniser confirmedCount si reservedSeats change (mise à jour parent)
  React.useEffect(() => {
    setConfirmedCount(reservedSeats)
  }, [reservedSeats])

  const isRegistrationOpen = new Date() < new Date(event.eventDetails.registrationDeadline)
  const eventStarted = new Date() > new Date(event.eventDetails.startDate)
  const maxAttendees = event.eventDetails.maxAttendees
  const availableSpots = maxAttendees - confirmedCount
  const isFull = availableSpots <= 0

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setReservationResult(null)

    // Simulation de confirmation locale
    setTimeout(() => {
      setReservationResult({
        success: true,
        message: "Votre réservation a été confirmée !",
        confirmationCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
        emailSent: true,
      })
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        notes: "",
      })
      setIsSubmitting(false)
      if (onReservationSuccess) {
        onReservationSuccess() // Mise à jour locale dans le parent
      }
    }, 1000)
  }

  if (reservationResult?.success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-500">
            <CheckCircle className="h-5 w-5" />
            Réservation Confirmée
          </CardTitle>
          <div className="space-y-2 mt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Places disponibles</span>
              <Badge variant={availableSpots <= 5 ? "destructive" : "secondary"}>
                {availableSpots} / {event.eventDetails.maxAttendees}
              </Badge>
            </div>
            {availableSpots <= 5 && availableSpots > 0 && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertDescription className="text-orange-800">
                  {availableSpots} place{availableSpots > 1 ? "s" : ""} restante{availableSpots > 1 ? "s" : ""}!
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">{reservationResult.message}</p>
                <p>
                  <strong>Code de confirmation :</strong>{" "}
                  <span className="font-mono px-2 py-1 rounded">
                    {reservationResult.confirmationCode}
                  </span>
                </p>
                <p className="text-sm">Conservez ce code précieusement. Vous en aurez besoin le jour de l'événement.</p>
              </div>
            </AlertDescription>
          </Alert>

          {reservationResult.emailSent && (
            <Alert>
              <AlertDescription>
                <div className="space-y-1 bg-yellow-200/20 p-2 rounded">
                  <p className="font-medium">Email de confirmation envoyé</p>
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
              Un email de confirmation vous a été envoyé avec toutes les informations nécessaires.
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
          Inscription gratuite
        </CardTitle>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Places disponibles</span>
            <Badge variant={availableSpots <= 5 ? "destructive" : "secondary"}>
              {availableSpots} / {event.eventDetails.maxAttendees}
            </Badge>
          </div>
          {availableSpots <= 5 && availableSpots > 0 && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertDescription className="text-orange-800">
                {availableSpots} place{availableSpots > 1 ? "s" : ""} restante{availableSpots > 1 ? "s" : ""}!
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {eventStarted ? (
          <Alert>
            <AlertDescription>Cet événement a déjà commencé. Les réservations ne sont plus possibles.</AlertDescription>
          </Alert>
        ) : !isRegistrationOpen ? (
          <Alert>
            <AlertDescription>
              Les inscriptions sont closes depuis le {formatDate(event.eventDetails.registrationDeadline)}.
            </AlertDescription>
          </Alert>
        ) : isFull ? (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              <div className="space-y-2">
                <p className="font-medium">Événement complet</p>
                <p>Toutes les places ont été réservées. Vous pouvez vous inscrire sur la liste d'attente.</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Rejoindre la liste d'attente
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {reservationResult && !reservationResult.success && (
              <Alert variant="destructive">
                <AlertDescription>{reservationResult.message}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Prénom *</Label>
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
                <Label htmlFor="lastName">Nom *</Label>
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
                <p className="text-xs text-muted-foreground mt-1">📧 Un email de confirmation sera envoyé à cette adresse</p>
            </div>

            <div>
              <Label htmlFor="phone">Téléphone</Label>
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
              <Label htmlFor="company">Entreprise</Label>
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
              <Label htmlFor="notes">Remarques et questions</Label>
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
                  <div className="font-medium">Tarif</div>
                  <div className="text-2xl font-bold text-accent">Gratuit</div>
                </div>
                <Badge variant="secondary" className="text-white">
                  Evénement gratuit
                </Badge>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Réservation en cours...
                    </>
                ) : (
                    <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirmer mon inscription gratuite
                    </>
                )}
              </Button>

                <p className="text-xs text-muted-foreground mt-2 text-center">
                En réservant, vous acceptez de recevoir des informations concernant cet événement.
                <br />📧 Un email de confirmation vous sera envoyé automatiquement.
                </p>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
