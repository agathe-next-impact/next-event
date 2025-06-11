import type { Event, Speaker } from "./wordpress-rest"
import type { WPPost } from "./wordpress-api"

// Fonction utilitaire pour extraire les données ACF
function extractACFData(post: WPPost) {
  // Essayer d'obtenir les données ACF de différentes sources possibles
  return post.acf || post.meta || {}
}

// Fonction utilitaire pour traiter les taxonomies
function processTaxonomies(post: WPPost, taxonomyName: string) {
  if (!post._embedded || !post._embedded["wp:term"]) {
    return []
  }

  // Parcourir les termes embarqués pour trouver la taxonomie spécifique
  for (const termGroup of post._embedded["wp:term"]) {
    const terms = termGroup.filter((term: any) => term.taxonomy === taxonomyName)
    if (terms.length > 0) {
      return terms.map((term: any) => term.name)
    }
  }
  return []
}

// Fonction pour convertir un post WordPress en événement
export function convertToEvent(post: WPPost): Event {
  // Récupérer l'URL de l'image mise en avant
  const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]

  // Récupérer les catégories
  const categories = post._embedded?.["wp:term"]?.[0] || []
  const category = categories.length > 0 ? categories[0].name : "Non catégorisé"

  // Récupérer les champs ACF
  const acfData = extractACFData(post)

  // Dates (à adapter selon votre structure)
  const startDate = acfData.start_date || acfData.startDate || post.date
  const endDate = acfData.end_date || acfData.endDate || post.date
  const registrationDeadline = acfData.registration_deadline || acfData.registrationDeadline || post.date

  // Autres détails
  const location = acfData.location || "À déterminer"
  const city = acfData.city || "Paris"
  const maxAttendees = Number.parseInt(acfData.max_attendees || acfData.maxAttendees || "100", 10)
  const currentAttendees = Number.parseInt(acfData.current_attendees || acfData.currentAttendees || "0", 10)
  const price = Number.parseFloat(acfData.price || "0")
  const isFree = price <= 0

  // Agenda (si disponible)
  let agenda = []
  if (Array.isArray(acfData.agenda)) {
    agenda = acfData.agenda.map((item: any) => ({
      time: item.time || "",
      title: item.title || "",
      description: item.description || "",
    }))
  }

  return {
    id: post.id.toString(),
    title: post.title.rendered,
    slug: post.slug,
    content: post.content.rendered,
    excerpt: post.excerpt.rendered,
    date: post.date,
    featuredImage: featuredImage
      ? {
          node: {
            sourceUrl: featuredImage.source_url,
            altText: featuredImage.alt_text || post.title.rendered,
          },
        }
      : undefined,
    eventDetails: {
      startDate,
      endDate,
      location,
      city,
      category,
      maxAttendees,
      currentAttendees,
      registrationDeadline,
      price,
      isFree,
      prerequisites: acfData.prerequisites || "",
      materialProvided: acfData.material_provided || acfData.materialProvided || "",
      agenda,
    },
    seo: {
      title: post.title.rendered,
      metaDesc: post.excerpt.rendered,
      opengraphImage: featuredImage
        ? {
            sourceUrl: featuredImage.source_url,
          }
        : undefined,
    },
  }
}

