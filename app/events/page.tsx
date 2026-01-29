export const revalidate = 3600; // Revalidate every hour
import type { Metadata } from "next";
import { getEvents } from "@/lib/graphql";
import dynamic from "next/dynamic";
const EventsList = dynamic(() => import("@/components/events-list"), { ssr: false });

export const metadata: Metadata = {
  title: "Tous les Événements - Event Portal",
  description:
    "Découvrez tous les événements à venir, ateliers, conférences et meetups. Trouvez votre prochaine opportunité d'apprentissage.",
  openGraph: {
    title: "Tous les Événements - Event Portal",
    description:
      "Découvrez tous les événements à venir, ateliers, conférences et meetups.",
    type: "website",
  },
};

interface EventsPageProps {
  searchParams: {
    category?: string;
    city?: string;
    page?: string;
  };
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const category = searchParams.category || "all";
  const city = searchParams.city || "all";
  const page = Number.parseInt(searchParams.page || "1");
  const eventsPerPage = 12;

  // OPTIMISATION: Un seul appel API qui récupère tous les événements
  // Le filtrage côté client est plus performant que 2 appels API
  const allEventsData = await getEvents({ first: 100 });
  const allEvents = allEventsData.nodes || [];

  // Extract unique categories and cities for filters depuis les données déjà chargées
  const categories = Array.from(
    new Set(
      allEvents
        .map((event) => {
          const cat = event.eventDetails.category;
          if (typeof cat === 'object' && cat !== null && 'name' in cat) return cat.name;
          if (typeof cat === 'string') return cat;
          return undefined;
        })
        .filter(Boolean)
    )
  ) as string[];

  const cities = Array.from(
    new Set(
      allEvents
        .map((event) => {
          const c = event.eventDetails.city;
          if (typeof c === 'object' && c !== null && 'name' in c) return c.name;
          if (typeof c === 'string') return c;
          return undefined;
        })
        .filter(Boolean)
    )
  ) as string[];

  // Filtrage côté serveur à partir des données déjà chargées
  let filteredEvents = allEvents;
  
  if (category !== "all") {
    filteredEvents = filteredEvents.filter((event) => {
      const cat = event.eventDetails.category;
      const catName = typeof cat === 'object' && cat !== null && 'name' in cat ? cat.name : cat;
      return catName === category;
    });
  }
  
  if (city !== "all") {
    filteredEvents = filteredEvents.filter((event) => {
      const c = event.eventDetails.city;
      const cityName = typeof c === 'object' && c !== null && 'name' in c ? c.name : c;
      return cityName === city;
    });
  }

  // Pagination
  const startIndex = 0;
  const endIndex = eventsPerPage * page;
  const events = filteredEvents.slice(startIndex, endIndex);
  const hasNextPage = filteredEvents.length > endIndex;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h1 className="text-4xl md:text-5xl">Tous les Événements</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Découvrez des événements exceptionnels, ateliers, conférences et
          meetups. Rejoignez notre communauté et élargissez vos connaissances.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-accent">
              {events.length}
            </div>
            <div className="text-sm text-muted-foreground">
              {category !== "all" || city !== "all"
                ? "Événements filtrés"
                : "Total Événements"}
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent">
              {categories.length}
            </div>
            <div className="text-sm text-muted-foreground">Catégories</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent">
              {cities.length}
            </div>
            <div className="text-sm text-muted-foreground">Villes</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent">
              {
                events.filter(
                  (e) => new Date(e.eventDetails.startDate) > new Date()
                ).length
              }
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
  );
}
