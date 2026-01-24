import { getEvents } from "@/lib/graphql"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { CalendarDays, Users } from "lucide-react"
import React, { Suspense } from "react"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

// Lazy load du Calendar (composant client lourd avec date-fns)
const Calendar = dynamic(() => import("@/components/calendar"), {
  loading: () => (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </div>
  ),
  ssr: true, // On garde le SSR pour le SEO
})

export default async function HomePage() {
  const eventsData = await getEvents({ first: 50 })
  const events = eventsData.nodes || []

  // Extract unique categories (ensure only strings)
  const categories = Array.from(
    new Set(
      events
        .map((event) => {
          const cat = event.eventDetails.category
          if (typeof cat === "string") return cat
          if (cat && typeof cat.name === "string") return cat.name
          return undefined
        })
        .filter((c): c is string => typeof c === "string")
    )
  )

  return (
    <>
      <div className="container min-h-[60vh] grid grid-cols-1 md:grid-cols-2 items-center gap-12 md:gap-24 mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 md:mb-0 flex flex-col justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-light text-black mb-4 leading-tight">
            Evénements<br />
            <span className="text-accent">Tech & Business</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl">
            Rejoignez des milliers de participants à nos événements soigneusement sélectionnés. Des ateliers aux conférences, trouvez votre prochaine opportunité d'apprentissage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Link href="/events" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                <CalendarDays className="mr-2 h-5 w-5" />
                Parcourir tous les événements
              </Button>
            </Link>
            <Link href="/become-speaker" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Users className="mr-2 h-5 w-5" />
                Devenir Speaker
              </Button>
            </Link>
          </div>
        </div>
        {/* Hero Image */}
        <div className="flex justify-center items-center w-full">
          <Image
            src="/images/hero.jpg"
            alt="Hero Image"
            width={500}
            height={300}
            sizes="(max-width: 768px) 100vw, 500px"
            className="w-full max-w-md md:max-w-lg h-auto object-cover rounded-xl shadow-lg"
            priority
          />
        </div>
      </div>

      {/* Stats Bar */}
      

      {/* Stats */}
      <div>
        <div className="h-max">
        </div>
      </div>

      {/* Calendar Component */}
      <div className=" container col-span-2 mx-auto px-4 py-8 ">
        <h2 className="text-4xl font-heading font-light mb-6">Calendrier des événements</h2>
        <Calendar events={events} categories={categories} />
      </div>

      {/* Dev Tools Section - Only in development 
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="h-6 w-6" />
          <h2 className="text-3xl font-bold">Outils de développement</h2>
        </div>
        <DevTools />
      </div>
      */}
    </>
  )
}

export const revalidate = 3600 // Revalidate every hour
