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
const API_BASE_URL = "https://mediumseagreen-gazelle-452030.hostingersite.com/wp-json/wp/v2"

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
  return fetchAPI<WPPost[]>(`/${postType}`, defaultParams)
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