// Fonction pour convertir un post WordPress en speaker
export function convertToSpeaker(post: WPPost): Speaker {
  // Récupérer l'URL de l'image mise en avant
  const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]

  // Récupérer les champs ACF
  const acfData = extractACFData(post)

  // Expertise (à adapter selon votre structure)
  let expertise = []
  if (Array.isArray(acfData.expertise)) {
    expertise = acfData.expertise
  } else if (acfData.expertise) {
    expertise = [acfData.expertise]
  } else {
    // Essayer de récupérer depuis les taxonomies
    expertise = processTaxonomies(post, "expertise")
  }

  // Skills
  let skills = []
  if (Array.isArray(acfData.skills)) {
    skills = acfData.skills
  } else if (acfData.skills) {
    skills = [acfData.skills]
  }

  // Languages
  let languages = []
  if (Array.isArray(acfData.languages)) {
    languages = acfData.languages.map((lang: any) => {
      if (typeof lang === "object" && lang !== null) {
        return lang.language || String(lang)
      }
      return String(lang)
    })
  } else if (acfData.languages) {
    languages = [acfData.languages]
  }

  // Achievements
  let achievements = []
  if (Array.isArray(acfData.achievements)) {
    achievements = acfData.achievements.map((achievement: any) => {
      if (typeof achievement === "object" && achievement !== null) {
        return achievement.title || String(achievement)
      }
      return String(achievement)
    })
  } else if (acfData.achievements) {
    achievements = [acfData.achievements]
  }

  // Social links
  const socialLinks = {
    linkedin: acfData.linkedin || acfData.social_linkedin,
    twitter: acfData.twitter || acfData.social_twitter,
    github: acfData.github || acfData.social_github,
    website: acfData.website || acfData.social_website,
    youtube: acfData.youtube || acfData.social_youtube,
  }

  // Certifications - s'assurer que c'est un tableau d'objets valides
  let certifications = []
  if (Array.isArray(acfData.certifications)) {
    certifications = acfData.certifications.map((cert: any) => {
      if (typeof cert === "object" && cert !== null) {
        return {
          name: cert.name || cert.certification_name || "",
          issuer: cert.issuer || cert.certification_issuer || "",
          year: cert.year || cert.certification_year || "",
        }
      }
      return {
        name: String(cert || ""),
        issuer: "",
        year: "",
      }
    })
  }

  // Popular talks - s'assurer que c'est un tableau d'objets valides
  let popularTalks = []
  if (Array.isArray(acfData.popular_talks)) {
    popularTalks = acfData.popular_talks.map((talk: any) => {
      if (typeof talk === "object" && talk !== null) {
        return {
          title: talk.title || talk.talk_title || "",
          description: talk.description || talk.talk_description || "",
          duration: talk.duration || talk.talk_duration || "30 min",
          level: talk.level || talk.talk_level || "Intermédiaire",
          category: talk.category || talk.talk_category || "Général",
          videoUrl: talk.video_url || talk.talk_video_url || undefined,
        }
      }
      return {
        title: String(talk || ""),
        description: "",
        duration: "30 min",
        level: "Intermédiaire",
        category: "Général",
        videoUrl: undefined,
      }
    })
  }

  return {
    id: post.id.toString(),
    title: post.title.rendered,
    slug: post.slug,
    content: post.content.rendered,
    excerpt: post.excerpt.rendered,
    date: post.date,
    featuredImage: featuredImage
      ? {
          node: {
            sourceUrl: featuredImage.source_url,
            altText: featuredImage.alt_text || post.title.rendered,
          },
        }
      : undefined,
    speakerDetails: {
      bio: post.excerpt.rendered,
      company: acfData.company || "",
      jobTitle: acfData.job_title || acfData.jobTitle || "",
      location: acfData.location || "Paris, France",
      email: acfData.email || "contact@example.com",
      phone: acfData.phone,
      website: acfData.website,
      experience: Number.parseInt(acfData.experience || "5", 10),
      rating: Number.parseFloat(acfData.rating || "4.5"),
      reviewsCount: Number.parseInt(acfData.reviews_count || acfData.reviewsCount || "10", 10),
      talksGiven: Number.parseInt(acfData.talks_given || acfData.talksGiven || "5", 10),
      expertise,
      skills,
      languages,
      availability: (acfData.availability || "available") as "available" | "busy" | "unavailable",
      hourlyRate: Number.parseInt(acfData.hourly_rate || acfData.hourlyRate || "0", 10),
      travelWillingness: Boolean(acfData.travel_willingness || acfData.travelWillingness || true),
      socialLinks,
      achievements,
      certifications,
      popularTalks,
    },
    seo: {
      title: post.title.rendered,
      metaDesc: post.excerpt.rendered,
      opengraphImage: featuredImage
        ? {
            sourceUrl: featuredImage.source_url,
          }
        : undefined,
    },
  }
}
