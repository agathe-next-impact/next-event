import { NextResponse } from "next/server"
import { sendContactConfirmationEmail, sendContactNotificationEmail } from "@/lib/email"
import * as z from "zod"

const contactSchema = z.object({
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(1, "Sujet requis"),
  category: z.string().min(1, "Catégorie requise"),
  message: z.string().min(20, "Message trop court (minimum 20 caractères)"),
  priority: z.enum(["low", "normal", "high"]).default("normal"),
  agreeTerms: z.boolean().refine((val) => val === true, "Acceptation des conditions requise"),
  agreeNewsletter: z.boolean().optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = contactSchema.parse(body)

    // Générer un ID unique pour le message
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

    // Créer l'objet message de contact
    const contactMessage = {
      id: messageId,
      ...validatedData,
      submittedAt: new Date().toISOString(),
      status: "new",
    }

    // Envoyer l'email de confirmation au client
    const confirmationSent = await sendContactConfirmationEmail(contactMessage)

    // Envoyer la notification à l'équipe
    const notificationSent = await sendContactNotificationEmail(contactMessage)

    return NextResponse.json({
      success: true,
      message: "Message envoyé avec succès",
      messageId,
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

    console.error("❌ Erreur lors du traitement du message de contact:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erreur interne du serveur",
      },
      { status: 500 },
    )
  }
}
