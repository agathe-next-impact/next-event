import type { NextApiRequest, NextApiResponse } from "next"

const API_BASE_URL = "https://mediumseagreen-gazelle-452030.hostingersite.com/wp-json/wp/v2"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Méthode non autorisée" })

  const { eventId } = req.body

  // Récupérer l'événement pour vérifier les places restantes
  const eventRes = await fetch(`${API_BASE_URL}/events/${eventId}`)
  if (!eventRes.ok) return res.status(400).json({ message: "Événement introuvable" })
  const event = await eventRes.json()
  const maxAttendees = Number(event.acf?.maxAttendees ?? 0)
  const currentAttendees = Number(event.acf?.currentAttendees ?? 0)

  if (currentAttendees >= maxAttendees) {
    return res.status(400).json({ message: "Le nombre maximum de participants est atteint." })
  }

  // Incrémenter le nombre de participants
  const updateEventRes = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + Buffer.from(`${process.env.WORDPRESS_API_USER}:${process.env.WORDPRESS_API_PASSWORD}`).toString("base64"),
    },
    body: JSON.stringify({
      acf: {
        currentAttendees: currentAttendees + 1,
      },
    }),
  })
  if (!updateEventRes.ok) {
    return res.status(400).json({ message: "Erreur lors de la mise à jour du nombre de participants" })
  }

  return res.status(200).json({
    success: true,
    message: "Nombre de participants incrémenté.",
    currentAttendees: currentAttendees + 1,
  })
}