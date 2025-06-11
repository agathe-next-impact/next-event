import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to, subject, message } = body

    if (!to || !subject || !message) {
      return NextResponse.json({ error: "Destinataire, sujet et message requis" }, { status: 400 })
    }

    // Envoyer l'email de test
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to,
        subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #3b82f6;">Test Email - Event Portal</h2>
            <p>${message}</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              Cet email de test a été envoyé depuis Event Portal<br>
              Envoyé le: ${new Date().toLocaleString("fr-FR")}
            </p>
          </div>
        `,
        text: `Test Email - Event Portal\n\n${message}\n\nCet email de test a été envoyé depuis Event Portal\nEnvoyé le: ${new Date().toLocaleString("fr-FR")}`,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || "Erreur lors de l'envoi")
    }

    return NextResponse.json({
      success: true,
      message: "Email de test envoyé avec succès",
      details: result,
    })
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email de test:", error)
    return NextResponse.json(
      {
        error: "Erreur lors de l'envoi de l'email de test",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 },
    )
  }
}
