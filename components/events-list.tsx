"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Calendar, MapPin, Users, Filter, Grid, List, ChevronLeft, ChevronRight, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { getCityById, type Event } from "@/lib/graphql"
import { formatDate } from "@/lib/utils"
import { decodeHTMLEntities } from "@/lib/decodeHTMLEntities"

interface EventsListProps {
  events: Event[]
  categories: string[]
  cities: string[]
  currentCategory: string
  currentCity: string
  currentPage: number
  hasNextPage: boolean
  eventsPerPage: number
}

type ViewMode = "grid" | "list"

export default function EventsList({
  events,
  categories,
  cities,
  currentCategory,
  currentCity,
  currentPage,
  hasNextPage,
}: EventsListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [searchQuery, setSearchQuery] = useState<string>("")

  // Filter events by search query (include both upcoming and past events)
  const filteredEvents = events.filter((event) => {
    const cityName = typeof event.eventDetails.city === 'object'
      ? event.eventDetails.city.name
      : typeof event.eventDetails.city === 'string'
        ? event.eventDetails.city
        : ''
    return (
      (typeof event.title === 'string' ? event.title : '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof event.excerpt === 'string' ? event.excerpt : '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof event.eventDetails.location === 'string' ? event.eventDetails.location : '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      cityName.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  // Sort events: upcoming first, then past (descending by date)
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const aDate = new Date(a.eventDetails.startDate).getTime();
    const bDate = new Date(b.eventDetails.startDate).getTime();
    const now = Date.now();
    const aIsPast = aDate < now;
    const bIsPast = bDate < now;
    if (aIsPast === bIsPast) {
      // Both upcoming or both past: sort by date ascending for upcoming, descending for past
      return aIsPast ? bDate - aDate : aDate - bDate;
    }
    // Upcoming events first
    return aIsPast ? 1 : -1;
  });

  const handleFilterChange = (filterType: "category" | "city", value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "all") {
      params.delete(filterType)
    } else {
      params.set(filterType, value)
    }
    params.delete("page") // Reset to first page when changing filters
    router.push(`/events?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (page === 1) {
      params.delete("page")
    } else {
      params.set("page", page.toString())
    }
    router.push(`/events?${params.toString()}`)
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    router.push("/events")
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      Workshop: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Conférence: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      Meetup: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Formation: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      Hackathon: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }

  const getCityIcon = (city: string) => {
    const icons = {
      Paris: "🗼",
      Lyon: "🦁",
      Marseille: "🌊",
      Toulouse: "🚀",
      Nantes: "⚓",
      Bordeaux: "🍷",
      Lille: "🏭",
      Strasbourg: "🏰",
    }
    return icons[city as keyof typeof icons] || "📍"
  }

// Map to store cityId -> cityName
const [cityNames, setCityNames] = useState<Record<string, string>>({})

useEffect(() => {
  async function fetchCities() {
    // Get unique city IDs from filteredEvents (only if city is a string)
    const cityIds = Array.from(
      new Set(
        filteredEvents
          .map(e => (typeof e.eventDetails.city === 'string' ? e.eventDetails.city : undefined))
      )
    ).filter(Boolean).map(String);
    // Fetch city names for IDs not already loaded
    const missingIds = cityIds.filter(id => !cityNames[id])
    if (missingIds.length === 0) return

    const entries = await Promise.all(
      missingIds.map(async (id) => {
        try {
          const data = await getCityById(id)
          return [id, data?.name || id]
        } catch {
          return [id, id]
        }
      })
    )
    setCityNames(prev => ({
      ...prev,
      ...Object.fromEntries(entries),
    }))
  }
  fetchCities()
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [filteredEvents])

// Helper to get city name from event
function getEventCityName(event: Event): string {
  if (typeof event.eventDetails.city === 'object' && event.eventDetails.city?.name) {
    return event.eventDetails.city.name;
  }
  if (typeof event.eventDetails.city === 'string') {
    return cityNames[event.eventDetails.city] || event.eventDetails.city;
  }
  return '';
}

// Helper to get category name from event
function getEventCategoryName(event: Event): string {
  if (typeof event.eventDetails.category === 'object' && event.eventDetails.category?.name) {
    return event.eventDetails.category.name;
  }
  if (typeof event.eventDetails.category === 'string') {
    return event.eventDetails.category;
  }
  return '';
}
function decodeHTMLEntities(text: string) {
  if (!text) return '';
  const entities: Record<string, string> = {
    amp: '&', apos: "'", lt: '<', gt: '>', quot: '"', nbsp: ' ', hellip: '…', eacute: 'é', egrave: 'è', ecirc: 'ê', agrave: 'à', ugrave: 'ù', ccedil: 'ç', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”', mdash: '—', ndash: '–', oelig: 'œ', aelig: 'æ', euro: '€', copy: '©', reg: '®', deg: '°', plusmn: '±', sup2: '²', sup3: '³', frac12: '½', frac14: '¼', frac34: '¾', para: '¶', sect: '§', bull: '•', middot: '·', laquo: '«', raquo: '»', thinsp: ' ', ensp: ' ', emsp: ' ', zwnj: '', zwj: '', lrm: '', rlm: '', shy: '', times: '×', divide: '÷', trade: '™', yen: '¥', pound: '£', cent: '¢', dollar: '$', micro: 'µ', pi: 'π', mu: 'μ', alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', lambda: 'λ', omega: 'ω', sigma: 'σ', phi: 'φ', theta: 'θ', sup1: '¹'
  };
  return text.replace(/&([a-zA-Z0-9#]+);/g, (match, entity) => {
    if (entity[0] === '#') {
      // Code point
      const code = entity[1] === 'x' || entity[1] === 'X'
        ? parseInt(entity.substr(2), 16)
        : parseInt(entity.substr(1), 10);
      if (!isNaN(code)) return String.fromCharCode(code);
    }
    return entities[entity] || match;
  });
}

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
      {sortedEvents.map(event => {
        const isUpcoming = new Date(event.eventDetails.startDate) > new Date();
        const isRegistrationOpen = event.eventDetails.registrationDeadline ? (new Date() < new Date(event.eventDetails.registrationDeadline)) : false;
        const cityName = getEventCityName(event);
        const categoryName = getEventCategoryName(event);
        return (
          <Card key={event.id} className="bg-background group hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="relative">
              {event.featuredImage && (
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={event.featuredImage.node.sourceUrl || "/images/event-1.jpg"}
                    alt={event.featuredImage.node.altText || (typeof event.title === 'string' ? decodeHTMLEntities(event.title.replace(/<[^>]+>/g, '')) : event.title)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="flex p-4 gap-2">
                <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
                  {getCityIcon(cityName)} {cityName}
                </Badge>
                <Badge variant="secondary">{categoryName}</Badge>
              </div>
              {!isUpcoming && (
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary">Terminé</Badge>
                </div>
              )}
            </div>

            <CardContent className="p-6">
              <div className="space-y-3">

                <Link href={`/events/${event.slug}`}>
                  <h3 className="text-lg font-semibold line-clamp-2 hover:text-primary transition-colors">
                    {typeof event.title === 'string' ? decodeHTMLEntities(event.title.replace(/<[^>]+>/g, '')) : event.title}
                  </h3>
                </Link>

                <p className="text-muted-foreground text-sm line-clamp-2">
                  {typeof event.excerpt === 'string' ? decodeHTMLEntities(event.excerpt.replace(/<[^>]+>/g, '')) : event.excerpt}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(event.eventDetails.startDate, "long")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">{event.eventDetails.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building className="h-4 w-4" />
                    <span>{cityName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{event.eventDetails.maxAttendees} places</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div className="flex items-center gap-2">
                    {isUpcoming && isRegistrationOpen && (
                      <Badge variant="default" className="text-xs">
                        Inscriptions ouvertes
                      </Badge>
                    )}
                    {isUpcoming && !isRegistrationOpen && (
                      <Badge variant="secondary" className="text-xs">
                        Inscriptions fermées
                      </Badge>
                    )}
                  </div>
                  <Link href={`/events/${event.slug}`}>
                    <Button size="sm" variant="outline">
                      Voir détails
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  )

  const renderListView = () => (
    <div className="space-y-1">
      {sortedEvents.map(event => {
        const isUpcoming = new Date(event.eventDetails.startDate) > new Date();
        const isRegistrationOpen = event.eventDetails.registrationDeadline ? (new Date() < new Date(event.eventDetails.registrationDeadline)) : false;
        const cityName = getEventCityName(event);
        const categoryName = getEventCategoryName(event);
        return (
          <Card key={event.id} className="bg-background hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex gap-6">
                {event.featuredImage && (
                  <div className="flex-shrink-0">
                    <Image
                      src={event.featuredImage.node.sourceUrl || "/placeholder.svg"}
                      alt={event.featuredImage.node.altText || (typeof event.title === 'string' ? decodeHTMLEntities(event.title.replace(/<[^>]+>/g, '')) : event.title)}
                      width={160}
                      height={120}
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge variant="outline">
                          {getCityIcon(cityName)} {cityName}
                        </Badge>
                        <Badge variant="secondary">
                          {categoryName}
                        </Badge>
                        {!isUpcoming && <Badge variant="secondary">Terminé</Badge>}
                        {isUpcoming && isRegistrationOpen && (
                          <Badge variant="default" className="text-xs">
                            Inscriptions ouvertes
                          </Badge>
                        )}
                      </div>
                      <Link href={`/events/${event.slug}`}>
                        <h3 className="text-xl font-semibold hover:text-primary transition-colors mb-2">
                          {typeof event.title === 'string' ? decodeHTMLEntities(event.title.replace(/<[^>]+>/g, '')) : event.title}
                        </h3>
                      </Link>
                      <p className="text-muted-foreground mb-3">
                        {typeof event.excerpt === 'string' ? decodeHTMLEntities(event.excerpt.replace(/<[^>]+>/g, '')) : event.excerpt}
                      </p>
                    </div>
                    <Link href={`/events/${event.slug}`}>
                      <Button variant="outline">Voir détails</Button>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(event.eventDetails.startDate, "long")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.eventDetails.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <span>{cityName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{event.eventDetails.maxAttendees} places</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  )

  const activeFiltersCount = [
    currentCategory !== "all" ? 1 : 0,
    currentCity !== "all" ? 1 : 0,
    searchQuery ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-wrap">
          {/* Search */}
          <div className="relative">
            <Input
              placeholder="Rechercher un événement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-accent" />
            <Select value={currentCategory} onValueChange={(value) => handleFilterChange("category", value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* City Filter */}
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-accent" />
            <Select value={currentCity} onValueChange={(value) => handleFilterChange("city", value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par ville" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les villes</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {getCityIcon(city)} {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              Effacer les filtres ({activeFiltersCount})
            </Button>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-accent text-black" : ""}
          >
            <Grid className="h-4 w-4 mr-1" />
            Grille
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-accent text-black" : ""}
          >
            <List className="h-4 w-4 mr-1" />
            Liste
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Filtres actifs :</span>
          {currentCategory !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Catégorie: {currentCategory}
              <button
                onClick={() => handleFilterChange("category", "all")}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                ×
              </button>
            </Badge>
          )}
          {currentCity !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Ville: {getCityIcon(currentCity)} {currentCity}
              <button
                onClick={() => handleFilterChange("city", "all")}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                ×
              </button>
            </Badge>
          )}
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Recherche: "{searchQuery}"
              <button
                onClick={() => setSearchQuery("")}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {sortedEvents.length} événement{sortedEvents.length > 1 ? "s" : ""} trouvé{sortedEvents.length > 1 ? "s" : ""}
        {searchQuery && ` pour "${searchQuery}"`}
        {currentCategory !== "all" && ` dans la catégorie "${currentCategory}"`}
        {currentCity !== "all" && ` à ${currentCity}`}
      </div>

      {/* Events Display */}
      {sortedEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucun événement trouvé</h3>
          <p className="text-muted-foreground mb-4">
            Essayez d'ajuster vos filtres ou votre recherche pour trouver des événements.
          </p>
          <Button variant="outline" onClick={clearAllFilters}>
            Réinitialiser tous les filtres
          </Button>
        </div>
      ) : (
        <>
          {viewMode === "grid" ? renderGridView() : renderListView()}

          {/* Pagination */}
          {(currentPage > 1 || hasNextPage) && (
            <div className="flex items-center justify-center gap-4 pt-8">
              <Button variant="outline" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Précédent
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Page {currentPage}</span>
              </div>

              <Button variant="outline" onClick={() => handlePageChange(currentPage + 1)} disabled={!hasNextPage}>
                Suivant
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
