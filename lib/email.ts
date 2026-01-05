import type { Event, Reservation } from "./graphql"
import { formatDate } from "./utils"

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

interface SpeakerApplication {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  jobTitle?: string
  bio: string
  talkTitle: string
  talkDescription: string
  talkDuration: string
  talkLevel: string
  talkCategory: string
  talkFormat?: string
  speakingExperience?: string
  submittedAt: string
  status: string
}

interface ContactMessage {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  subject: string
  category: string
  message: string
  priority: string
  submittedAt: string
  status: string
}

export function generateContactConfirmationEmail(contactMessage: ContactMessage): EmailTemplate {
  const submissionDate = formatDate(contactMessage.submittedAt, "long")

  const categoryLabels: Record<string, string> = {
    general: "Question générale",
    event: "À propos d'un événement",
    speaker: "Candidature speaker",
    partnership: "Partenariat",
    technical: "Problème technique",
    feedback: "Feedback / Suggestion",
    media: "Demande média",
    other: "Autre",
  }

  const priorityLabels: Record<string, string> = {
    low: "Faible (72h)",
    normal: "Normal (24h)",
    high: "Urgent (4h)",
  }

  const expectedResponse = priorityLabels[contactMessage.priority] || "24h"

  const subject = `✅ Message reçu - ${contactMessage.subject}`

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Message de contact reçu</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 32px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 32px;
            padding-bottom: 24px;
            border-bottom: 2px solid #e2e8f0;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #3b82f6;
            margin-bottom: 8px;
        }
        .confirmation-badge {
            background: #10b981;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            display: inline-block;
            margin-bottom: 16px;
        }
        .message-title {
            font-size: 24px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 8px;
        }
        .message-id {
            background: #f3f4f6;
            border: 2px dashed #d1d5db;
            border-radius: 8px;
            padding: 16px;
            text-align: center;
            margin: 24px 0;
        }
        .id-code {
            font-family: 'Courier New', monospace;
            font-size: 20px;
            font-weight: bold;
            color: #3b82f6;
            letter-spacing: 1px;
        }
        .message-details {
            background: #f8fafc;
            border-radius: 8px;
            padding: 20px;
            margin: 24px 0;
        }
        .detail-row {
            display: flex;
            margin-bottom: 12px;
            align-items: flex-start;
        }
        .detail-label {
            font-weight: 600;
            color: #374151;
            min-width: 100px;
        }
        .detail-value {
            color: #6b7280;
        }
        .message-content {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 16px;
            margin: 16px 0;
            font-style: italic;
        }
        .response-info {
            background: #eff6ff;
            border-left: 4px solid #3b82f6;
            padding: 20px;
            margin: 24px 0;
        }
        .priority-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
        }
        .priority-high {
            background: #fecaca;
            color: #991b1b;
        }
        .priority-normal {
            background: #fef3c7;
            color: #92400e;
        }
        .priority-low {
            background: #d1fae5;
            color: #065f46;
        }
        .footer {
            text-align: center;
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            background: #3b82f6;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 16px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Event Portal</div>
            <div class="confirmation-badge">✅ Message Reçu</div>
            <h1 class="message-title">${contactMessage.subject}</h1>
        </div>

        <p>Bonjour <strong>${contactMessage.firstName}</strong>,</p>
        
        <p>Merci de nous avoir contactés ! Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.</p>

        <div class="message-id">
            <div style="margin-bottom: 8px; font-weight: 600; color: #374151;">ID du message</div>
            <div class="id-code">${contactMessage.id}</div>
            <div style="margin-top: 8px; font-size: 14px; color: #6b7280;">
                Conservez cet ID pour vos références
            </div>
        </div>

        <div class="message-details">
            <h3 style="margin-top: 0; color: #1f2937;">📋 Récapitulatif de votre message</h3>
            
            <div class="detail-row">
                <span class="detail-label">Sujet :</span>
                <span class="detail-value">${contactMessage.subject}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Catégorie :</span>
                <span class="detail-value">${categoryLabels[contactMessage.category] || contactMessage.category}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Priorité :</span>
                <span class="detail-value">
                    <span class="priority-badge priority-${contactMessage.priority}">
                        ${priorityLabels[contactMessage.priority] || contactMessage.priority}
                    </span>
                </span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Envoyé le :</span>
                <span class="detail-value">${submissionDate}</span>
            </div>

            ${
              contactMessage.company
                ? `
            <div class="detail-row">
                <span class="detail-label">Entreprise :</span>
                <span class="detail-value">${contactMessage.company}</span>
            </div>
            `
                : ""
            }

            <div style="margin-top: 16px;">
                <strong>Votre message :</strong>
                <div class="message-content">${contactMessage.message}</div>
            </div>
        </div>

        <div class="response-info">
            <h4 style="margin-top: 0; color: #1e40af;">⏰ Temps de réponse estimé</h4>
            <p style="margin-bottom: 0;">
                Selon la priorité de votre demande (<strong>${priorityLabels[contactMessage.priority]}</strong>), 
                nous nous engageons à vous répondre sous <strong>${expectedResponse.split("(")[1]?.replace(")", "") || "24h"}</strong>.
            </p>
        </div>

        <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; margin: 24px 0;">
            <h4 style="margin-top: 0; color: #065f46;">📞 Besoin d'une réponse plus rapide ?</h4>
            <ul style="margin: 0; padding-left: 20px;">
                <li><strong>Téléphone :</strong> +33 1 23 45 67 89 (9h-18h)</li>
                <li><strong>Chat :</strong> Disponible sur notre site web</li>
                <li><strong>Urgence :</strong> urgence@eventportal.fr</li>
            </ul>
        </div>

        <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.PUBLIC_SITE_URL || "http://localhost:3000"}/contact" class="button">
                Envoyer un autre message
            </a>
        </div>

        <p>Merci de votre confiance et à très bientôt !</p>

        <div class="footer">
            <p>Cet email a été envoyé automatiquement. Vous pouvez y répondre directement.</p>
            <p>
                <strong>Event Portal</strong><br>
                Email: contact@eventportal.fr<br>
                Téléphone: +33 1 23 45 67 89
            </p>
        </div>
    </div>
