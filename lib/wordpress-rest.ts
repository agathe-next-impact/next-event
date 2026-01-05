// Type minimal Speaker pour la démo (adapter selon besoin réel)
export type Speaker = typeof demoSpeakers[number];
import { getPosts, getPostBySlug, getCustomPosts, testAPIConnection } from "./wordpress-api"
import { convertToEvent, convertToSpeaker } from "./wordpress-adapter"


// Interfaces pour les événements et speakers

import { demoSpeakers } from "./demo-speakers";
export const MOCK_SPEAKERS = demoSpeakers;

export interface Reservation {
  id: string
  eventId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  notes?: string
  status: "confirmed" | "pending" | "cancelled"
}

// Fonction pour générer des dates futures
const getDateInDays = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

// Données de simulation pour les événements
export const MOCK_EVENTS: any[] = [
  {
    id: "1",
    title: "Conférence Entrepreneuriat PME 2024",
    slug: "conference-entrepreneuriat-pme-2024",
    content: `
      <p>La plus grande conférence dédiée à l'entrepreneuriat et au développement des PME en France. Rejoignez plus de 500 entrepreneurs, dirigeants et experts pour une journée d'échanges et d'apprentissage.</p>
      
      <p>Au programme :</p>
      <ul>
        <li>Keynotes inspirantes d'entrepreneurs à succès</li>
        <li>Ateliers pratiques sur la stratégie et le financement</li>
        <li>Tables rondes sur les défis actuels des PME</li>
        <li>Networking avec l'écosystème entrepreneurial</li>
      </ul>
    `,
    excerpt: "La plus grande conférence entrepreneuriat PME de France avec 500+ participants",
    date: getDateInDays(30),
    featuredImage: {
      node: {
        sourceUrl: "/placeholder.svg?height=400&width=600",
        altText: "Conférence Entrepreneuriat PME",
      },
    },
    eventDetails: {
      startDate: getDateInDays(30),
      endDate: getDateInDays(30),
      location: "Palais des Congrès, Place de l'Europe",
      city: "Lyon",
      category: "Conférence",
      maxAttendees: 500,
      currentAttendees: 142,
      registrationDeadline: getDateInDays(28),
      price: 0,
      isFree: true,
      speakers: ["1", "2"], // IDs des speakers
      prerequisites: "Aucun prérequis. Ouvert à tous les entrepreneurs et dirigeants de PME.",
      materialProvided: "Support de conférence, accès aux replays, certificat de participation, kit networking",
      agenda: [
        {
          time: "09:00",
          title: "Accueil et petit-déjeuner networking",
          description: "Accueil des participants avec petit-déjeuner et première session de networking",
        },
        {
          time: "09:30",
          title: "Keynote d'ouverture - Sophie Martineau",
          description: "De l'idée à la réussite: Les clés de l'entrepreneuriat moderne",
        },
        {
          time: "10:30",
          title: "Table ronde: Financement des PME",
          description: "Panorama des solutions de financement disponibles pour les PME",
        },
        {
          time: "11:30",
          title: "Pause networking",
          description: "Pause café et échanges entre participants",
        },
        {
          time: "12:00",
          title: "Conférence - Marc Dubois",
          description: "Transformer sa PME à l'ère du digital",
        },
        {
          time: "13:00",
          title: "Déjeuner networking",
          description: "Déjeuner buffet avec opportunités de networking",
        },
        {
          time: "14:30",
          title: "Ateliers parallèles",
          description: "3 ateliers au choix: Stratégie, Marketing, RH",
        },
        {
          time: "16:00",
          title: "Synthèse et clôture",
          description: "Synthèse de la journée et perspectives",
        },
      ],
    },
    seo: {
      title: "Conférence Entrepreneuriat PME 2024 - L'événement incontournable",
      metaDesc:
        "Rejoignez 500+ entrepreneurs à Lyon pour la plus grande conférence PME de France. Speakers experts, ateliers pratiques, networking.",
    },
  },
]

