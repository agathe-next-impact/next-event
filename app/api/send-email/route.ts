import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import {
  generateConfirmationEmail,
  generateContactConfirmationEmail,
  generateContactNotificationEmail,
  generateSpeakerConfirmationEmail,
  generateSpeakerNotificationEmail,
  generateReminderEmail,
} from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { to, subject, html, text, type, data } = body

    // Utilisation systématique de Nodemailer (local)
    const transporter = nodemailer.createTransport({
      host: "localhost",
      port: 1025,
      secure: false,
      tls: { rejectUnauthorized: false },
    })

    let emailContent = { subject, html, text }

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

    if (!to || !emailContent.subject) {
      return NextResponse.json({ error: "Destinataire et sujet requis" }, { status: 400 })
    }

    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || "Event Portal <noreply@eventportal.fr>",
      to: Array.isArray(to) ? to.join(",") : to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
      replyTo: data?.replyTo || undefined,
    })

    return NextResponse.json({
      success: true,
      message: "Email envoyé localement (MailHog/Papercut)",
      id: info.messageId,
      simulated: true,
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