</body>
</html>
  `

  const text = `
MESSAGE DE CONTACT REÇU - ${contactMessage.subject}

Bonjour ${contactMessage.firstName},

Merci de nous avoir contactés ! Nous avons bien reçu votre message.

ID DU MESSAGE: ${contactMessage.id}
(Conservez cet ID pour vos références)

RÉCAPITULATIF:
- Sujet: ${contactMessage.subject}
- Catégorie: ${categoryLabels[contactMessage.category] || contactMessage.category}
- Priorité: ${priorityLabels[contactMessage.priority] || contactMessage.priority}
- Envoyé le: ${submissionDate}
${contactMessage.company ? `- Entreprise: ${contactMessage.company}` : ""}

VOTRE MESSAGE:
${contactMessage.message}

TEMPS DE RÉPONSE ESTIMÉ:
Selon la priorité de votre demande, nous nous engageons à vous répondre sous ${expectedResponse.split("(")[1]?.replace(")", "") || "24h"}.

BESOIN D'UNE RÉPONSE PLUS RAPIDE ?
- Téléphone: +33 1 23 45 67 89 (9h-18h)
- Chat: Disponible sur notre site web
- Urgence: urgence@eventportal.fr

Merci de votre confiance !

Event Portal
Email: contact@eventportal.fr
Téléphone: +33 1 23 45 67 89
  `

  return { subject, html, text }
}

export function generateContactNotificationEmail(contactMessage: ContactMessage): EmailTemplate {
  const submissionDate = formatDate(contactMessage.submittedAt, "long")

  const categoryLabels: Record<string, string> = {
    general: "Question générale",
    event: "À propos d'un événement",
    speaker: "Candidature speaker",
    partnership: "Partenariat",
    technical: "Problème technique",
    feedback: "Feedback / Suggestion",
    media: "Demande média",
    other: "Autre",
  }

  const priorityLabels: Record<string, string> = {
    low: "Faible (72h)",
    normal: "Normal (24h)",
    high: "Urgent (4h)",
  }

  const subject = `📧 Nouveau message - ${contactMessage.firstName} ${contactMessage.lastName} (${priorityLabels[contactMessage.priority]})`

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouveau message de contact</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 32px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 32px;
            padding-bottom: 24px;
            border-bottom: 2px solid #e2e8f0;
        }
        .notification-badge {
            background: #f59e0b;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            display: inline-block;
            margin-bottom: 16px;
        }
        .priority-high {
            background: #ef4444;
        }
        .priority-normal {
            background: #f59e0b;
        }
        .priority-low {
            background: #10b981;
        }
        .contact-info {
            background: #f8fafc;
            border-radius: 8px;
            padding: 20px;
            margin: 24px 0;
        }
        .message-info {
            background: #eff6ff;
            border-radius: 8px;
            padding: 20px;
            margin: 24px 0;
        }
        .detail-row {
            display: flex;
            margin-bottom: 12px;
            align-items: flex-start;
        }
        .detail-label {
            font-weight: 600;
            color: #374151;
            min-width: 120px;
        }
        .detail-value {
            color: #6b7280;
        }
        .message-content {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 16px;
            margin: 16px 0;
            white-space: pre-wrap;
        }
        .action-buttons {
            text-align: center;
            margin: 32px 0;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 8px;
        }
        .button-primary {
            background: #10b981;
            color: white;
        }
        .button-secondary {
            background: #6b7280;
            color: white;
        }
        .urgent-alert {
            background: #fef2f2;
            border-left: 4px solid #ef4444;
            padding: 16px;
            margin: 24px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div style="font-size: 24px; font-weight: bold; color: #3b82f6; margin-bottom: 8px;">Event Portal</div>
            <div class="notification-badge priority-${contactMessage.priority}">📧 Nouveau Message</div>
            <h1 style="font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 8px;">
                ${contactMessage.firstName} ${contactMessage.lastName}
            </h1>
            <p style="color: #6b7280; margin: 0;">${contactMessage.subject}</p>
        </div>

        ${
          contactMessage.priority === "high"
            ? `
        <div class="urgent-alert">
            <h4 style="margin-top: 0; color: #991b1b;">🚨 Message urgent - Réponse requise sous 4h</h4>
            <p style="margin-bottom: 0;">Ce message a été marqué comme urgent par l'expéditeur.</p>
        </div>
        `
            : ""
        }

        <p>Un nouveau message de contact vient d'être reçu via le formulaire du site web.</p>

        <div class="contact-info">
            <h3 style="margin-top: 0; color: #1f2937;">👤 Informations de contact</h3>
            
            <div class="detail-row">
                <span class="detail-label">Nom complet :</span>
                <span class="detail-value">${contactMessage.firstName} ${contactMessage.lastName}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Email :</span>
                <span class="detail-value">${contactMessage.email}</span>
            </div>
            
            ${
              contactMessage.phone
                ? `
            <div class="detail-row">
                <span class="detail-label">Téléphone :</span>
                <span class="detail-value">${contactMessage.phone}</span>
            </div>
            `
                : ""
            }
            
            ${
              contactMessage.company
                ? `
            <div class="detail-row">
                <span class="detail-label">Entreprise :</span>
                <span class="detail-value">${contactMessage.company}</span>
            </div>
            `
                : ""
            }
            
            <div class="detail-row">
                <span class="detail-label">Reçu le :</span>
                <span class="detail-value">${submissionDate}</span>
            </div>
        </div>

        <div class="message-info">
            <h3 style="margin-top: 0; color: #1f2937;">📋 Détails du message</h3>
            
            <div class="detail-row">
                <span class="detail-label">Sujet :</span>
                <span class="detail-value"><strong>${contactMessage.subject}</strong></span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Catégorie :</span>
                <span class="detail-value">${categoryLabels[contactMessage.category] || contactMessage.category}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Priorité :</span>
                <span class="detail-value">
                    <strong style="color: ${contactMessage.priority === "high" ? "#ef4444" : contactMessage.priority === "normal" ? "#f59e0b" : "#10b981"}">
                        ${priorityLabels[contactMessage.priority] || contactMessage.priority}
                    </strong>
                </span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">ID message :</span>
                <span class="detail-value">${contactMessage.id}</span>
            </div>

            <div style="margin-top: 16px;">
                <strong>Message :</strong>
                <div class="message-content">${contactMessage.message}</div>
            </div>
        </div>

        <div class="action-buttons">
            <a href="mailto:${contactMessage.email}" class="button button-primary">
                Répondre par email
            </a>
            <a href="${process.env.PUBLIC_SITE_URL || "http://localhost:3000"}/admin/messages" class="button button-secondary">
                Voir dans l'admin
            </a>
        </div>

        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0;">
            <h4 style="margin-top: 0; color: #92400e;">⏰ Temps de réponse attendu</h4>
            <p style="margin-bottom: 0;">
                Selon la priorité sélectionnée, une réponse est attendue sous <strong>${priorityLabels[contactMessage.priority]?.split("(")[1]?.replace(")", "") || "24h"}</strong>.
            </p>
        </div>

        <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            <p><strong>Event Portal - Notification Contact</strong></p>
            <p>ID du message: ${contactMessage.id}</p>
        </div>
    </div>
</body>
</html>
  `

  const text = `
NOUVEAU MESSAGE DE CONTACT - ${contactMessage.firstName} ${contactMessage.lastName}

${contactMessage.priority === "high" ? "🚨 MESSAGE URGENT - Réponse requise sous 4h" : ""}

Un nouveau message de contact vient d'être reçu !

CONTACT:
- Nom: ${contactMessage.firstName} ${contactMessage.lastName}
- Email: ${contactMessage.email}
${contactMessage.phone ? `- Téléphone: ${contactMessage.phone}` : ""}
${contactMessage.company ? `- Entreprise: ${contactMessage.company}` : ""}
- Reçu le: ${submissionDate}

MESSAGE:
- Sujet: ${contactMessage.subject}
- Catégorie: ${categoryLabels[contactMessage.category] || contactMessage.category}
- Priorité: ${priorityLabels[contactMessage.priority] || contactMessage.priority}
- ID: ${contactMessage.id}

Contenu: ${contactMessage.message}

TEMPS DE RÉPONSE ATTENDU:
${priorityLabels[contactMessage.priority]?.split("(")[1]?.replace(")", "") || "24h"}

Contact: ${contactMessage.email}

Event Portal - Notification Contact
  `

  return { subject, html, text }
}

