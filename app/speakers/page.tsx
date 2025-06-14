import type { Metadata } from "next"
import { getSpeakers } from "@/lib/wordpress-rest"
import SpeakersList from "@/components/speakers-list"
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

  // Fetch speakers with all filters applied
  const speakersData = await getSpeakers({
    first: speakersPerPage * page,
    expertise: expertise !== "all" ? expertise : undefined,
    company: company !== "all" ? company : undefined,
    location: location !== "all" ? location : undefined,
    search: search || undefined,
    availability: availability !== "all" ? availability : undefined,
    experience: experience !== "all" ? experience : undefined,
  })

  const speakers = speakersData.nodes || []
  const hasNextPage = speakersData.pageInfo?.hasNextPage || false

  // Extract unique values for filters from all speakers (unfiltered)
  const allSpeakersData = await getSpeakers({ first: 100 })
  const allSpeakers = allSpeakersData.nodes || []

  // Extraire les domaines d'expertise uniques de tous les speakers
  const expertiseAreas = Array.from(
    new Set(allSpeakers.flatMap((speaker) => speaker.speakerDetails.expertise).filter(Boolean)),
  )
  const companies = Array.from(new Set(allSpeakers.map((speaker) => speaker.speakerDetails.company).filter(Boolean)))
  const locations = Array.from(new Set(allSpeakers.map((speaker) => speaker.speakerDetails.location).filter(Boolean)))

  // Les speakers sont déjà filtrés par la fonction getSpeakers
  const filteredSpeakers = speakers

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
            <div className="text-2xl font-bold text-primary">{filteredSpeakers.length}</div>
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
            <div className="text-2xl font-bold text-primary">{expertiseAreas.length}</div>
            <div className="text-sm text-muted-foreground">Domaines d'expertise</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{companies.length}</div>
            <div className="text-sm text-muted-foreground">Entreprises représentées</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {allSpeakers.filter((s) => s.speakerDetails.rating && s.speakerDetails.rating >= 4.5).length}
            </div>
            <div className="text-sm text-muted-foreground">Speakers 5 étoiles</div>
          </div>
        </div>
      </div>

      {/* Speakers List Component */}
      <SpeakersList
        speakers={filteredSpeakers}
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

export const revalidate = 3600 // Revalidate every hour
