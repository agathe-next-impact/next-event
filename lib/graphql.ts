import { GraphQLClient } from "graphql-request"
import { getPosts, getPostBySlug, getCustomPosts, testAPIConnection } from "./wordpress-api"
import { convertToEvent, convertToSpeaker } from "./wordpress-adapter"

// Interfaces mises à jour selon le schéma ACF
export interface Event {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  date: string
  featuredImage?: {
    node: {
      sourceUrl: string
      altText: string
    }
  }
  eventDetails: {
    startDate: string
    endDate: string
    location: string
    city: {
      name: string
      slug: string
    }
    category: {
      name: string
      slug: string
    }
    maxAttendees: number
    currentAttendees: number
    registrationDeadline?: string
    price: number
    isFree: boolean
    speakers?: any[]
    prerequisites?: string
    materialProvided?: string
    agenda?: {
      time: string
      title: string
      description: string
    }[]
  }
  seoData?: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: {
      sourceUrl: string
    }
    keywords?: string
  }
}

export interface Speaker {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  date: string
  featuredImage?: {
    node: {
      sourceUrl: string
      altText: string
    }
  }
  speakerDetails: {
    bio: string
    company?: string
    jobTitle?: string
    location?: string
    email?: string
    phone?: string
    website?: string
    experience?: number
    rating?: number
    reviewsCount?: number
    talksGiven?: number
    expertises?: {
      name: string
      slug: string
    }[]
    availability: "disponible" | "occupe" | "indisponible"
    hourlyRate?: number
    travelWillingness: boolean
  }
  socialLinks?: {
    linkedin?: string
    twitter?: string
    github?: string
    website?: string
    youtube?: string
    mastodon?: string
  }
  skillsAndAchievements?: {
    skills?: {
      name: string
      level: "debutant" | "intermediaire" | "avance" | "expert"
    }[]
    languages?: {
      language: string
      level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "natif"
    }[]
    certifications?: {
      name: string
      issuer: string
      year?: string
      url?: string
    }[]
    achievements?: {
      title: string
      year?: string
      url?: string
      description?: string
    }[]
    popularTalks?: {
      title: string
      duration?: string
      level?: "debutant" | "intermediaire" | "avance" | "tous-niveaux"
      category?: string
      videoUrl?: string
      description?: string
    }[]
  }
  seoData?: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: {
      sourceUrl: string
    }
    keywords?: string
  }
}

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
  createdAt: string
  confirmationCode: string
}

// Fonction de vérification des variables d'environnement
export function checkEnvironmentVariables() {
  const requiredVars = {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL,
  }

  const missingVars = Object.entries(requiredVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key)

  if (missingVars.length > 0 && process.env.NODE_ENV === "production") {
    console.error("Variables d'environnement manquantes:", missingVars)
    return false
  }

  return true
}

const endpoint = process.env.WP_GRAPHQL_ENDPOINT
if (!endpoint && process.env.NODE_ENV === "production") {
  console.error("WP_GRAPHQL_ENDPOINT n'est pas configuré. Veuillez définir cette variable d'environnement.")
}

export const graphqlClient = new GraphQLClient(endpoint || "", {
  headers: {
    "Content-Type": "application/json",
  },
})

// Fonction pour générer des dates futures
const getDateInDays = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