export async function sendContactConfirmationEmail(contactMessage: ContactMessage): Promise<boolean> {
  try {
    const emailTemplate = generateContactConfirmationEmail(contactMessage)

    // En mode développement, simuler l'envoi
    if (process.env.NODE_ENV === "development" || !process.env.SMTP_HOST) {
      console.log("📧 Simulation d'envoi d'email de confirmation contact:")
      console.log("To:", contactMessage.email)
      console.log("Subject:", emailTemplate.subject)
      console.log("Message ID:", contactMessage.id)
      console.log("Category:", contactMessage.category)
      console.log("Priority:", contactMessage.priority)

      // Simuler un délai d'envoi
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return true
    }

    // Code pour l'envoi réel en production
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: contactMessage.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      }),
    })

    return response.ok
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de confirmation contact:", error)
    return false
  }
}

export async function sendContactNotificationEmail(contactMessage: ContactMessage): Promise<boolean> {
  try {
    const emailTemplate = generateContactNotificationEmail(contactMessage)

    // Déterminer l'email de destination selon la catégorie
    const getDestinationEmail = (category: string): string => {
      switch (category) {
        case "event":
          return "agathe@next-impact.digital"
        case "speaker":
          return "agathe@next-impact.digital"
        case "partnership":
          return "agathe@next-impact.digital"
        case "technical":
          return "agathe@next-impact.digital"
        case "media":
          return "agathe@next-impact.digital"
        default:
          return "agathe@next-impact.digital"
      }
    }

    const destinationEmail = getDestinationEmail(contactMessage.category)

    // En mode développement, simuler l'envoi
    if (process.env.NODE_ENV === "development" || !process.env.SMTP_HOST) {
      console.log("📧 Simulation d'envoi d'email de notification équipe:")
      console.log("To:", destinationEmail)
      console.log("Subject:", emailTemplate.subject)
      console.log("From:", `${contactMessage.firstName} ${contactMessage.lastName}`)
      console.log("Category:", contactMessage.category)
      console.log("Priority:", contactMessage.priority)

      // Simuler un délai d'envoi
      await new Promise((resolve) => setTimeout(resolve, 500))

      return true
    }

    // Code pour l'envoi réel en production
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: destinationEmail,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      }),
    })

    return response.ok
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de notification équipe:", error)
    return false
  }
}

