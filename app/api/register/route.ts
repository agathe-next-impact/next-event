import { type NextRequest, NextResponse } from "next/server"

interface RegistrationData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  notes?: string
  eventId: string
  eventTitle: string
}

export async function POST(request: NextRequest) {
  try {
    const data: RegistrationData = await request.json()

    // Validation des champs requis
    if (!data.firstName || !data.lastName || !data.email || !data.eventId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // En mode développement dans v0, simuler la réponse
    if (process.env.NODE_ENV === "development" || !process.env.MAILCHIMP_API_KEY) {
      console.log("🎯 Simulation d'inscription:", {
        participant: `${data.firstName} ${data.lastName}`,
        email: data.email,
        eventId: data.eventId,
        eventTitle: data.eventTitle,
      })

      // Simuler un délai d'API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simuler parfois une erreur pour tester la gestion d'erreur
      if (data.email === "error@test.com") {
        throw new Error("Email déjà utilisé pour cet événement")
      }

      return NextResponse.json(
        {
          message: "Inscription simulée avec succès!",
          id: `mock_${Date.now()}`,
          debug: true,
        },
        { status: 200 },
      )
    }

    // Code original pour la production
    const mailchimpResponse = await addToMailchimp(data)

    if (!mailchimpResponse.success) {
      throw new Error(mailchimpResponse.error || "Failed to add to Mailchimp")
    }

    return NextResponse.json(
      {
        message: "Registration successful",
        id: mailchimpResponse.id,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Registration failed" },
      { status: 500 },
    )
  }
}

async function addToMailchimp(data: RegistrationData) {
  const apiKey = process.env.MAILCHIMP_API_KEY
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID

  if (!apiKey || !audienceId) {
    return { success: false, error: "Mailchimp configuration missing" }
  }

  const datacenter = apiKey.split("-")[1]
  const url = `https://${datacenter}.api.mailchimp.com/3.0/lists/${audienceId}/members`

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: data.email,
        status: "subscribed",
        merge_fields: {
          FNAME: data.firstName,
          LNAME: data.lastName,
          PHONE: data.phone || "",
          COMPANY: data.company || "",
        },
        tags: [`event-${data.eventId}`, "event-registration"],
        interests: {},
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.detail || "Mailchimp API error" }
    }

    const result = await response.json()
    return { success: true, id: result.id }
  } catch (error) {
    return { success: false, error: "Network error" }
  }
}
