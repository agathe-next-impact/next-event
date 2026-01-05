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

  // Récupérer les catégories (catégorie principale)
  let categoryObj = { name: "Non catégorisé", slug: "non-categorise" };
  const categories = post._embedded?.["wp:term"]?.[0] || [];
  if (categories.length > 0) {
    categoryObj = {
      name: categories[0].name || "Non catégorisé",
      slug: categories[0].slug || "non-categorise",
    };
  }

  // Récupérer les champs ACF
  const acfData = extractACFData(post)

  // Dates (à adapter selon votre structure)
  const startDate = acfData.start_date || acfData.startDate || post.date
  const endDate = acfData.end_date || acfData.endDate || post.date
  const registrationDeadline = acfData.registration_deadline || acfData.registrationDeadline || post.date

  // Autres détails
  let cityObj = { name: "Paris", slug: "paris" };
  if (acfData.city && typeof acfData.city === 'object' && acfData.city.name && acfData.city.slug) {
    cityObj = { name: acfData.city.name, slug: acfData.city.slug };
  } else if (typeof acfData.city === 'string') {
    cityObj = { name: acfData.city, slug: acfData.city.toLowerCase().replace(/\s+/g, '-') };
  }

  const location = acfData.location || "À déterminer"
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
    id: post.id?.toString() ?? "",
    title: post.title?.rendered ?? "",
    slug: post.slug ?? "",
    content: post.content?.rendered ?? "",
    excerpt: post.excerpt?.rendered ?? "",
    date: post.date ?? "",
    featuredImage: featuredImage
      ? {
          node: {
            sourceUrl: featuredImage.source_url,
            altText: featuredImage.alt_text || post.title?.rendered || "",
          },
        }
      : undefined,
    eventDetails: {
      startDate,
      endDate,
      location,
      city: cityObj,
      category: categoryObj,
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
      title: post.title?.rendered ?? "",
      metaDesc: post.excerpt?.rendered ?? "",
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

  // Expertises (wysiwyg ou texte séparé par virgule)
  let expertises: string[] = [];
  if (Array.isArray(acfData.expertises)) {
    expertises = acfData.expertises;
  } else if (typeof acfData.expertises === 'string') {
    // Si wysiwyg, on extrait les mots clés séparés par virgule ou saut de ligne
    expertises = acfData.expertises.split(/,|\n/).map((e: string) => e.trim()).filter(Boolean);
  }

  return {
    id: post.id?.toString() ?? "",
    title: post.title?.rendered ?? "",
    slug: post.slug ?? "",
    content: post.content?.rendered ?? "",
    excerpt: post.excerpt?.rendered ?? "",
    date: post.date ?? "",
    featuredImage: featuredImage
      ? {
          node: {
            sourceUrl: featuredImage.source_url,
            altText: featuredImage.alt_text || post.title?.rendered || "",
          },
        }
      : undefined,
    speakerDetails: {
      bio: acfData.bio || "",
      company: acfData.company || "",
      jobTitle: acfData.job_title || acfData.jobTitle || "",
      // Pas de location, experience, rating, reviewsCount, talksGiven dans ce schéma
      expertises: expertises.map((name) => ({ name, slug: name.toLowerCase().replace(/\s+/g, "-") })),
      expertise: expertises,
    },
    socialLinks: {
      linkedin: acfData.linkedin || "",
      twitter: acfData.twitter || "",
      github: acfData.github || "",
      website: acfData.website || "",
      youtube: acfData.youtube || "",
      mastodon: acfData.mastodon || "",
    },
    skillsAndAchievements: {
      // Les champs skills, certifications, achievements sont des wysiwyg (texte riche)
      skills: acfData.skills ? [{ name: acfData.skills, level: "" }] : [],
      certifications: acfData.certifications ? [{ name: acfData.certifications, issuer: "", year: "", url: "" }] : [],
      achievements: acfData.achievements ? [{ title: acfData.achievements, year: "", url: "", description: "" }] : [],
    },
    seoData: {
      metaTitle: acfData.meta_title || acfData.metaTitle || post.title?.rendered || "",
      metaDescription: acfData.meta_description || acfData.metaDescription || post.excerpt?.rendered || "",
      ogImage: featuredImage
        ? {
            sourceUrl: featuredImage.source_url,
          }
        : undefined,
      keywords: acfData.keywords || "",
    },
  }
}