export function generateSpeakerConfirmationEmail(application: SpeakerApplication): EmailTemplate {
  const submissionDate = formatDate(application.submittedAt, "long")

  const subject = `✅ Candidature reçue - ${application.talkTitle}`

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Candidature Speaker reçue</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 32px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 32px;
            padding-bottom: 24px;
            border-bottom: 2px solid #e2e8f0;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #3b82f6;
            margin-bottom: 8px;
        }
        .confirmation-badge {
            background: #10b981;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            display: inline-block;
            margin-bottom: 16px;
        }
        .talk-title {
            font-size: 24px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 8px;
        }
        .application-id {
            background: #f3f4f6;
            border: 2px dashed #d1d5db;
            border-radius: 8px;
            padding: 16px;
            text-align: center;
            margin: 24px 0;
        }
        .id-code {
            font-family: 'Courier New', monospace;
            font-size: 20px;
            font-weight: bold;
            color: #3b82f6;
            letter-spacing: 1px;
        }
        .talk-details {
            background: #f8fafc;
            border-radius: 8px;
            padding: 20px;
            margin: 24px 0;
        }
        .detail-row {
            display: flex;
            margin-bottom: 12px;
            align-items: flex-start;
        }
        .detail-label {
            font-weight: 600;
            color: #374151;
            min-width: 100px;
        }
        .detail-value {
            color: #6b7280;
        }
        .next-steps {
            background: #eff6ff;
            border-left: 4px solid #3b82f6;
            padding: 20px;
            margin: 24px 0;
        }
        .timeline {
            background: #f0fdf4;
            border-left: 4px solid #10b981;
            padding: 20px;
            margin: 24px 0;
        }
        .timeline ul {
            margin: 0;
            padding-left: 20px;
        }
        .timeline li {
            margin-bottom: 8px;
        }
        .button {
            display: inline-block;
            background: #3b82f6;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 16px 0;
        }
        .footer {
            text-align: center;
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Event Portal</div>
            <div class="confirmation-badge">🎤 Candidature Reçue</div>
            <h1 class="talk-title">${application.talkTitle}</h1>
        </div>

        <p>Bonjour <strong>${application.firstName}</strong>,</p>
        
        <p>Merci d'avoir soumis votre candidature pour devenir speaker à Event Portal ! Nous avons bien reçu votre proposition de talk et nous sommes ravis de l'étudier.</p>

        <div class="talk-details">
            <h3 style="margin-top: 0; color: #1f2937;">📋 Récapitulatif de votre candidature</h3>
            
            <div class="detail-row">
                <span class="detail-label">Titre :</span>
                <span class="detail-value">${application.talkTitle}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Catégorie :</span>
                <span class="detail-value">${application.talkCategory}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Durée :</span>
                <span class="detail-value">${application.talkDuration}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Niveau :</span>
                <span class="detail-value">${application.talkLevel}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Soumis le :</span>
                <span class="detail-value">${submissionDate}</span>
            </div>

            ${
              application.company
                ? `
            <div class="detail-row">
                <span class="detail-label">Entreprise :</span>
                <span class="detail-value">${application.company}</span>
            </div>
            `
                : ""
            }
        </div>

        <div class="next-steps">
            <h4 style="margin-top: 0; color: #1e40af;">🚀 Prochaines étapes</h4>
            <p style="margin-bottom: 0;">Notre équipe va maintenant étudier votre candidature. Voici ce qui va se passer :</p>
        </div>

        <div class="timeline">
            <h4 style="margin-top: 0; color: #065f46;">⏱️ Timeline</h4>
            <ul>
                <li><strong>Sous 48h :</strong> Première évaluation de votre candidature</li>
                <li><strong>J+3 à J+7 :</strong> Réponse de notre équipe (acceptation ou refus)</li>
                <li><strong>Si accepté :</strong> Entretien de 30min pour affiner votre présentation</li>
                <li><strong>Préparation :</strong> Accompagnement pour préparer votre talk</li>
                <li><strong>Showtime :</strong> Présentation devant notre communauté ! 🎉</li>
            </ul>
        </div>

        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0;">
            <h4 style="margin-top: 0; color: #92400e;">💡 En attendant</h4>
            <ul style="margin: 0; padding-left: 20px;">
                <li>Préparez une version courte de votre présentation (pitch de 2-3 minutes)</li>
                <li>Réfléchissez aux questions que pourrait poser l'audience</li>
                <li>Consultez nos <a href="${process.env.PUBLIC_SITE_URL || "http://localhost:3000"}/events" style="color: #d97706;">événements précédents</a> pour vous inspirer</li>
            </ul>
        </div>

        <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.PUBLIC_SITE_URL || "http://localhost:3000"}/become-speaker" class="button">
                Voir le processus complet
            </a>
        </div>

        <p>Nous avons hâte de découvrir votre expertise et peut-être de vous accueillir comme speaker dans notre communauté !</p>

        <div class="footer">
            <p>Cet email a été envoyé automatiquement. Pour toute question, contactez-nous à speakers@eventportal.fr</p>
            <p>
                <strong>Event Portal</strong><br>
                Email: speakers@eventportal.fr<br>
                Téléphone: +33 1 23 45 67 89
            </p>
        </div>
    </div>
