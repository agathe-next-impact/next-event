import { getPosts, getPostBySlug, getCustomPosts, testAPIConnection } from "./wordpress-api"
import { convertToEvent, convertToSpeaker } from "./wordpress-adapter"

// Interfaces pour les événements et speakers
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
    city: string
    category: string
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
  seo?: {
    title?: string
    metaDesc?: string
    opengraphImage?: {
      sourceUrl: string
    }
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
    expertise: string[]
    skills?: string[]
    languages?: string[]
    availability: "available" | "busy" | "unavailable"
    hourlyRate?: number
    travelWillingness: boolean
    socialLinks?: {
      linkedin?: string
      twitter?: string
      github?: string
      website?: string
      youtube?: string
    }
    achievements?: string[]
    certifications?: {
      name: string
      issuer: string
      year: string
    }[]
    popularTalks?: {
      title: string
      description?: string
      duration?: string
      level?: string
      category?: string
      videoUrl?: string
    }[]
  }
  seo?: {
    title?: string
    metaDesc?: string
    opengraphImage?: {
      sourceUrl: string
    }
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
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  }

  const missingVars = Object.entries(requiredVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key)

  if (missingVars.length > 0 && process.env.NODE_ENV === "production") {
    console.error("Variables d'environnement manquantes:", missingVars)
    return false
  }

  console.log("✅ Toutes les variables d'environnement requises sont configurées")
  return true
}

// Fonction pour générer des dates futures
const getDateInDays = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

