// Données de démo pour speakers (à importer dans la base ou à utiliser dans le mock de getSpeakers)
export const demoSpeakers = [
  {
    id: "1",
    slug: "jean-dupont",
    title: "Jean Dupont",
    featuredImage: {
      node: {
        sourceUrl: "/images/speakers/jean-dupont.jpg",
        altText: "Jean Dupont portrait"
      }
    },
    speakerDetails: {
      jobTitle: "CEO & Fondateur",
      company: "StartupX",
      location: "Paris",
      experience: 12,
      rating: 4.8,
      reviewsCount: 32,
      talksGiven: 18,
      hourlyRate: 350,
      travelWillingness: true,
      email: "jean.dupont@startupx.com",
      phone: "+33 1 23 45 67 89",
      bio: "Entrepreneur passionné, Jean accompagne les startups dans leur croissance et anime de nombreux ateliers sur l'innovation.",
      expertise: ["Entrepreneuriat", "Innovation", "Stratégie"],
      expertises: [
        { name: "Entrepreneuriat" },
        { name: "Innovation" },
        { name: "Stratégie" }
      ],
      socialLinks: {
        linkedin: "https://linkedin.com/in/jeandupont",
        twitter: "https://twitter.com/jeandupont",
        github: "https://github.com/jeandupont",
        website: "https://jeandupont.com"
      }
    },
    skillsAndAchievements: {
      achievements: [
        { title: "Prix de l'Innovation 2022", description: "Lauréat du prix national de l'innovation.", year: 2022, url: "https://prix-innovation.fr" }
      ],
      skills: [
        { name: "Leadership", level: "expert" },
        { name: "Lean Startup", level: "avance" }
      ],
      certifications: [
        { name: "Certification Lean Startup", issuer: "Startup Institute", year: 2021, url: "https://startupinstitute.com/certif" }
      ],
      languages: [
        { language: "Français", level: "natif" },
        { language: "Anglais", level: "C1" }
      ],
      popularTalks: [
        { title: "Innover en 2024", description: "Comment innover dans un monde incertain.", category: "Innovation", level: "avance", duration: "45min", videoUrl: "https://youtube.com/jeandupont-innovation" }
      ]
    }
  },
  {
    id: "2",
    slug: "marie-curie",
    title: "Marie Curie",
    featuredImage: {
      node: {
        sourceUrl: "/images/speakers/marie-curie.jpg",
        altText: "Marie Curie portrait"
      }
    },
    speakerDetails: {
      jobTitle: "Consultante Data Science",
      company: "DataLab",
      location: "Lyon",
      experience: 8,
      rating: 4.9,
      reviewsCount: 41,
      talksGiven: 25,
      hourlyRate: 400,
      travelWillingness: false,
      email: "marie.curie@datalab.com",
      phone: "+33 4 56 78 90 12",
      bio: "Experte en data science, Marie accompagne les entreprises dans la valorisation de leurs données.",
      expertise: ["Data Science", "IA", "Formation"],
      expertises: [
        { name: "Data Science" },
        { name: "IA" },
        { name: "Formation" }
      ],
      socialLinks: {
        linkedin: "https://linkedin.com/in/mariecurie",
        twitter: "https://twitter.com/mariecurie",
        github: "https://github.com/mariecurie",
        website: "https://mariecurie.com"
      }
    },
    skillsAndAchievements: {
      achievements: [
        { title: "Conférencière TEDx", description: "Intervention sur l'IA éthique.", year: 2023, url: "https://tedx.com/mariecurie" }
      ],
      skills: [
        { name: "Python", level: "expert" },
        { name: "Machine Learning", level: "avance" }
      ],
      certifications: [
        { name: "Data Scientist", issuer: "OpenClassrooms", year: 2020, url: "https://openclassrooms.com/certif" }
      ],
      languages: [
        { language: "Français", level: "natif" },
        { language: "Anglais", level: "B2" }
      ],
      popularTalks: [
        { title: "L'IA pour tous", description: "Démystifier l'intelligence artificielle.", category: "IA", level: "tous-niveaux", duration: "30min", videoUrl: "https://youtube.com/mariecurie-ia" }
      ]
    }
  }
]
