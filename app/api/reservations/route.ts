import { NextResponse } from "next/server"
import { sendConfirmationEmail } from "@/lib/email"
import type { Event, Reservation } from "@/lib/graphql"

// Fonction pour générer un code de confirmation
function generateConfirmationCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, company, notes, eventId, eventTitle, eventSlug } = body

    if (!firstName || !lastName || !email || !eventId) {
      return NextResponse.json({ message: "Données manquantes" }, { status: 400 })
    }

    // Générer un code de confirmation
    const confirmationCode = generateConfirmationCode()

    // Créer la réservation (simulation)
    const reservation: Reservation = {
      id: `res_${Date.now()}`,
      firstName,
      lastName,
      email,
      phone: phone || "",
      company: company || "",
      notes: notes || "",
      confirmationCode,
      eventId,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    }

    // Données d'événement simulées (à remplacer par une vraie requête)
    const event: Event = {
      id: eventId,
      title: eventTitle || "Événement",
      slug: eventSlug || "event",
      excerpt: "",
      content: "",
      featuredImage: null,
      eventDetails: {
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
        location: "123 Rue de la Tech, 75001 Paris",
        city: "Paris",
        category: "Conférence",
        maxAttendees: 100,
        currentAttendees: 45,
        registrationDeadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
        isFree: true,
        price: 0,
        speakers: [],
        prerequisites: "",
        materialProvided: "",
        agenda: [],
      },
      speakers: [],
      seoData: null,
    }

    // Envoyer l'email de confirmation
    const emailSent = await sendConfirmationEmail(reservation, event)

    console.log("✅ Réservation créée:", {
      id: reservation.id,
      email: reservation.email,
      event: event.title,
      confirmationCode: reservation.confirmationCode,
      emailSent,
    })

    return NextResponse.json({
      success: true,
      message: "Réservation confirmée avec succès",
      confirmationCode: reservation.confirmationCode,
      emailSent,
      reservation,
    })
  } catch (error) {
    console.error("❌ Erreur lors de la création de la réservation:", error)
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  return new NextResponse("Méthode non autorisée", { status: 405 })
}

export async function PUT(request: Request) {
  return new NextResponse("Méthode non autorisée", { status: 405 })
}

export async function DELETE(request: Request) {
  return new NextResponse("Méthode non autorisée", { status: 405 })
}