// Données de simulation mises à jour selon le schéma ACF
export const MOCK_SPEAKERS: Speaker[] = [
  {
    id: "1",
    title: "Sophie Martineau",
    slug: "sophie-martineau",
    content: `
      <p>Sophie Martineau est une entrepreneure passionnée et consultante en stratégie d'entreprise avec plus de 15 ans d'expérience dans l'accompagnement des PME et startups. Fondatrice de trois entreprises dont deux ont été cédées avec succès, elle est aujourd'hui reconnue comme l'une des expertes françaises en développement d'entreprise.</p>
      
      <p>Diplômée d'HEC Paris et titulaire d'un MBA de l'INSEAD, Sophie a débuté sa carrière chez McKinsey & Company avant de se lancer dans l'entrepreneuriat. Elle a notamment fondé une plateforme de e-commerce B2B qui a été rachetée par un groupe du CAC 40, puis une agence de marketing digital spécialisée dans les PME.</p>
      
      <p>Aujourd'hui, Sophie partage son expertise à travers des conférences, des formations et du mentorat. Elle accompagne plus de 50 entrepreneurs par an et intervient régulièrement dans les écoles de commerce et les incubateurs. Elle est également l'auteure du livre "Entreprendre sans se tromper" publié chez Dunod.</p>
    `,
    excerpt: "Entrepreneure et consultante stratégie, fondatrice de 3 entreprises, experte en développement PME",
    date: new Date().toISOString(),
    featuredImage: {
      node: {
        sourceUrl: "/placeholder.svg?height=400&width=400",
        altText: "Sophie Martineau",
      },
    },
    speakerDetails: {
      bio: "Entrepreneure et consultante en stratégie d'entreprise avec 15 ans d'expérience dans l'accompagnement des PME et startups.",
      company: "Martineau Consulting",
      jobTitle: "Fondatrice & CEO",
      location: "Paris, France",
      email: "sophie@martineau-consulting.fr",
      phone: "+33 6 12 34 56 78",
      website: "https://martineau-consulting.fr",
      experience: 15,
      rating: 4.9,
      reviewsCount: 127,
      talksGiven: 89,
      expertises: [
        { name: "Entrepreneuriat", slug: "entrepreneuriat" },
        { name: "Stratégie", slug: "strategie" },
        { name: "Leadership", slug: "leadership" },
        { name: "Levée de fonds", slug: "levee-de-fonds" },
      ],
      availability: "disponible",
      hourlyRate: 1200,
      travelWillingness: true,
    },
    socialLinks: {
      linkedin: "https://linkedin.com/in/sophie-martineau-entrepreneur",
      twitter: "https://twitter.com/sophie_entrepreneur",
      website: "https://martineau-consulting.fr",
    },
    skillsAndAchievements: {
      skills: [
        { name: "Business Plan", level: "expert" },
        { name: "Pitch Deck", level: "expert" },
        { name: "Négociation", level: "avance" },
        { name: "Management", level: "expert" },
        { name: "Marketing Digital", level: "avance" },
        { name: "Finance d'entreprise", level: "avance" },
      ],
      languages: [
        { language: "Français", level: "natif" },
        { language: "Anglais", level: "C1" },
        { language: "Espagnol", level: "B2" },
      ],
      certifications: [
        {
          name: "MBA Strategy & Entrepreneurship",
          issuer: "INSEAD",
          year: "2010",
        },
        {
          name: "Certified Business Coach",
          issuer: "ICF",
          year: "2018",
        },
      ],
      achievements: [
        {
          title: "3 entreprises fondées, 2 cessions réussies",
          year: "2023",
          description: "Création et développement de trois entreprises avec deux sorties réussies",
        },
        {
          title: "Auteure du livre 'Entreprendre sans se tromper'",
          year: "2022",
          description: "Guide pratique publié chez Dunod, 15 000 exemplaires vendus",
        },
        {
          title: "Mentor de 200+ entrepreneurs",
          year: "2023",
          description: "Accompagnement personnalisé d'entrepreneurs en phase de création et développement",
        },
        {
          title: "Prix Entrepreneur de l'année 2022",
          year: "2022",
          description: "Récompense décernée par la CCI Paris Île-de-France",
        },
      ],
      popularTalks: [
        {
          title: "De l'idée à la réussite: Les clés de l'entrepreneuriat",
          description:
            "Un guide pratique pour transformer une idée en entreprise prospère, avec des exemples concrets et des outils actionables",
          duration: "60 minutes",
          level: "tous-niveaux",
          category: "Entrepreneuriat",
          videoUrl: "https://youtube.com/watch?v=example1",
        },
        {
          title: "Lever des fonds: Stratégies et pièges à éviter",
          description: "Comment préparer et réussir sa levée de fonds, de l'amorçage à la série A",
          duration: "45 minutes",
          level: "intermediaire",
          category: "Finance",
        },
      ],
    },
    seoData: {
      metaTitle: "Sophie Martineau - Expert Entrepreneuriat & Stratégie | Speaker Event Portal",
      metaDescription:
        "Sophie Martineau, entrepreneure et consultante, partage son expertise en développement d'entreprise et stratégie.",
      keywords: "entrepreneuriat, stratégie, startup, PME, levée de fonds, business plan",
    },
  },
  {
    id: "2",
    title: "Marc Dubois",
    slug: "marc-dubois",
    content: `
      <p>Marc Dubois est directeur général d'une PME familiale de 150 salariés qu'il a transformée en leader de son secteur en 10 ans. Expert en transformation digitale et management, il accompagne aujourd'hui d'autres dirigeants de PME dans leur développement.</p>
      
      <p>Ingénieur de formation (Centrale Lyon) et titulaire d'un Executive MBA d'HEC, Marc a pris les rênes de l'entreprise familiale en 2014. Sous sa direction, le chiffre d'affaires a été multiplié par 4 et l'entreprise s'est internationalisée avec des filiales en Europe et en Afrique.</p>
      
      <p>Passionné par l'innovation et les nouvelles technologies, Marc a mené la transformation digitale complète de son entreprise. Il partage maintenant son expérience à travers des conférences et du conseil, et préside le club des dirigeants de PME de sa région.</p>
    `,
    excerpt: "Directeur général PME, expert transformation digitale et management, croissance x4 en 10 ans",
    date: new Date().toISOString(),
    featuredImage: {
      node: {
        sourceUrl: "/placeholder.svg?height=400&width=400",
        altText: "Marc Dubois",
      },
    },
    speakerDetails: {
      bio: "Directeur général d'une PME de 150 salariés, expert en transformation digitale et management avec 10 ans d'expérience dirigeante.",
      company: "Dubois Industries",
      jobTitle: "Directeur Général",
      location: "Lyon, France",
      email: "marc.dubois@dubois-industries.fr",
      phone: "+33 6 98 76 54 32",
      website: "https://dubois-industries.fr",
      experience: 10,
      rating: 4.8,
      reviewsCount: 94,
      talksGiven: 67,
      expertises: [
        { name: "Management", slug: "management" },
        { name: "Transformation digitale", slug: "transformation-digitale" },
        { name: "Croissance", slug: "croissance" },
        { name: "International", slug: "international" },
      ],
      availability: "disponible",
      hourlyRate: 1000,
      travelWillingness: true,
    },
    socialLinks: {
      linkedin: "https://linkedin.com/in/marc-dubois-dg",
      twitter: "https://twitter.com/marc_dubois_pme",
    },
    skillsAndAchievements: {
      skills: [
        { name: "Leadership", level: "expert" },
        { name: "Stratégie digitale", level: "expert" },
        { name: "Gestion d'équipe", level: "expert" },
        { name: "Développement international", level: "avance" },
        { name: "Innovation", level: "avance" },
        { name: "Lean Management", level: "avance" },
      ],
      languages: [
        { language: "Français", level: "natif" },
        { language: "Anglais", level: "C1" },
        { language: "Allemand", level: "B2" },
      ],
      certifications: [
        {
          name: "Executive MBA",
          issuer: "HEC Paris",
          year: "2016",
        },
        {
          name: "Certified Digital Leader",
          issuer: "MIT Sloan",
          year: "2020",
        },
      ],
      achievements: [
        {
          title: "Croissance CA x4 en 10 ans",
          year: "2024",
          description: "Multiplication du chiffre d'affaires de 15M€ à 60M€",
        },
        {
          title: "Transformation digitale complète",
          year: "2022",
          description: "Digitalisation de tous les processus métier et mise en place d'un ERP intégré",
        },
        {
          title: "Expansion internationale (5 pays)",
          year: "2023",
          description: "Ouverture de filiales en Allemagne, Espagne, Italie, Maroc et Sénégal",
        },
        {
          title: "Président Club Dirigeants PME Rhône-Alpes",
          year: "2023",
          description: "Élu président du club regroupant 200+ dirigeants de PME",
        },
      ],
      popularTalks: [
        {
          title: "Transformer sa PME à l'ère du digital",
          description: "Retour d'expérience sur la transformation digitale complète d'une PME traditionnelle",
          duration: "50 minutes",
          level: "intermediaire",
          category: "Digital",
          videoUrl: "https://youtube.com/watch?v=example2",
        },
        {
          title: "Management de la croissance: de 50 à 150 salariés",
          description: "Les défis du management lors d'une croissance rapide et les solutions pratiques",
          duration: "40 minutes",
          level: "avance",
          category: "Management",
        },
      ],
    },
    seoData: {
      metaTitle: "Marc Dubois - Expert Management & Transformation Digitale | Speaker Event Portal",
      metaDescription:
        "Marc Dubois, DG de PME, partage son expertise en transformation digitale et management de la croissance.",
      keywords: "management, transformation digitale, PME, croissance, leadership, international",
    },
  },
]

