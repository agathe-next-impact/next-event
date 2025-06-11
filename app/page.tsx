import { getEvents } from "@/lib/graphql"
import Calendar from "@/components/calendar"
import DevTools from "@/components/dev-tools"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CalendarDays, Users, Settings } from "lucide-react"

export default async function HomePage() {
  const eventsData = await getEvents({ first: 50 })
  const events = eventsData.nodes || []

  // Extract unique categories
  const categories = Array.from(new Set(events.map((event) => event.eventDetails.category).filter(Boolean)))

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Découvrez des Événements Exceptionnels</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Rejoignez des milliers de participants à nos événements soigneusement sélectionnés. Des ateliers aux
          conférences, trouvez votre prochaine opportunité d'apprentissage.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/events">
            <Button size="lg">
              <CalendarDays className="mr-2 h-5 w-5" />
              Parcourir tous les événements
            </Button>
          </Link>
          <Button variant="outline" size="lg">
            <Users className="mr-2 h-5 w-5" />
            Devenir Speaker
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="text-center p-6 bg-muted/50 rounded-lg">
          <div className="text-3xl font-bold text-primary mb-2">{events.length}+</div>
          <div className="text-muted-foreground">Événements à venir</div>
        </div>
        <div className="text-center p-6 bg-muted/50 rounded-lg">
          <div className="text-3xl font-bold text-primary mb-2">{categories.length}+</div>
          <div className="text-muted-foreground">Catégories</div>
        </div>
        <div className="text-center p-6 bg-muted/50 rounded-lg">
          <div className="text-3xl font-bold text-primary mb-2">10k+</div>
          <div className="text-muted-foreground">Participants satisfaits</div>
        </div>
      </div>

      {/* Calendar Component */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Calendrier des événements</h2>
        <Calendar events={events} categories={categories} />
      </div>

      {/* Dev Tools Section - Only in development */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="h-6 w-6" />
          <h2 className="text-3xl font-bold">Outils de développement</h2>
        </div>
        <DevTools />
      </div>
    </div>
  )
}

export const revalidate = 3600 // Revalidate every hour
