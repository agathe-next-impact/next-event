// Types pour les données WordPress
export interface WPPost {
  id: number
  date: string
  slug: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
  }
  excerpt: {
    rendered: string
  }
  featured_media: number
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string
      alt_text: string
    }>
    "wp:term"?: Array<
      Array<{
        id: number
        name: string
        slug: string
      }>
    >
  }
  meta: Record<string, any>
  acf?: Record<string, any> // Pour les champs ACF si disponibles
}

export interface WPMedia {
  id: number
  source_url: string
  alt_text: string
}

export interface WPTerm {
  id: number
  name: string
  slug: string
  count: number
}

// Configuration de l'API
const API_BASE_URL = process.env.WORDPRESS_REST_API_ENDPOINT || "https://admin.next-event.fr/wp-json/wp/v2"

// Fonction utilitaire pour les requêtes API
async function fetchAPI<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  // Construire l'URL avec les paramètres
  const queryParams = new URLSearchParams(params).toString()
  const url = `${API_BASE_URL}${endpoint}${queryParams ? `?${queryParams}` : ""}`

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    return (await response.json()) as T
  } catch (error) {
    console.error(`Error fetching from WordPress API: ${error}`)
    throw error
  }
}

// Fonction pour récupérer les articles (posts)
export async function getPosts(params: Record<string, string> = {}): Promise<WPPost[]> {
  // Ajouter _embed pour récupérer les médias et termes associés
  const defaultParams = { _embed: "true", per_page: "20", ...params }
  return fetchAPI<WPPost[]>("/posts", defaultParams)
}

// Fonction pour récupérer un article par son slug
export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  try {
    const posts = await fetchAPI<WPPost[]>("/posts", {
      slug,
      _embed: "true",
    })

    return posts.length > 0 ? posts[0] : null
  } catch (error) {
    console.error(`Error fetching post by slug: ${error}`)
    return null
  }
}

// Fonction pour récupérer les médias
export async function getMedia(id: number): Promise<WPMedia | null> {
  try {
    return await fetchAPI<WPMedia>(`/media/${id}`)
  } catch (error) {
    console.error(`Error fetching media: ${error}`)
    return null
  }
}

// Fonction pour récupérer les catégories
export async function getCategories(): Promise<WPTerm[]> {
  return fetchAPI<WPTerm[]>("/categories", { per_page: "100" })
}

// Fonction pour récupérer la valeur d'un terme de taxonomie par son ID
export async function getTermById(termId: number): Promise<WPTerm | null> {
  try {
    const terms = await fetchAPI<WPTerm[]>(`/terms/${termId}`)
    return terms.length > 0 ? terms[0] : null
  } catch (error) {
    console.error(`Error fetching term by ID: ${error}`)
    return null
  }
}

// Fonction pour récupérer les tags
export async function getTags(): Promise<WPTerm[]> {
  return fetchAPI<WPTerm[]>("/tags", { per_page: "100" })
}

// Fonction pour vérifier si l'API est accessible
export async function testAPIConnection(): Promise<{
  success: boolean
  message: string
  data?: any
  error?: string
}> {
  try {
    const response = await fetch(`${API_BASE_URL}`)

    if (!response.ok) {
      return {
        success: false,
        message: `Erreur de connexion: ${response.status} ${response.statusText}`,
        error: await response.text(),
      }
    }

    // Récupérer les informations de base
    const data = await response.json()

    return {
      success: true,
      message: "Connexion à l'API WordPress réussie",
      data,
    }
  } catch (error) {
    return {
      success: false,
      message: "Échec de la connexion à l'API WordPress",
      error: error instanceof Error ? error.message : "Erreur inconnue",
    }
  }
}

// Fonction pour récupérer les types de posts personnalisés
export async function getCustomPostTypes(): Promise<string[]> {
  try {
    const types = await fetchAPI<Record<string, any>>("/types")
    return Object.keys(types).filter(
      (type) =>
        !["post", "page", "attachment", "nav_menu_item", "wp_block", "wp_template", "wp_template_part"].includes(type),
    )
  } catch (error) {
    console.error(`Error fetching custom post types: ${error}`)
    return []
  }
}