</body>
</html>
  `

  const text = `
CANDIDATURE SPEAKER REÇUE - ${application.talkTitle}

Bonjour ${application.firstName},

Merci d'avoir soumis votre candidature pour devenir speaker à Event Portal !

ID DE CANDIDATURE: ${application.id}
(Conservez cet ID pour vos références)

RÉCAPITULATIF:
- Titre: ${application.talkTitle}
- Catégorie: ${application.talkCategory}
- Durée: ${application.talkDuration}
- Niveau: ${application.talkLevel}
- Soumis le: ${submissionDate}
${application.company ? `- Entreprise: ${application.company}` : ""}

PROCHAINES ÉTAPES:
✅ Candidature reçue et en cours d'évaluation
⏳ Première évaluation sous 48h
📞 Réponse de notre équipe sous 7 jours
🎯 Si accepté: entretien de préparation
🎤 Présentation devant notre communauté !

EN ATTENDANT:
- Préparez un pitch de 2-3 minutes de votre présentation
- Réfléchissez aux questions de l'audience
- Consultez nos événements précédents pour vous inspirer

Nous avons hâte de découvrir votre expertise !

Event Portal
Email: speakers@eventportal.fr
Téléphone: +33 1 23 45 67 89

Voir le processus: ${process.env.PUBLIC_SITE_URL || "http://localhost:3000"}/become-speaker
  `

  return { subject, html, text }
}

export function generateSpeakerNotificationEmail(application: SpeakerApplication): EmailTemplate {
  const submissionDate = formatDate(application.submittedAt, "long")

  const subject = `🎤 Nouvelle candidature speaker - ${application.firstName} ${application.lastName}`

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouvelle candidature speaker</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 32px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 32px;
            padding-bottom: 24px;
            border-bottom: 2px solid #e2e8f0;
        }
        .notification-badge {
            background: #f59e0b;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            display: inline-block;
            margin-bottom: 16px;
        }
        .speaker-info {
            background: #f8fafc;
            border-radius: 8px;
            padding: 20px;
            margin: 24px 0;
        }
        .talk-info {
            background: #eff6ff;
            border-radius: 8px;
            padding: 20px;
            margin: 24px 0;
        }
        .detail-row {
            display: flex;
            margin-bottom: 12px;
            align-items: flex-start;
        }
        .detail-label {
            font-weight: 600;
            color: #374151;
            min-width: 120px;
        }
        .detail-value {
            color: #6b7280;
        }
        .description-box {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 16px;
            margin: 16px 0;
            font-style: italic;
        }
        .action-buttons {
            text-align: center;
            margin: 32px 0;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 8px;
        }
        .button-primary {
            background: #10b981;
            color: white;
        }
        .button-secondary {
            background: #6b7280;
            color: white;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div style="font-size: 24px; font-weight: bold; color: #3b82f6; margin-bottom: 8px;">Event Portal</div>
            <div class="notification-badge">🎤 Nouvelle Candidature</div>
            <h1 style="font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 8px;">
                ${application.firstName} ${application.lastName}
            </h1>
        </div>

        <p>Une nouvelle candidature speaker vient d'être soumise !</p>

        <div class="speaker-info">
            <h3 style="margin-top: 0; color: #1f2937;">👤 Informations du speaker</h3>
            
            <div class="detail-row">
                <span class="detail-label">Nom complet :</span>
                <span class="detail-value">${application.firstName} ${application.lastName}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Email :</span>
                <span class="detail-value">${application.email}</span>
            </div>
            
            ${
              application.phone
                ? `
            <div class="detail-row">
                <span class="detail-label">Téléphone :</span>
                <span class="detail-value">${application.phone}</span>
            </div>
            `
                : ""
            }
            
            ${
              application.company
                ? `
            <div class="detail-row">
                <span class="detail-label">Entreprise :</span>
                <span class="detail-value">${application.company}</span>
            </div>
            `
                : ""
            }
            
            ${
              application.jobTitle
                ? `
            <div class="detail-row">
                <span class="detail-label">Poste :</span>
                <span class="detail-value">${application.jobTitle}</span>
            </div>
            `
                : ""
            }
            
            <div class="detail-row">
                <span class="detail-label">Expérience :</span>
                <span class="detail-value">${application.speakingExperience || "Non spécifiée"}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Soumis le :</span>
                <span class="detail-value">${submissionDate}</span>
            </div>

            <div style="margin-top: 16px;">
                <strong>Bio :</strong>
                <div class="description-box">${application.bio}</div>
            </div>
        </div>

        <div class="talk-info">
            <h3 style="margin-top: 0; color: #1f2937;">🎯 Détails du talk</h3>
            
            <div class="detail-row">
                <span class="detail-label">Titre :</span>
                <span class="detail-value"><strong>${application.talkTitle}</strong></span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Catégorie :</span>
                <span class="detail-value">${application.talkCategory}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Durée :</span>
                <span class="detail-value">${application.talkDuration}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Niveau :</span>
                <span class="detail-value">${application.talkLevel}</span>
            </div>
            
            ${
              application.talkFormat
                ? `
            <div class="detail-row">
                <span class="detail-label">Format :</span>
                <span class="detail-value">${application.talkFormat}</span>
            </div>
            `
                : ""
            }

            <div style="margin-top: 16px;">
                <strong>Description :</strong>
                <div class="description-box">${application.talkDescription}</div>
            </div>
        </div>

        <div class="action-buttons">
            <a href="mailto:${application.email}" class="button button-primary">
                Contacter le speaker
            </a>
            <a href="${process.env.PUBLIC_SITE_URL || "http://localhost:3000"}/admin/speakers" class="button button-secondary">
                Voir dans l'admin
            </a>
        </div>

        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0;">
            <h4 style="margin-top: 0; color: #92400e;">⏰ Action requise</h4>
            <p style="margin-bottom: 0;">
                N'oubliez pas de répondre au speaker sous 48h comme promis dans notre processus !
            </p>
        </div>

        <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            <p><strong>Event Portal - Admin Notification</strong></p>
            <p>ID de candidature: ${application.id}</p>
        </div>
    </div>
</body>
</html>
  `

  const text = `
NOUVELLE CANDIDATURE SPEAKER - ${application.firstName} ${application.lastName}

Une nouvelle candidature speaker vient d'être soumise !

SPEAKER:
- Nom: ${application.firstName} ${application.lastName}
- Email: ${application.email}
${application.phone ? `- Téléphone: ${application.phone}` : ""}
${application.company ? `- Entreprise: ${application.company}` : ""}
${application.jobTitle ? `- Poste: ${application.jobTitle}` : ""}
- Expérience: ${application.speakingExperience || "Non spécifiée"}
- Soumis le: ${submissionDate}

Bio: ${application.bio}

TALK:
- Titre: ${application.talkTitle}
- Catégorie: ${application.talkCategory}
- Durée: ${application.talkDuration}
- Niveau: ${application.talkLevel}
${application.talkFormat ? `- Format: ${application.talkFormat}` : ""}

Description: ${application.talkDescription}

ACTION REQUISE:
Répondre au speaker sous 48h comme promis !

ID de candidature: ${application.id}
Contact speaker: ${application.email}

Event Portal - Admin Notification
  `

  return { subject, html, text }
}