// Données de simulation pour les événements
export const MOCK_EVENTS: Event[] = [
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
      city: { name: "Lyon", slug: "lyon" },
      category: { name: "Conférence", slug: "conference" },
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
    seoData: {
      metaTitle: "Conférence Entrepreneuriat PME 2024 - L'événement incontournable",
      metaDescription:
        "Rejoignez 500+ entrepreneurs à Lyon pour la plus grande conférence PME de France. Speakers experts, ateliers pratiques, networking.",
      keywords: "conférence, entrepreneuriat, PME, startup, business, networking, Lyon",
    },
  },
]

// Stockage local des réservations (en mode développement)
const MOCK_RESERVATIONS: Reservation[] = []

// Fonctions existantes adaptées...
export async function getEvents(variables?: { first?: number; after?: string; category?: string; city?: string }) {
  try {
    const params: Record<string, string> = {
      per_page: variables?.first?.toString() || "20",
    }

    if (variables?.category && variables.category !== "all") {
      params.category = variables.category
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
    }
    // Fallback only if eventPosts is not a non-empty array
    const posts = await getPosts(params)
    const events = posts.map(convertToEvent)
    return {
      nodes: events,
      pageInfo: {
        hasNextPage: posts.length >= Number.parseInt(params.per_page, 10),
        endCursor: posts.length > 0 ? posts[posts.length - 1].id.toString() : null,
      },
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

export async function getEventBySlug(slug: string, preview = false) {
  try {
    try {
      const params = { slug }
      const eventPosts = await getCustomPosts("events", params)

      if (eventPosts.length > 0) {
        return convertToEvent(eventPosts[0])
      }
    } catch (error) {
      // Type de post personnalisé 'events' non trouvé
    }

    const post = await getPostBySlug(slug)

    if (post) {
      return convertToEvent(post)
    }

    return null
  } catch (error) {
    console.error("Error fetching event by slug:", error)
    const mockEvent = MOCK_EVENTS.find((event) => event.slug === slug)
    return mockEvent || null
  }
}

export async function getEventSlugs() {
  try {
    try {
      const eventPosts = await getCustomPosts("events", { per_page: "100" })
      return eventPosts.map((post) => post.slug)
    } catch (error) {
      const posts = await getPosts({ per_page: "100" })
      return posts.map((post) => post.slug)
    }
  } catch (error) {
    console.error("Error fetching event slugs:", error)
    return MOCK_EVENTS.map((event) => event.slug)
  }
}


export async function getCityById(cityId: string) {
  try {
    const res = await fetch(
      `${process.env.PUBLIC_SITE_URL}/wp-json/wp/v2/cities/${cityId}`,
    )
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    const city = await res.json()
    if (city && city.name && city.id) {
      return {
        id: city.id,
        name: city.name,
        slug: city.slug,
      }
    }
    return null
  } catch (error) {
    console.error("Error fetching city by ID:", error)
    return null
  }
}

export async function getSpeakers(variables?: {
  first?: number
  after?: string
  expertise?: string
  company?: string
  location?: string
}) {
  try {
    const params: Record<string, string> = {
      per_page: variables?.first?.toString() || "20",
    }

    try {
      const speakerPosts = await getCustomPosts("speakers", params)
      const speakers = speakerPosts.map(convertToSpeaker)

      return {
        nodes: speakers,
        pageInfo: {
          hasNextPage: speakerPosts.length >= Number.parseInt(params.per_page, 10),
          endCursor: speakerPosts.length > 0 ? speakerPosts[speakerPosts.length - 1].id.toString() : null,
        },
      }
    } catch (error) {
      const posts = await getPosts({ ...params, categories: "speaker" })
      const speakers = posts.map(convertToSpeaker)

      return {
        nodes: speakers,
        pageInfo: {
          hasNextPage: posts.length >= Number.parseInt(params.per_page, 10),
          endCursor: posts.length > 0 ? posts[posts.length - 1].id.toString() : null,
        },
      }
    }
  } catch (error) {
    console.error("Error fetching speakers:", error)
    return {
      nodes: MOCK_SPEAKERS,
      pageInfo: {
        hasNextPage: false,
        endCursor: null,
      },
    }
  }
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
    return []
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

// Nouvelle fonction pour interroger l'API GraphQL de WordPress avec gestion du mode preview

export async function getWPData(query: string, variables: any = {}) {
  const { draftMode } = await import("next/headers")
  const isDraft = (await draftMode()).isEnabled

  const baseEndpoint = process.env.WP_GRAPHQL_ENDPOINT || ""
  if (!baseEndpoint) {
    throw new Error("WP_GRAPHQL_ENDPOINT manquant pour l'appel GraphQL")
  }

  const headers: HeadersInit = { "Content-Type": "application/json" }

  // Active l'authentification Basic uniquement en preview
  if (isDraft && process.env.WP_USER && process.env.WP_APPLICATION_PASSWORD) {
    const auth = Buffer.from(`${process.env.WP_USER}:${process.env.WP_APPLICATION_PASSWORD}`).toString("base64")
    headers["Authorization"] = `Basic ${auth}`
  }

  const response = await fetch(baseEndpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query,
      variables: { ...variables, status: isDraft ? "DRAFT" : "PUBLISH" },
    }),
    cache: isDraft ? "no-store" : "force-cache",
  })

  if (!response.ok) {
    const reason = await response.text().catch(() => "")
    throw new Error(`Erreur GraphQL (${response.status}): ${reason}`)
  }

  return response.json()
}
