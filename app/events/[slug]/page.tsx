import Image from "next/image"
import Link from "next/link"
import dynamic from "next/dynamic"
import { draftMode } from "next/headers"
import { notFound } from "next/navigation"
import { Calendar, MapPin, Users, Clock, ArrowLeft, Building } from "lucide-react"
import { getEventBySlug } from "@/lib/graphql"
import { getEventBySlugWithPreview, getReservedSeats } from "@/lib/wordpress-api"
import { decodeHTMLEntities } from "@/lib/decodeHTMLEntities"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type EventPageProps = {
  params: {
    slug: string
  }
}

const PreviewBanner = () => (
  <div className="bg-amber-200 text-amber-900 px-4 py-2 text-sm font-semibold border-b border-amber-300">
    Mode preview actif : vous consultez un brouillon WordPress.
  </div>
)

const EventReservationSection = dynamic(() => import("./EventReservationSection"), { ssr: false })

export default async function EventPage({ params }: EventPageProps) {
  const { isEnabled } = draftMode()

  // En mode preview, on utilise l'API REST avec authentification pour récupérer les brouillons
  // Sinon, on utilise la fonction standard getEventBySlug
  const event = isEnabled
    ? await getEventBySlugWithPreview(params.slug)
    : await getEventBySlug(params.slug)

  if (!event || !event.eventDetails) {
    notFound()
  }

  // Ville
  let cityName = ''
  if (Array.isArray(event.eventDetails.city)) {
    cityName = ''
  } else if (event.eventDetails.city && typeof event.eventDetails.city === 'object' && 'name' in event.eventDetails.city) {
    cityName = event.eventDetails.city.name || ''
  } else if (typeof event.eventDetails.city === 'string') {
    cityName = event.eventDetails.city
  }

  // Catégorie
  let categoryName = ''
  if (event.eventDetails.category && typeof event.eventDetails.category === 'object' && 'name' in event.eventDetails.category) {
    categoryName = event.eventDetails.category.name || ''
  } else if (typeof event.eventDetails.category === 'string') {
    categoryName = event.eventDetails.category
  }

  // Image
  const imageSrc = event.featuredImage?.node?.sourceUrl || "/placeholder.svg"
  const imageAlt = event.featuredImage?.node?.altText || (typeof event.title === 'string' ? event.title : '')

  // Dates
  const startDate = event.eventDetails.startDate ? formatDate(event.eventDetails.startDate, "long") : '—'
  const endDate = event.eventDetails.endDate ? formatDate(event.eventDetails.endDate, "long") : '—'
  const registrationDeadline = event.eventDetails.registrationDeadline ? formatDate(event.eventDetails.registrationDeadline, "long") : '—'

  // Capacité
  const maxAttendees = event.eventDetails.maxAttendees || 0

  // Lieu
  const location = event.eventDetails.location || ''

  // Gratuit
  const isFree = !!event.eventDetails.isFree

  // Titre décodé
  const title = typeof event.title === 'string' ? decodeHTMLEntities(event.title.replace(/<[^>]+>/g, '')) : event.title

  // Récupérer le nombre de places réservées (seulement si pas en preview)
  const reservedSeats = isEnabled ? 0 : await getReservedSeats(event.id)

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Preview Banner */}
      {isEnabled && <PreviewBanner />}

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
        <div className="relative h-64 md:h-96 mb-6 rounded-lg overflow-hidden">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex flex-wrap gap-2 mb-2">
              {categoryName && (
                <Badge variant="secondary" className="bg-white/90 text-black">
                  {categoryName}
                </Badge>
              )}
              {cityName && (
                <Badge variant="secondary" className="bg-white/90 text-black">
                  📍 {cityName}
                </Badge>
              )}
              {isFree && <Badge className="bg-green-600 text-white">Gratuit</Badge>}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl mb-2">{title}</h1>
            {event.excerpt && (
              <p className="text-lg text-muted-foreground">
                {typeof event.excerpt === 'string' ? decodeHTMLEntities(event.excerpt.replace(/<[^>]+>/g, '')) : event.excerpt}
              </p>
            )}
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
              <div className="prose prose-gray dark:prose-invert max-w-none">
                {event.content && typeof event.content === 'string' ? (
                  <div dangerouslySetInnerHTML={{ __html: event.content }} />
                ) : null}
              </div>
            </CardContent>
          </Card>

          {/* Participation Section dynamique */}
          {!isEnabled && <EventReservationSection event={event} initialReservedSeats={reservedSeats} />}
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
                  <div className="text-sm text-muted-foreground">{startDate}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <div className="font-medium">Fin</div>
                  <div className="text-sm text-muted-foreground">{endDate}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <div className="font-medium">Lieu</div>
                  <div className="text-sm text-muted-foreground">{location}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <div className="font-medium">Ville</div>
                  <div className="text-sm text-muted-foreground">{cityName}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <div className="font-medium">Capacité</div>
                  <div className="text-sm text-muted-foreground">{maxAttendees} participants</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <div className="font-medium">Limite d'inscription</div>
                  <div className="text-sm text-muted-foreground">{registrationDeadline}</div>
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
