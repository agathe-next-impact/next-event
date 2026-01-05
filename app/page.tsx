import { getEvents } from "@/lib/graphql"
import Calendar from "@/components/calendar"
import DevTools from "@/components/dev-tools"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { CalendarDays, Users, Settings } from "lucide-react"
import React from "react"
import { cn } from "@/lib/utils"

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
         
      <div className="container h-[80vh] grid grid-cols-1 md:grid-cols-2 place-content-center gap-24 mx-auto px-4 py-8 inset-4">
        {/* Hero Section */}
        <div className="mb-12">
          <div>
          <h1 className="text-4xl md:text-6xl font-ligh text-black mb-4">Evénements<br />
          Tech & Business</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
            Rejoignez des milliers de participants à nos événements soigneusement sélectionnés. Des ateliers aux
            conférences, trouvez votre prochaine opportunité d'apprentissage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
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
          {/*
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12 place-items-start">

          <div className="text-center p-6 bg-card/10 rounded-lg">
            <div className="text-3xl font-bold text-primary mb-2">{events.length}+</div>
            <div className="text-muted-foreground">Événements à venir</div>
          </div>
          <div className="text-center p-6 bg-card/10 rounded-lg">
            <div className="text-3xl font-bold text-primary mb-2">{categories.length}+</div>
            <div className="text-muted-foreground">Catégories</div>
          </div>
          <div className="text-center p-6 bg-card/10 rounded-lg">
            <div className="text-3xl font-bold text-primary mb-2">10k+</div>
            <div className="text-muted-foreground">Participants satisfaits</div>
          </div>
        </div>
          */}
        </div>
        </div>

        {/* Stats Bar */}
        

        {/* Stats */}
        <div>
          <div className="h-max">
          <Image
            src="/images/hero.jpg"
            alt="Hero Image"
            width={500}
            height={300}
            className="w-128 max-h-82 object-cover rounded-lg shadow-lg col-span-1 md:col-span-2"
          />
          </div>
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
