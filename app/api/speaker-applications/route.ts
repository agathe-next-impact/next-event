import { NextResponse } from "next/server"
import { sendSpeakerConfirmationEmail, sendSpeakerNotificationEmail } from "@/lib/email"
import * as z from "zod"

const speakerApplicationSchema = z.object({
  // Informations personnelles
  firstName: z.string().min(2, "Prénom requis (minimum 2 caractères)"),
  lastName: z.string().min(2, "Nom requis (minimum 2 caractères)"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  bio: z.string().min(50, "Bio trop courte (minimum 50 caractères)"),

  // Réseaux sociaux
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  github: z.string().optional(),
  website: z.string().optional(),

  // Détails du talk
  talkTitle: z.string().min(5, "Titre du talk requis (minimum 5 caractères)"),
  talkDescription: z.string().min(100, "Description trop courte (minimum 100 caractères)"),
  talkDuration: z.string().min(1, "Durée requise"),
  talkLevel: z.string().min(1, "Niveau requis"),
  talkCategory: z.string().min(1, "Catégorie requise"),
  talkFormat: z.string().optional(),

  // Expérience
  speakingExperience: z.string().optional(),
  previousTalks: z.string().optional(),

  // Logistique
  availableDates: z.string().optional(),
  travelRequired: z.boolean().default(false),
  specialRequirements: z.string().optional(),

  // Accords
  agreeTerms: z.boolean().refine((val) => val === true, "Acceptation des conditions requise"),
  agreeRecording: z.boolean().default(false),
  agreeMarketing: z.boolean().default(false),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = speakerApplicationSchema.parse(body)

    // Générer un ID unique pour la candidature
    const applicationId = `spk_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

    // Créer l'objet candidature
    const application = {
      id: applicationId,
      ...validatedData,
      submittedAt: new Date().toISOString(),
      status: "pending",
    }

    // Envoyer l'email de confirmation au candidat
    const confirmationSent = await sendSpeakerConfirmationEmail(application)

    // Envoyer la notification à l'équipe
    const notificationSent = await sendSpeakerNotificationEmail(application)

    return NextResponse.json({
      success: true,
      message: "Candidature soumise avec succès",
      applicationId,
      emailSent: confirmationSent,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: error.errors[0].message,
          errors: error.errors,
        },
        { status: 400 },
      )
    }

    console.error("❌ Erreur lors du traitement de la candidature speaker:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erreur interne du serveur",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: Request) {
  return NextResponse.json({ message: "Méthode non autorisée" }, { status: 405 })
}

export async function PUT(request: Request) {
  return NextResponse.json({ message: "Méthode non autorisée" }, { status: 405 })
}

export async function DELETE(request: Request) {
  return NextResponse.json({ message: "Méthode non autorisée" }, { status: 405 })
}