// Stockage local des réservations (en mode développement)
const MOCK_RESERVATIONS: Reservation[] = []

// Fonctions pour récupérer les événements
export async function getEvents(variables?: { first?: number; after?: string; category?: string; city?: string }) {
  try {
    const params: Record<string, string> = {
      per_page: variables?.first?.toString() || "20",
    }
    if (variables?.category && variables.category !== "all") {
      params.category = variables.category
    }
    if (variables?.city && variables.city !== "all") {
      params.meta_key = "city"
      params.meta_value = variables.city
    }
    const eventPosts = await getCustomPosts("events", params)
    if (Array.isArray(eventPosts) && eventPosts.length > 0) {
      const events = eventPosts.map(convertToEvent)
      return {
        nodes: events,
        pageInfo: {
          hasNextPage: eventPosts.length >= Number.parseInt(params.per_page, 10),
          endCursor: eventPosts.length > 0 ? eventPosts[eventPosts.length - 1].id.toString() : null,
        },
      }
    } else {
      const posts = await getPosts(params)
      const events = posts.map(convertToEvent)
      return {
        nodes: events,
        pageInfo: {
          hasNextPage: posts.length >= Number.parseInt(params.per_page, 10),
          endCursor: posts.length > 0 ? posts[posts.length - 1].id.toString() : null,
        },
      }
    }
  } catch (error) {
    console.error("Error fetching events:", error)
    return {
      nodes: MOCK_EVENTS,
      pageInfo: {
        hasNextPage: false,
        endCursor: null,
      },
    }
  }
}
// Fonctions pour récupérer les speakers
export async function getSpeakers(variables?: {
  first?: number
  after?: string
  expertise?: string
  company?: string
  location?: string
  search?: string
  availability?: string
  experience?: string
}) {
  try {
    const params: Record<string, string> = {
      per_page: variables?.first?.toString() || "20",
    }

    // Filtrage par expertise via taxonomie ou meta
    if (variables?.expertise && variables.expertise !== "all") {
      params.meta_key = "expertise"
      params.meta_value = variables.expertise
    }

    // Filtrage par entreprise
    if (variables?.company && variables.company !== "all") {
      params.meta_key = "company"
      params.meta_value = variables.company
    }

    // Filtrage par localisation
    if (variables?.location && variables.location !== "all") {
      params.meta_key = "location"
      params.meta_value = variables.location
    }

    // Recherche textuelle
    if (variables?.search) {
      params.search = variables.search
    }

    try {
      const speakerPosts = await getCustomPosts("speakers", params)
      let speakers = speakerPosts.map(convertToSpeaker)

      // Filtrage côté client pour les critères complexes
      speakers = applyClientSideFilters(speakers, variables)

      return {
        nodes: speakers,
        pageInfo: {
          hasNextPage: speakers.length >= Number.parseInt(params.per_page, 10),
          endCursor: speakers.length > 0 ? speakers[speakers.length - 1].id.toString() : null,
        },
      }
    } catch (error) {
      let speakers = [...MOCK_SPEAKERS]

      // Appliquer les filtres sur les données simulées
      speakers = applyClientSideFilters(speakers, variables)

      return {
        nodes: speakers,
        pageInfo: {
          hasNextPage: false,
          endCursor: null,
        },
      }
    }
  } catch (error) {
    console.error("Error fetching speakers:", error)
    let speakers = [...MOCK_SPEAKERS]
    speakers = applyClientSideFilters(speakers, variables)

    return {
      nodes: speakers,
      pageInfo: {
        hasNextPage: false,
        endCursor: null,
      },
    }
  }
}

