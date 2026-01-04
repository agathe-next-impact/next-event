import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Users, Clock, ArrowLeft, Building, UserCheck } from "lucide-react"
import { getEventBySlug, getEventSlugs } from "@/lib/wordpress-rest"
import { formatDate, generateOGImageUrl } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import dynamic from "next/dynamic"
import ReservationForm from "@/components/reservation-form"
import { getCityById } from "@/lib/graphql"
import { getReservedSeats } from "@/lib/wordpress-api"

interface EventPageProps {
  params: {
    slug: string
  }
  searchParams: {
    preview?: string
  }
}

export async function generateStaticParams() {
  const slugs = await getEventSlugs()
  return slugs.map((slug: string) => ({ slug }))
}

export async function generateMetadata({ params, searchParams }: EventPageProps): Promise<Metadata> {
  const event = await getEventBySlug(params.slug, !!searchParams.preview)

  if (!event) {
    return {
      title: "Événement introuvable",
    }
  }

  const ogImage = event.seo?.opengraphImage?.sourceUrl || generateOGImageUrl(params.slug)

  return {
    title: event.seo?.title || event.title,
    description: event.seo?.metaDesc || event.excerpt,
    openGraph: {
      title: event.seo?.title || event.title,
      description: event.seo?.metaDesc || event.excerpt,
      images: [ogImage],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: event.seo?.title || event.title,
      description: event.seo?.metaDesc || event.excerpt,
      images: [ogImage],
    },
  }
}

const EventReservationSection = dynamic(() => import("./EventReservationSection"), { ssr: false })

export default async function EventPage({ params, searchParams }: EventPageProps) {
  const event = await getEventBySlug(params.slug, !!searchParams.preview)
  if (event) {
    const city = await getCityById(event.eventDetails.city || 0)
    event.eventDetails.city = city?.name || "Inconnu"
  }

  if (!event) {
    notFound()
  }

  // récupérer le nombre de place réservées
  const reservedSeats = await getReservedSeats(event.id)

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back Navigation */}
      <div className="mb-6">
        <Link href="/events">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux événements
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="mb-8">
        {event.featuredImage && (
          <div className="relative h-64 md:h-96 mb-6 rounded-lg overflow-hidden">
            <Image
              src={event.featuredImage.node.sourceUrl || "/placeholder.svg"}
              alt={event.featuredImage.node.altText || event.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="secondary" className="bg-white/90 text-black">
                  {event.eventDetails.category}
                </Badge>
                <Badge variant="secondary" className="bg-white/90 text-black">
                  📍 {event.eventDetails.city}
                </Badge>
                {event.eventDetails.isFree && <Badge className="bg-green-600 text-white">Gratuit</Badge>}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl mb-2">{event.title}</h1>
            <p className="text-lg text-muted-foreground">{event.excerpt}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Event Content */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-gray dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: event.content }}
              />
            </CardContent>
          </Card>

          {/* Participation Section dynamique */}
          <EventReservationSection event={event} initialReservedSeats={reservedSeats} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Event Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Détails de l'événement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <div className="font-medium">Début</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(event.eventDetails.startDate, "long")}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <div className="font-medium">Fin</div>
                  <div className="text-sm text-muted-foreground">{formatDate(event.eventDetails.endDate, "long")}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <div className="font-medium">Lieu</div>
                  <div className="text-sm text-muted-foreground">{event.eventDetails.location}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <div className="font-medium">Ville</div>
                  <div className="text-sm text-muted-foreground">{event.eventDetails?.city}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <div className="font-medium">Capacité</div>
                  <div className="text-sm text-muted-foreground">{event.eventDetails.maxAttendees} participants</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <div className="font-medium">Limite d'inscription</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(event.eventDetails.registrationDeadline, "long")}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export const revalidate = 3600 // Revalidate every hour
