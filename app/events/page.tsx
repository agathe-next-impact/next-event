import type { Metadata } from "next"
import { getEvents } from "@/lib/wordpress-rest"
import EventsList from "@/components/events-list"
import { CalendarDays } from "lucide-react"

export const metadata: Metadata = {
  title: "Tous les Événements - Event Portal",
  description:
    "Découvrez tous les événements à venir, ateliers, conférences et meetups. Trouvez votre prochaine opportunité d'apprentissage.",
  openGraph: {
    title: "Tous les Événements - Event Portal",
    description: "Découvrez tous les événements à venir, ateliers, conférences et meetups.",
    type: "website",
  },
}

interface EventsPageProps {
  searchParams: {
    category?: string
    city?: string
    page?: string
  }
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const category = searchParams.category || "all"
  const city = searchParams.city || "all"
  const page = Number.parseInt(searchParams.page || "1")
  const eventsPerPage = 12

  // Fetch events with filters
  const eventsData = await getEvents({
    first: eventsPerPage * page,
    category: category !== "all" ? category : undefined,
    city: city !== "all" ? city : undefined,
  })

  const events = eventsData.nodes || []
  const hasNextPage = eventsData.pageInfo?.hasNextPage || false

  // Extract unique categories and cities for filters
  const allEventsData = await getEvents({ first: 100 })
  const allEvents = allEventsData.nodes || []
  const categories = Array.from(new Set(allEvents.map((event) => event.eventDetails.category).filter(Boolean)))
  const cities = Array.from(new Set(allEvents.map((event) => event.eventDetails.city).filter(Boolean)))

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <CalendarDays className="h-8 w-8 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold">Tous les Événements</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Découvrez des événements exceptionnels, ateliers, conférences et meetups. Rejoignez notre communauté et
          élargissez vos connaissances.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="bg-muted/50 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{events.length}</div>
            <div className="text-sm text-muted-foreground">
              {category !== "all" || city !== "all" ? "Événements filtrés" : "Total Événements"}
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{categories.length}</div>
            <div className="text-sm text-muted-foreground">Catégories</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{cities.length}</div>
            <div className="text-sm text-muted-foreground">Villes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {events.filter((e) => new Date(e.eventDetails.startDate) > new Date()).length}
            </div>
            <div className="text-sm text-muted-foreground">À venir</div>
          </div>
        </div>
      </div>

      {/* Events List Component */}
      <EventsList
        events={events}
        categories={categories}
        cities={cities}
        currentCategory={category}
        currentCity={city}
        currentPage={page}
        hasNextPage={hasNextPage}
        eventsPerPage={eventsPerPage}
      />
    </div>
  )
}

export const revalidate = 3600 // Revalidate every hour