// Fonction pour récupérer les posts d'un type personnalisé
export async function getCustomPosts(postType: string, params: Record<string, string> = {}): Promise<WPPost[]> {
  const defaultParams = { _embed: "true", per_page: "20", ...params }
  const result = await fetchAPI<WPPost[]>(`/${postType}`, defaultParams)
  if (Array.isArray(result)) {
    return result
  } else if (result && Array.isArray(result.data)) {
    return result.data
  } else {
    console.error(`[getCustomPosts] Format inattendu pour ${postType}:`, result)
    return []
  }
}

// Fonction pour récupérer les champs ACF disponibles (si l'API ACF est exposée)
export async function getACFFields(): Promise<any> {
  try {
    return await fetchAPI<any>("/acf/v3/posts")
  } catch (error) {
    console.error(`ACF API might not be available: ${error}`)
    return null
  }
}

// Nouveau fichier pour la logique API WordPress

export interface WordPressReservationPayload {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  notes: string
  eventId: string
}

export interface WordPressReservationResult {
  success: boolean
  confirmationCode?: string
  message: string
  emailSent?: boolean
}

export async function createWordPressReservation(
  payload: WordPressReservationPayload
): Promise<WordPressReservationResult> {
  try {
    const username = process.env.WORDPRESS_API_USER
    const password = process.env.WORDPRESS_API_PASSWORD

    if (!username || !password) {
      throw new Error("Identifiants API WordPress manquants (variables d'environnement)")
    }

    // Chercher un participant existant avec cet email
    const checkUrl = `${API_BASE_URL}/participant?acf_email=${encodeURIComponent(payload.email)}&_embed=true`
    const checkResponse = await fetch(checkUrl)
    if (!checkResponse.ok) {
      throw new Error("Erreur lors de la vérification des inscriptions existantes")
    }
    const existing = await checkResponse.json()

    if (Array.isArray(existing) && existing.length > 0) {
      const participant = existing[0]
      let events: string[] = []
      if (Array.isArray(participant.acf?.event)) {
        events = participant.acf.event.map((e: any) => String(e))
      } else if (participant.acf?.event) {
        events = [String(participant.acf.event)]
      }
      if (!events.includes(payload.eventId)) {
        events.push(payload.eventId)
        const authHeader = "Basic " + Buffer.from(`${username}:${password}`).toString("base64")
        const updateResponse = await fetch(`${API_BASE_URL}/participant/${participant.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify({
            acf: {
              ...participant.acf,
              event: events,
            },
          }),
        })
        if (!updateResponse.ok) {
          const error = await updateResponse.json()
          throw new Error(error.message || "Erreur lors de la mise à jour du participant")
        }
        // Créer une réservation liant participant et événement
        await createReservationCPT(participant.id, payload.eventId, username, password)
        return {
          success: true,
          message: "Votre inscription à ce nouvel événement a été ajoutée à votre profil participant.",
        }
      } else {
        return {
          success: false,
          message: "Vous êtes déjà inscrit à cet événement avec cette adresse email.",
        }
      }
    }

    // Création du participant
    const authHeader = "Basic " + Buffer.from(`${username}:${password}`).toString("base64")
    const wpResponse = await fetch(`${API_BASE_URL}/participant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        title: `${payload.firstName} ${payload.lastName}`,
        status: "publish",
        acf: {
          first_name: payload.firstName,
          last_name: payload.lastName,
          email: payload.email,
          phone: payload.phone,
          company: payload.company,
          notes: payload.notes,
          event: [payload.eventId],
        },
      }),
    })

    if (!wpResponse.ok) {
      const error = await wpResponse.json()
      throw new Error(error.message || "Erreur lors de l'enregistrement WordPress")
    }

    const newParticipant = await wpResponse.json()

    // Créer une réservation liant participant et événement
    await createReservationCPT(newParticipant.id, payload.eventId, username, password)

    return {
      success: true,
      message: "Réservation confirmée et enregistrée dans WordPress !",
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Une erreur inattendue s'est produite",
    }
  }
}