export async function sendSpeakerConfirmationEmail(application: SpeakerApplication): Promise<boolean> {
  try {
    const emailTemplate = generateSpeakerConfirmationEmail(application)

    // En mode développement, simuler l'envoi
    if (process.env.NODE_ENV === "development" || !process.env.SMTP_HOST) {
      console.log("📧 Simulation d'envoi d'email de confirmation speaker:")
      console.log("To:", application.email)
      console.log("Subject:", emailTemplate.subject)
      console.log("Application ID:", application.id)
      console.log("Talk:", application.talkTitle)

      // Simuler un délai d'envoi
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return true
    }

    // Code pour l'envoi réel en production
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: application.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      }),
    })

    return response.ok
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de confirmation speaker:", error)
    return false
  }
}

export async function sendSpeakerNotificationEmail(application: SpeakerApplication): Promise<boolean> {
  try {
    const emailTemplate = generateSpeakerNotificationEmail(application)

    // En mode développement, simuler l'envoi
    if (process.env.NODE_ENV === "development" || !process.env.SMTP_HOST) {
      console.log("📧 Simulation d'envoi d'email de notification équipe:")
      console.log("To: speakers@eventportal.fr")
      console.log("Subject:", emailTemplate.subject)
      console.log("Speaker:", `${application.firstName} ${application.lastName}`)
      console.log("Talk:", application.talkTitle)

      // Simuler un délai d'envoi
      await new Promise((resolve) => setTimeout(resolve, 500))

      return true
    }

    // Code pour l'envoi réel en production
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: "speakers@eventportal.fr", // Email de l'équipe
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      }),
    })

    return response.ok
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de notification équipe:", error)
    return false
  }
}

