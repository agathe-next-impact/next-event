"use client"

import { useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { UserCheck } from "lucide-react"
import dynamic from "next/dynamic"
const ReservationForm = dynamic(() => import("@/components/reservation-form"), { ssr: false })


export default function EventReservationSection({ event, initialReservedSeats }) {

  const [reservedSeats, setReservedSeats] = useState(initialReservedSeats)

  // Mise à jour instantanée locale après réservation
  const handleLocalReservation = useCallback(() => {
    setReservedSeats((prev) => prev + 1)
  }, [])

  const maxAttendees = event.eventDetails.maxAttendees
  const availableSpots = maxAttendees - reservedSeats
  const occupancyRate = maxAttendees > 0 ? (reservedSeats / maxAttendees) * 100 : 0

  return (
    <>
      {/* Statistiques de participation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Participation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span>Places réservées</span>
            <span className="font-medium">
              {reservedSeats} / {maxAttendees}
            </span>
          </div>
          <Progress value={occupancyRate} className="h-2" />
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="font-bold text-lg text-black">{reservedSeats}</div>
              <div className="text-muted-foreground">Confirmées</div>
            </div>
            <div>
              <div className="font-bold text-lg text-black">{availableSpots}</div>
              <div className="text-muted-foreground">Disponibles</div>
            </div>
            <div>
              <div className="font-bold text-lg text-black">{Math.round(occupancyRate)}%</div>
              <div className="text-muted-foreground">Taux de remplissage</div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Formulaire de réservation */}
      <ReservationForm
        event={event}
        reservedSeats={reservedSeats}
        onReservationSuccess={handleLocalReservation}
      />
    </>
  )
}