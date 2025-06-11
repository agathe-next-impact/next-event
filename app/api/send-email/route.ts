import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import {
  generateConfirmationEmail,
  generateContactConfirmationEmail,
  generateContactNotificationEmail,
  generateSpeakerConfirmationEmail,
  generateSpeakerNotificationEmail,
  generateReminderEmail,
} from "@/lib/email"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { to, subject, html, text, type, data } = body

    // Vérifier la configuration
    if (!process.env.RESEND_API_KEY) {
      console.log("⚠️ RESEND_API_KEY non configurée - simulation d'envoi")

      // Simuler l'envoi en mode développement
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return NextResponse.json({
        success: true,
        message: "Email simulé envoyé avec succès",
        id: `sim_${Date.now()}`,
        simulated: true,
      })
    }

    if (!to || !subject) {
      return NextResponse.json({ error: "Destinataire et sujet requis" }, { status: 400 })
    }

    let emailContent = { subject, html, text }

    // Générer le contenu selon le type d'email
    if (type && data) {
      switch (type) {
        case "reservation_confirmation":
          emailContent = generateConfirmationEmail(data.reservation, data.event)
          break
        case "contact_confirmation":
          emailContent = generateContactConfirmationEmail(data.contactMessage)
          break
        case "contact_notification":
          emailContent = generateContactNotificationEmail(data.contactMessage)
          break
        case "speaker_confirmation":
          emailContent = generateSpeakerConfirmationEmail(data.application)
          break
        case "speaker_notification":
          emailContent = generateSpeakerNotificationEmail(data.application)
          break
        case "event_reminder":
          emailContent = generateReminderEmail(data.reservation, data.event)
          break
      }
    }

    // Envoyer l'email via Resend
    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL || "Event Portal <noreply@eventportal.fr>",
      to: Array.isArray(to) ? to : [to],
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
      replyTo: data?.replyTo || undefined,
    })

    console.log("📧 Email envoyé avec succès:", {
      to,
      subject: emailContent.subject,
      id: result.data?.id,
    })

    return NextResponse.json({
      success: true,
      message: "Email envoyé avec succès",
      id: result.data?.id,
    })
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email:", error)

    return NextResponse.json(
      {
        error: "Erreur lors de l'envoi de l'email",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 },
    )
  }
}