export function generateConfirmationEmail(reservation: Reservation, event: Event): EmailTemplate {
  const eventDate = formatDate(event.eventDetails.startDate, "long")
  const eventTime = new Date(event.eventDetails.startDate).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const subject = `✅ Confirmation de réservation - ${event.title}`

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation de réservation</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 32px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 32px;
            padding-bottom: 24px;
            border-bottom: 2px solid #e2e8f0;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #3b82f6;
            margin-bottom: 8px;
        }
        .confirmation-badge {
            background: #10b981;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            display: inline-block;
            margin-bottom: 16px;
        }
        .event-title {
            font-size: 24px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 8px;
        }
        .confirmation-code {
            background: #f3f4f6;
            border: 2px dashed #d1d5db;
            border-radius: 8px;
            padding: 16px;
            text-align: center;
            margin: 24px 0;
        }
        .code {
            font-family: 'Courier New', monospace;
            font-size: 24px;
            font-weight: bold;
            color: #3b82f6;
            letter-spacing: 2px;
        }
        .event-details {
            background: #f8fafc;
            border-radius: 8px;
            padding: 20px;
            margin: 24px 0;
        }
        .detail-row {
            display: flex;
            margin-bottom: 12px;
            align-items: flex-start;
        }
        .detail-icon {
            width: 20px;
            margin-right: 12px;
            margin-top: 2px;
        }
        .detail-label {
            font-weight: 600;
            color: #374151;
            min-width: 80px;
        }
        .detail-value {
            color: #6b7280;
        }
        .participant-info {
            background: #eff6ff;
            border-left: 4px solid #3b82f6;
            padding: 16px;
            margin: 24px 0;
        }
        .important-note {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 16px;
            margin: 24px 0;
        }
        .footer {
            text-align: center;
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            background: #3b82f6;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 16px 0;
        }
        .free-badge {
            background: #10b981;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Event Portal</div>
            <div class="confirmation-badge">✅ Réservation Confirmée</div>
            <h1 class="event-title">${event.title}</h1>
        </div>

        <p>Bonjour <strong>${reservation.firstName} ${reservation.lastName}</strong>,</p>
        
        <p>Votre réservation pour l'événement <strong>${event.title}</strong> a été confirmée avec succès !</p>

        <div class="confirmation-code">
            <div style="margin-bottom: 8px; font-weight: 600; color: #374151;">Code de confirmation</div>
            <div class="code">${reservation.confirmationCode}</div>
            <div style="margin-top: 8px; font-size: 14px; color: #6b7280;">
                Conservez ce code précieusement
            </div>
        </div>

        <div class="event-details">
            <h3 style="margin-top: 0; color: #1f2937;">📅 Détails de l'événement</h3>
            
            <div class="detail-row">
                <span class="detail-icon">🗓️</span>
                <span class="detail-label">Date :</span>
                <span class="detail-value">${eventDate}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-icon">⏰</span>
                <span class="detail-label">Heure :</span>
                <span class="detail-value">${eventTime}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-icon">📍</span>
                <span class="detail-label">Lieu :</span>
                <span class="detail-value">${event.eventDetails.location}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-icon">🏙️</span>
                <span class="detail-label">Ville :</span>
                <span class="detail-value">${event.eventDetails.city}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-icon">🎫</span>
                <span class="detail-label">Catégorie :</span>
                <span class="detail-value">${event.eventDetails.category}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-icon">💰</span>
                <span class="detail-label">Prix :</span>
                <span class="detail-value">
                    ${event.eventDetails.isFree ? '<span class="free-badge">GRATUIT</span>' : `${event.eventDetails.price}€`}
                </span>
            </div>
        </div>

        <div class="participant-info">
            <h4 style="margin-top: 0; color: #1e40af;">👤 Informations participant</h4>
            <p><strong>Nom :</strong> ${reservation.firstName} ${reservation.lastName}</p>
            <p><strong>Email :</strong> ${reservation.email}</p>
            ${reservation.phone ? `<p><strong>Téléphone :</strong> ${reservation.phone}</p>` : ""}
            ${reservation.company ? `<p><strong>Entreprise :</strong> ${reservation.company}</p>` : ""}
            ${reservation.notes ? `<p><strong>Notes :</strong> ${reservation.notes}</p>` : ""}
        </div>

        <div class="important-note">
            <h4 style="margin-top: 0; color: #92400e;">⚠️ Informations importantes</h4>
            <ul style="margin: 0; padding-left: 20px;">
                <li>Arrivez <strong>15 minutes avant</strong> le début de l'événement</li>
                <li>Présentez votre <strong>code de confirmation</strong> à l'accueil</li>
                <li>Une pièce d'identité pourra vous être demandée</li>
                ${
                  event.eventDetails.category === "Workshop" || event.eventDetails.category === "Formation"
                    ? "<li>N'oubliez pas votre <strong>ordinateur portable</strong></li>"
                    : ""
                }
                <li>En cas d'empêchement, prévenez-nous au plus tôt</li>
            </ul>
        </div>

        <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.PUBLIC_SITE_URL || "http://localhost:3000"}/events/${event.slug}" class="button">
                Voir les détails de l'événement
            </a>
        </div>

        <div class="footer">
            <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre.</p>
            <p>
                <strong>Event Portal</strong><br>
                Email: contact@eventportal.fr<br>
                Téléphone: +33 1 23 45 67 89
            </p>
            <p style="margin-top: 16px;">
                <a href="${process.env.PUBLIC_SITE_URL || "http://localhost:3000"}/events" style="color: #3b82f6;">Découvrir d'autres événements</a>
            </p>
        </div>
    </div>
</body>
</html>
  `

  const text = `
CONFIRMATION DE RÉSERVATION - ${event.title}

Bonjour ${reservation.firstName} ${reservation.lastName},

Votre réservation pour l'événement "${event.title}" a été confirmée avec succès !

CODE DE CONFIRMATION: ${reservation.confirmationCode}
(Conservez ce code précieusement)

DÉTAILS DE L'ÉVÉNEMENT:
- Date: ${eventDate}
- Heure: ${eventTime}
- Lieu: ${event.eventDetails.location}
- Ville: ${event.eventDetails.city}
- Catégorie: ${event.eventDetails.category}
- Prix: ${event.eventDetails.isFree ? "GRATUIT" : `${event.eventDetails.price}€`}

INFORMATIONS PARTICIPANT:
- Nom: ${reservation.firstName} ${reservation.lastName}
- Email: ${reservation.email}
${reservation.phone ? `- Téléphone: ${reservation.phone}` : ""}
${reservation.company ? `- Entreprise: ${reservation.company}` : ""}
${reservation.notes ? `- Notes: ${reservation.notes}` : ""}

INFORMATIONS IMPORTANTES:
- Arrivez 15 minutes avant le début de l'événement
- Présentez votre code de confirmation à l'accueil
- Une pièce d'identité pourra vous être demandée
${
  event.eventDetails.category === "Workshop" || event.eventDetails.category === "Formation"
    ? "- N'oubliez pas votre ordinateur portable"
    : ""
}
- En cas d'empêchement, prévenez-nous au plus tôt