// Fonction utilitaire pour créer une entrée CPT réservation
async function createReservationCPT(
  participantId: number,
  eventId: string,
  username: string,
  password: string
) {
  const authHeader = "Basic " + Buffer.from(`${username}:${password}`).toString("base64")
  await fetch(`${API_BASE_URL}/reservation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify({
      title: `Réservation participant ${participantId} - événement ${eventId}`,
      status: "publish",
      acf: {
        participant: participantId,
        event: eventId,
      },
    }),
  })
}

/**
 * Appelle l'API interne Next.js pour créer une réservation côté client.
 * À utiliser dans les composants React.
 */
export async function createReservationViaApiRoute(payload: WordPressReservationPayload): Promise<WordPressReservationResult> {
  const response = await fetch("/api/reservation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Erreur lors de la réservation")
  }
  return response.json()
}


// calcule le nombre de places réservées pour un événement
export async function getReservedSeats(eventId: string): Promise<number> {
  try {
    const response = await fetch(`${API_BASE_URL}/participant?event=${eventId}`)
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des réservations : ${response.statusText}`)
    }
    const data = await response.json()
    return data.length
  } catch (error) {
    console.error(`Erreur lors de la récupération des réservations : ${error}`)
    return 0
  }
}

// Fonction pour récupérer un événement par slug en mode preview (avec authentification)
export async function getEventBySlugWithPreview(slug: string): Promise<any | null> {
  const username = process.env.WORDPRESS_API_USER
  const password = process.env.WORDPRESS_API_PASSWORD

  if (!username || !password) {
    console.error("Identifiants API WordPress manquants pour le mode preview")
    return null
  }

  const authHeader = "Basic " + Buffer.from(`${username}:${password}`).toString("base64")

  try {
    // Essayer d'abord le CPT events avec status=any pour inclure les brouillons
    const eventsUrl = `${API_BASE_URL}/events?slug=${encodeURIComponent(slug)}&status=any&_embed=true`
    const response = await fetch(eventsUrl, {
      headers: { Authorization: authHeader },
      cache: "no-store",
    })

    if (response.ok) {
      const events = await response.json()
      if (Array.isArray(events) && events.length > 0) {
        return convertWPPostToEvent(events[0])
      }
    }

    // Fallback sur les posts standards
    const postsUrl = `${API_BASE_URL}/posts?slug=${encodeURIComponent(slug)}&status=any&_embed=true`
    const postsResponse = await fetch(postsUrl, {
      headers: { Authorization: authHeader },
      cache: "no-store",
    })

    if (postsResponse.ok) {
      const posts = await postsResponse.json()
      if (Array.isArray(posts) && posts.length > 0) {
        return convertWPPostToEvent(posts[0])
      }
    }

    return null
  } catch (error) {
    console.error("Erreur lors de la récupération de l'événement en preview:", error)
    return null
  }
}

// Convertit un WPPost en format Event attendu par l'application
function convertWPPostToEvent(post: WPPost): any {
  const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0]

  return {
    id: String(post.id),
    title: post.title?.rendered || "",
    slug: post.slug,
    content: post.content?.rendered || "",
    excerpt: post.excerpt?.rendered || "",
    date: post.date,
    featuredImage: featuredMedia
      ? {
          node: {
            sourceUrl: featuredMedia.source_url,
            altText: featuredMedia.alt_text || "",
          },
        }
      : undefined,
    eventDetails: {
      startDate: post.acf?.start_date || post.acf?.startDate || post.date,
      endDate: post.acf?.end_date || post.acf?.endDate || post.date,
      location: post.acf?.location || "",
      city: post.acf?.city || { name: "", slug: "" },
      category: post.acf?.category || { name: "", slug: "" },
      maxAttendees: post.acf?.max_attendees || post.acf?.maxAttendees || 0,
      currentAttendees: post.acf?.current_attendees || post.acf?.currentAttendees || 0,
      registrationDeadline: post.acf?.registration_deadline || post.acf?.registrationDeadline,
      price: post.acf?.price || 0,
      isFree: post.acf?.is_free ?? post.acf?.isFree ?? true,
      speakers: post.acf?.speakers || [],
    },
  }
}