// Fonction pour appliquer les filtres côté client
function applyClientSideFilters(
  speakers: Speaker[],
  variables?: {
    expertise?: string
    company?: string
    location?: string
    search?: string
    availability?: string
    experience?: string
  },
): Speaker[] {
  let filteredSpeakers = [...speakers]

  // Filtrage par expertise
  if (variables?.expertise && variables.expertise !== "all") {
    filteredSpeakers = filteredSpeakers.filter((speaker) =>
      speaker.speakerDetails.expertise.some((exp) => exp.toLowerCase().includes(variables.expertise!.toLowerCase())),
    )
  }

  // Filtrage par entreprise
  if (variables?.company && variables.company !== "all") {
    filteredSpeakers = filteredSpeakers.filter((speaker) =>
      speaker.speakerDetails.company?.toLowerCase().includes(variables.company!.toLowerCase()),
    )
  }

  // Filtrage par localisation
  if (variables?.location && variables.location !== "all") {
    filteredSpeakers = filteredSpeakers.filter((speaker) =>
      speaker.speakerDetails.location?.toLowerCase().includes(variables.location!.toLowerCase()),
    )
  }

  // Recherche textuelle
  if (variables?.search) {
    const searchTerm = variables.search.toLowerCase()
    filteredSpeakers = filteredSpeakers.filter(
      (speaker) =>
        speaker.title.toLowerCase().includes(searchTerm) ||
        speaker.speakerDetails.bio.toLowerCase().includes(searchTerm) ||
        speaker.speakerDetails.company?.toLowerCase().includes(searchTerm) ||
        speaker.speakerDetails.jobTitle?.toLowerCase().includes(searchTerm) ||
        speaker.speakerDetails.expertise.some((exp) => exp.toLowerCase().includes(searchTerm)) ||
        speaker.skillsAndAchievements?.skills?.some((skill: any) => typeof skill === "string" ? skill.toLowerCase().includes(searchTerm) : (typeof skill?.name === "string" && skill.name.toLowerCase().includes(searchTerm))),
    )
  }

  // Filtrage par disponibilité
  // Filtrage par disponibilité (si le champ existe)
  // Filtrage par disponibilité (si le champ existe)
  if (variables?.availability && variables.availability !== "all") {
    filteredSpeakers = filteredSpeakers.filter(
      (speaker) =>
        (speaker.speakerDetails && 'availability' in speaker.speakerDetails && speaker.speakerDetails.availability === variables.availability)
    )
  }

  // Filtrage par expérience
  if (variables?.experience && variables.experience !== "all") {
    const expRange = variables.experience.split("-")
    if (expRange.length === 2) {
      const minExp = Number.parseInt(expRange[0])
      const maxExp = Number.parseInt(expRange[1])
      filteredSpeakers = filteredSpeakers.filter((speaker) => {
        const experience = speaker.speakerDetails.experience || 0
        return experience >= minExp && (maxExp === 100 ? true : experience <= maxExp)
      })
    }
  }

  return filteredSpeakers
}

export async function getSpeakerBySlug(slug: string) {
  try {
    try {
      const params = { slug }
      const speakerPosts = await getCustomPosts("speakers", params)

      if (speakerPosts.length > 0) {
        return convertToSpeaker(speakerPosts[0])
      }
    } catch (error) {
      // Type de post personnalisé 'speakers' non trouvé
    }

    const post = await getPostBySlug(slug)

    if (post) {
      return convertToSpeaker(post)
    }

    return null
  } catch (error) {
    console.error("Error fetching speaker by slug:", error)
    const mockSpeaker = MOCK_SPEAKERS.find((speaker) => speaker.slug === slug)
    return mockSpeaker || null
  }
}

export async function getSpeakerSlugs() {
  try {
    try {
      const speakerPosts = await getCustomPosts("speakers", { per_page: "100" })
      return speakerPosts.map((post) => post.slug)
    } catch (error) {
      const posts = await getPosts({ per_page: "100", categories: "speaker" })
      return posts.map((post) => post.slug)
    }
  } catch (error) {
    console.error("Error fetching speaker slugs:", error)
    return MOCK_SPEAKERS.map((speaker) => speaker.slug)
  }
}