// Données de simulation pour les speakers
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
      expertise: ["Entrepreneuriat", "Stratégie", "Leadership", "Levée de fonds"],
      skills: ["Business Plan", "Pitch Deck", "Négociation", "Management", "Marketing Digital", "Finance d'entreprise"],
      languages: ["Français", "Anglais", "Espagnol"],
      availability: "available",
      hourlyRate: 1200,
      travelWillingness: true,
      socialLinks: {
        linkedin: "https://linkedin.com/in/sophie-martineau-entrepreneur",
        twitter: "https://twitter.com/sophie_entrepreneur",
        website: "https://martineau-consulting.fr",
      },
      achievements: [
        "3 entreprises fondées, 2 cessions réussies",
        "Auteure du livre 'Entreprendre sans se tromper'",
        "Mentor de 200+ entrepreneurs",
        "Prix Entrepreneur de l'année 2022",
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
    seo: {
      title: "Sophie Martineau - Expert Entrepreneuriat & Stratégie | Speaker Event Portal",
      metaDesc:
        "Sophie Martineau, entrepreneure et consultante, partage son expertise en développement d'entreprise et stratégie.",
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
      expertise: ["Management", "Transformation digitale", "Croissance", "International"],
      skills: [
        "Leadership",
        "Stratégie digitale",
        "Gestion d'équipe",
        "Développement international",
        "Innovation",
        "Lean Management",
      ],
      languages: ["Français", "Anglais", "Allemand"],
      availability: "available",
      hourlyRate: 1000,
      travelWillingness: true,
      socialLinks: {
        linkedin: "https://linkedin.com/in/marc-dubois-dg",
        twitter: "https://twitter.com/marc_dubois_pme",
      },
      achievements: [
        "Croissance CA x4 en 10 ans",
        "Transformation digitale complète",
        "Expansion internationale (5 pays)",
        "Président Club Dirigeants PME Rhône-Alpes",
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
    seo: {
      title: "Marc Dubois - Expert Management & Transformation Digitale | Speaker Event Portal",
      metaDesc:
        "Marc Dubois, DG de PME, partage son expertise en transformation digitale et management de la croissance.",
    },
  },
  {
    id: "3",
    title: "Claire Moreau",
    slug: "claire-moreau",
    content: `<p>Claire Moreau est une experte en marketing digital et transformation numérique avec 12 ans d'expérience.</p>`,
    excerpt: "Experte marketing digital et transformation numérique, 12 ans d'expérience",
    date: new Date().toISOString(),
    featuredImage: {
      node: {
        sourceUrl: "/placeholder.svg?height=400&width=400",
        altText: "Claire Moreau",
      },
    },
    speakerDetails: {
      bio: "Experte en marketing digital et transformation numérique avec 12 ans d'expérience dans l'accompagnement des entreprises.",
      company: "Digital Boost",
      jobTitle: "Directrice Marketing",
      location: "Marseille, France",
      email: "claire@digitalboost.fr",
      experience: 12,
      rating: 4.7,
      reviewsCount: 85,
      talksGiven: 45,
      expertise: ["Marketing", "Digital", "Innovation"],
      skills: ["SEO", "Social Media", "Analytics", "Content Marketing"],
      languages: ["Français", "Anglais"],
      availability: "available",
      hourlyRate: 800,
      travelWillingness: true,
      socialLinks: {
        linkedin: "https://linkedin.com/in/claire-moreau-marketing",
        twitter: "https://twitter.com/claire_digital",
      },
      achievements: ["Certification Google Analytics", "Speaker TEDx Marketing", "Prix Innovation Marketing 2023"],
      certifications: [
        {
          name: "Google Analytics Certified",
          issuer: "Google",
          year: "2023",
        },
      ],
      popularTalks: [
        {
          title: "Marketing Digital: Stratégies gagnantes 2024",
          description: "Les dernières tendances et stratégies pour réussir en marketing digital",
          duration: "45 minutes",
          level: "intermediaire",
          category: "Marketing",
        },
      ],
    },
  },
  {
    id: "4",
    title: "Thomas Bernard",
    slug: "thomas-bernard",
    content: `<p>Thomas Bernard est consultant en finance d'entreprise et expert en levée de fonds.</p>`,
    excerpt: "Consultant finance d'entreprise, expert levée de fonds, 8 ans d'expérience",
    date: new Date().toISOString(),
    featuredImage: {
      node: {
        sourceUrl: "/placeholder.svg?height=400&width=400",
        altText: "Thomas Bernard",
      },
    },
    speakerDetails: {
      bio: "Consultant en finance d'entreprise et expert en levée de fonds avec 8 ans d'expérience.",
      company: "Finance Pro Conseil",
      jobTitle: "Consultant Senior",
      location: "Toulouse, France",
      email: "thomas@financepro.fr",
      experience: 8,
      rating: 4.6,
      reviewsCount: 62,
      talksGiven: 38,
      expertise: ["Finance", "Levée de fonds", "Stratégie"],
      skills: ["Business Plan", "Valorisation", "Due Diligence", "Négociation"],
      languages: ["Français", "Anglais", "Italien"],
      availability: "busy",
      hourlyRate: 1100,
      travelWillingness: false,
      socialLinks: {
        linkedin: "https://linkedin.com/in/thomas-bernard-finance",
      },
      achievements: ["100M€ levés pour ses clients", "Certification CFA", "Auteur 'Guide de la levée de fonds'"],
      certifications: [
        {
          name: "CFA Charter",
          issuer: "CFA Institute",
          year: "2019",
        },
      ],
      popularTalks: [
        {
          title: "Réussir sa levée de fonds en 2024",
          description: "Guide complet pour préparer et réussir sa levée de fonds",
          duration: "60 minutes",
          level: "avance",
          category: "Finance",
        },
      ],
    },
  },
  {
    id: "5",
    title: "Marie Dubois",
    slug: "marie-dubois",
    content: `<p>Marie Dubois est experte en ressources humaines et management d'équipe.</p>`,
    excerpt: "Experte RH et management d'équipe, 15 ans d'expérience",
    date: new Date().toISOString(),
    featuredImage: {
      node: {
        sourceUrl: "/placeholder.svg?height=400&width=400",
        altText: "Marie Dubois",
      },
    },
    speakerDetails: {
      bio: "Experte en ressources humaines et management d'équipe avec 15 ans d'expérience.",
      company: "RH Solutions",
      jobTitle: "Directrice RH",
      location: "Nantes, France",
      email: "marie@rhsolutions.fr",
      experience: 15,
      rating: 4.8,
      reviewsCount: 103,
      talksGiven: 67,
      expertise: ["RH", "Management", "Leadership"],
      skills: ["Recrutement", "Formation", "Gestion des talents", "Communication"],
      languages: ["Français", "Anglais"],
      availability: "unavailable",
      hourlyRate: 900,
      travelWillingness: true,
      socialLinks: {
        linkedin: "https://linkedin.com/in/marie-dubois-rh",
      },
      achievements: ["Certification SHRM", "Prix RH Manager de l'année 2022", "Formatrice certifiée"],
      certifications: [
        {
          name: "SHRM Certified Professional",
          issuer: "SHRM",
          year: "2020",
        },
      ],
      popularTalks: [
        {
          title: "Management moderne: Motiver et fédérer ses équipes",
          description: "Techniques modernes de management pour optimiser la performance d'équipe",
          duration: "50 minutes",
          level: "tous-niveaux",
          category: "Management",
        },
      ],
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
      // Pour le filtrage par ville, on pourrait utiliser un champ ACF ou une taxonomie
      params.meta_key = "city"
      params.meta_value = variables.city
    }

    try {
      const eventPosts = await getCustomPosts("events", params)
      const events = eventPosts.map(convertToEvent)

      return {
        nodes: events,
        pageInfo: {
          hasNextPage: eventPosts.length >= Number.parseInt(params.per_page, 10),
          endCursor: eventPosts.length > 0 ? eventPosts[eventPosts.length - 1].id.toString() : null,
        },
      }
    } catch (error) {
      console.log("Type de post personnalisé 'events' non trouvé, utilisation des posts standard")
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
    console.log("Utilisation des données simulées pour les événements")
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
      console.log("Type de post personnalisé 'events' non trouvé, recherche dans les posts standard")
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
      console.log("Type de post personnalisé 'events' non trouvé, utilisation des posts standard")
      const posts = await getPosts({ per_page: "100" })
      return posts.map((post) => post.slug)
    }
  } catch (error) {
    console.error("Error fetching event slugs:", error)
    return MOCK_EVENTS.map((event) => event.slug)
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
      console.log("Type de post personnalisé 'speakers' non trouvé, utilisation des données simulées")
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
        speaker.speakerDetails.skills?.some((skill) => skill.toLowerCase().includes(searchTerm)),
    )
  }

  // Filtrage par disponibilité
  if (variables?.availability && variables.availability !== "all") {
    filteredSpeakers = filteredSpeakers.filter(
      (speaker) => speaker.speakerDetails.availability === variables.availability,
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
      console.log("Type de post personnalisé 'speakers' non trouvé, recherche dans les posts standard")
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
      console.log("Type de post personnalisé 'speakers' non trouvé, utilisation des posts avec catégorie 'speaker'")
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
    // Dans une implémentation réelle, on pourrait utiliser une relation entre posts
    // ou une requête avec meta_query pour trouver les événements liés à un speaker
    console.log("Relation événements-speakers non implémentée dans l'API WordPress")
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