Event Portal
Email: contact@eventportal.fr
Téléphone: +33 1 23 45 67 89

Voir l'événement: ${process.env.PUBLIC_SITE_URL || "http://localhost:3000"}/events/${event.slug}
  `

  return { subject, html, text }
}

export async function sendConfirmationEmail(reservation: Reservation, event: Event): Promise<boolean> {
  try {
    const emailTemplate = generateConfirmationEmail(reservation, event)

    // En mode développement, simuler l'envoi
    if (process.env.NODE_ENV === "development" || !process.env.SMTP_HOST) {
      console.log("📧 Simulation d'envoi d'email de confirmation:")
      console.log("To:", reservation.email)
      console.log("Subject:", emailTemplate.subject)
      console.log("Code de confirmation:", reservation.confirmationCode)
      console.log("Event:", event.title)

      // Simuler un délai d'envoi
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return true
    }

    // Code pour l'envoi réel en production
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: reservation.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      }),
    })

    return response.ok
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error)
    return false
  }
}

export function generateReminderEmail(reservation: Reservation, event: Event): EmailTemplate {
  const eventDate = formatDate(event.eventDetails.startDate, "long")
  const eventTime = new Date(event.eventDetails.startDate).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const subject = `🔔 Rappel - ${event.title} demain`

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rappel événement</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 32px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 32px;
            padding-bottom: 24px;
            border-bottom: 2px solid #e2e8f0;
        }
        .reminder-badge {
            background: #f59e0b;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            display: inline-block;
            margin-bottom: 16px;
        }
        .event-title {
            font-size: 24px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 8px;
        }
        .countdown {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 24px 0;
        }
        .countdown-text {
            font-size: 18px;
            font-weight: bold;
        }
        .confirmation-code {
            background: #f3f4f6;
            border: 2px dashed #d1d5db;
            border-radius: 8px;
            padding: 16px;
            text-align: center;
            margin: 24px 0;
        }
        .code {
            font-family: 'Courier New', monospace;
            font-size: 20px;
            font-weight: bold;
            color: #3b82f6;
            letter-spacing: 2px;
        }
        .checklist {
            background: #f0fdf4;
            border-left: 4px solid #10b981;
            padding: 20px;
            margin: 24px 0;
        }
        .checklist ul {
            margin: 0;
            padding-left: 20px;
        }
        .checklist li {
            margin-bottom: 8px;
        }
        .button {
            display: inline-block;
            background: #3b82f6;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 16px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div style="font-size: 24px; font-weight: bold; color: #3b82f6; margin-bottom: 8px;">Event Portal</div>
            <div class="reminder-badge">🔔 Rappel Événement</div>
            <h1 class="event-title">${event.title}</h1>
        </div>

        <div class="countdown">
            <div class="countdown-text">⏰ C'est demain !</div>
            <div style="font-size: 14px; margin-top: 8px;">
                ${eventDate} à ${eventTime}
            </div>
        </div>

        <p>Bonjour <strong>${reservation.firstName}</strong>,</p>
        
        <p>Nous vous rappelons que l'événement <strong>${event.title}</strong> aura lieu <strong>demain</strong> !</p>

        <div class="confirmation-code">
            <div style="margin-bottom: 8px; font-weight: 600; color: #374151;">Votre code de confirmation</div>
            <div class="code">${reservation.confirmationCode}</div>
        </div>

        <div class="checklist">
            <h4 style="margin-top: 0; color: #065f46;">✅ Check-list avant l'événement</h4>
            <ul>
                <li>📱 Notez votre code de confirmation : <strong>${reservation.confirmationCode}</strong></li>
                <li>🆔 Préparez une pièce d'identité</li>
                <li>⏰ Arrivez 15 minutes avant le début (${eventTime})</li>
                <li>📍 Vérifiez l'adresse : ${event.eventDetails.location}</li>
                ${
                  event.eventDetails.category === "Workshop" || event.eventDetails.category === "Formation"
                    ? "<li>💻 N'oubliez pas votre ordinateur portable</li>"
                    : ""
                }
                <li>☕ Prenez un bon petit-déjeuner !</li>
            </ul>
        </div>

        <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.PUBLIC_SITE_URL || "http://localhost:3000"}/events/${event.slug}" class="button">
                Voir les détails de l'événement
            </a>
        </div>

        <p>Nous avons hâte de vous voir demain ! 🎉</p>

        <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            <p><strong>Event Portal</strong> - contact@eventportal.fr</p>
        </div>
    </div>
</body>
</html>
  `

  const text = `
RAPPEL - ${event.title} demain !

Bonjour ${reservation.firstName},

Nous vous rappelons que l'événement "${event.title}" aura lieu DEMAIN !

📅 ${eventDate} à ${eventTime}
📍 ${event.eventDetails.location}, ${event.eventDetails.city}

VOTRE CODE DE CONFIRMATION: ${reservation.confirmationCode}

CHECK-LIST AVANT L'ÉVÉNEMENT:
✅ Notez votre code de confirmation : ${reservation.confirmationCode}
✅ Préparez une pièce d'identité
✅ Arrivez 15 minutes avant le début (${eventTime})
✅ Vérifiez l'adresse : ${event.eventDetails.location}
${
  event.eventDetails.category === "Workshop" || event.eventDetails.category === "Formation"
    ? "✅ N'oubliez pas votre ordinateur portable"
    : ""
}

Nous avons hâte de vous voir demain !

Event Portal - contact@eventportal.fr
  `

  return { subject, html, text }
}