export async function getEventsBySpeaker(speakerId: string) {
  try {
    // On filtre côté client car la plupart des installations WP REST ne filtrent pas correctement sur les champs array/meta
    const allEvents = await getCustomPosts("events", { per_page: "100" })
    const convertedEvents = allEvents.map(convertToEvent)
    const events = convertedEvents.filter(event =>
      Array.isArray(event.eventDetails?.speakers)
        ? event.eventDetails.speakers.includes(speakerId)
        : false
    )
    if (events.length > 0) {
      return events
    } else {
      return []
    }
  } catch (error) {
    console.error("Error fetching events by speaker:", error)
    const speakerEventMap: Record<string, string[]> = {
      "1": ["1"],
      "2": ["1"],
    }

    const eventIds = speakerEventMap[speakerId] || []
    return MOCK_EVENTS.filter((event) => eventIds.includes(event.id))
  }
}

export async function getEventsBySpeakerSlug(slug: string) {
  try {
    // 1. Récupère le speaker pour obtenir son ID
    const speakerRes = await getCustomPosts("speakers", { slug });
    const speaker = speakerRes[0];
    if (!speaker) return [];

    // 2. Récupère tous les events (comme les autres fonctions)
    const allEvents = await getCustomPosts("events", { per_page: "100" });
    const convertedEvents = allEvents.map(convertToEvent);
    // 3. Filtre côté JS sur le champ speakers (array d'ID)
    const events = convertedEvents.filter(event =>
      Array.isArray(event.eventDetails?.speakers)
        ? event.eventDetails.speakers.includes(speaker.id)
        : false
    );
    return events;
  } catch (error) {
    console.error("Error fetching events by speaker slug:", error);
    // Fallback sur les données mockées
    const mockSpeaker = MOCK_SPEAKERS.find((s) => s.slug === slug);
    if (!mockSpeaker) return [];
    const speakerEventMap: Record<string, string[]> = {
      "1": ["1"],
      "2": ["1"],
    };
    const eventIds = speakerEventMap[mockSpeaker.id] || [];
    return MOCK_EVENTS.filter((event) => eventIds.includes(event.id));
  }
}

export async function testWordPressConnection() {
  return testAPIConnection()
}

// Fonctions pour la gestion des réservations
export function generateConfirmationCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export function createReservation(
  reservationData: Omit<Reservation, "id" | "status" | "createdAt" | "confirmationCode">,
): Reservation {
  const reservation: Reservation = {
    ...reservationData,
    id: `res_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    status: "confirmed",
    createdAt: new Date().toISOString(),
    confirmationCode: generateConfirmationCode(),
  }

  MOCK_RESERVATIONS.push(reservation)

  const eventIndex = MOCK_EVENTS.findIndex((event) => event.id === reservationData.eventId)
  if (eventIndex !== -1) {
    MOCK_EVENTS[eventIndex].eventDetails.currentAttendees += 1
  }

  return reservation
}

export function getReservationsByEvent(eventId: string): Reservation[] {
  return MOCK_RESERVATIONS.filter((reservation) => reservation.eventId === eventId)
}

export function getReservationByConfirmationCode(confirmationCode: string): Reservation | null {
  return MOCK_RESERVATIONS.find((reservation) => reservation.confirmationCode === confirmationCode) || null
}

export function cancelReservation(confirmationCode: string): boolean {
  const reservationIndex = MOCK_RESERVATIONS.findIndex(
    (reservation) => reservation.confirmationCode === confirmationCode,
  )
  if (reservationIndex !== -1) {
    const reservation = MOCK_RESERVATIONS[reservationIndex]
    reservation.status = "cancelled"

    const eventIndex = MOCK_EVENTS.findIndex((event) => event.id === reservation.eventId)
    if (eventIndex !== -1) {
      MOCK_EVENTS[eventIndex].eventDetails.currentAttendees -= 1
    }

    return true
  }
  return false
}
