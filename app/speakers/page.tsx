export const revalidate = 3600; // Revalidate every hour
import type { Metadata } from "next"
import { getSpeakers } from "@/lib/wordpress-rest"
import dynamic from "next/dynamic"
const SpeakersList = dynamic(() => import("@/components/speakers-list"), { ssr: false })
import { Users } from "lucide-react"

export const metadata: Metadata = {
  title: "Speakers - Event Portal",
  description:
    "Découvrez nos speakers experts : entrepreneurs, dirigeants PME, consultants et leaders business qui partagent leur expertise lors de nos événements.",
  openGraph: {
    title: "Speakers - Event Portal",
    description: "Découvrez nos speakers experts qui partagent leur expertise lors de nos événements.",
    type: "website",
  },
}

interface SpeakersPageProps {
  searchParams: {
    expertise?: string
    company?: string
    location?: string
    page?: string
    search?: string
    availability?: string
    experience?: string
  }
}

export default async function SpeakersPage({ searchParams }: SpeakersPageProps) {
  const expertise = searchParams.expertise || "all"
  const company = searchParams.company || "all"
  const location = searchParams.location || "all"
  const availability = searchParams.availability || "all"
  const experience = searchParams.experience || "all"
  const search = searchParams.search || ""
  const page = Number.parseInt(searchParams.page || "1")
  const speakersPerPage = 12

  // OPTIMISATION: Un seul appel API qui récupère tous les speakers
  const allSpeakersData = await getSpeakers({ first: 100 })
  const allSpeakers = allSpeakersData.nodes || []

  // Extraire les domaines d'expertise uniques de tous les speakers
  const expertiseAreas = Array.from(
    new Set(allSpeakers.flatMap((speaker) => speaker.speakerDetails.expertise).filter(Boolean)),
  ) as string[]
  const companies = Array.from(new Set(allSpeakers.map((speaker) => speaker.speakerDetails.company).filter(Boolean))) as string[]
  const locations = Array.from(new Set(allSpeakers.map((speaker) => speaker.speakerDetails.location).filter(Boolean))) as string[]

  // Filtrage côté serveur à partir des données déjà chargées
  let filteredSpeakers = allSpeakers

  if (expertise !== "all") {
    filteredSpeakers = filteredSpeakers.filter((speaker) => 
      speaker.speakerDetails.expertise?.includes(expertise)
    )
  }

  if (company !== "all") {
    filteredSpeakers = filteredSpeakers.filter((speaker) => 
      speaker.speakerDetails.company === company
    )
  }

  if (location !== "all") {
    filteredSpeakers = filteredSpeakers.filter((speaker) => 
      speaker.speakerDetails.location === location
    )
  }

  if (availability !== "all") {
    filteredSpeakers = filteredSpeakers.filter((speaker) => 
      (speaker.speakerDetails as any).availability === availability
    )
  }

  if (experience !== "all") {
    const expYears = Number.parseInt(experience)
    filteredSpeakers = filteredSpeakers.filter((speaker) => 
      speaker.speakerDetails.experience && speaker.speakerDetails.experience >= expYears
    )
  }

  if (search) {
    const searchLower = search.toLowerCase()
    filteredSpeakers = filteredSpeakers.filter((speaker) => 
      speaker.title?.toLowerCase().includes(searchLower) ||
      speaker.speakerDetails.bio?.toLowerCase().includes(searchLower) ||
      speaker.speakerDetails.company?.toLowerCase().includes(searchLower)
    )
  }

  // Pagination
  const startIndex = 0
  const endIndex = speakersPerPage * page
  const speakers = filteredSpeakers.slice(startIndex, endIndex)
  const hasNextPage = filteredSpeakers.length > endIndex

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h1 className="text-4xl md:text-5xl">Nos Speakers</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Découvrez les experts qui partagent leur passion et leur expertise lors de nos événements. Entrepreneurs,
          dirigeants PME, consultants et leaders business de renom.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-accent">{speakers.length}</div>
            <div className="text-sm text-muted-foreground">
              {search ||
              expertise !== "all" ||
              company !== "all" ||
              location !== "all" ||
              availability !== "all" ||
              experience !== "all"
                ? "Speakers filtrés"
                : "Total Speakers"}
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent">{expertiseAreas.length}</div>
            <div className="text-sm text-muted-foreground">Domaines d'expertise</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent">{companies.length}</div>
            <div className="text-sm text-muted-foreground">Entreprises représentées</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent">
              {allSpeakers.filter((s) => s.speakerDetails.rating && s.speakerDetails.rating >= 4.5).length}
            </div>
            <div className="text-sm text-muted-foreground">Speakers 5 étoiles</div>
          </div>
        </div>
      </div>

      {/* Speakers List Component */}
      <SpeakersList
        speakers={speakers}
        expertiseAreas={expertiseAreas}
        companies={companies}
        locations={locations}
        currentExpertise={expertise}
        currentCompany={company}
        currentLocation={location}
        currentAvailability={availability}
        currentExperience={experience}
        currentSearch={search}
        currentPage={page}
        hasNextPage={hasNextPage}
        speakersPerPage={speakersPerPage}
      />
    </div>
  )
}
