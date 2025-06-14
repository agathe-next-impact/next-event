"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import {
  MapPin,
  Building,
  Star,
  Filter,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Linkedin,
  Twitter,
  Github,
  Users,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Award,
  Calendar,
  Mail,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { Speaker } from "@/lib/graphql"

interface SpeakersListProps {
  speakers: Speaker[]
  expertiseAreas: string[]
  companies: string[]
  locations: string[]
  currentExpertise: string
  currentCompany: string
  currentLocation: string
  currentAvailability: string
  currentExperience: string
  currentSearch: string
  currentPage: number
  hasNextPage: boolean
  speakersPerPage: number
}

type ViewMode = "grid" | "list"

export default function SpeakersList({
  speakers,
  expertiseAreas,
  companies,
  locations,
  currentExpertise,
  currentCompany,
  currentLocation,
  currentAvailability,
  currentExperience,
  currentSearch,
  currentPage,
  hasNextPage,
  speakersPerPage,
}: SpeakersListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [searchQuery, setSearchQuery] = useState(currentSearch)
  const [isFiltering, setIsFiltering] = useState(false)

  // Debounce pour la recherche
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)

  const handleFilterChange = (filterType: string, value: string) => {
    setIsFiltering(true)
    const params = new URLSearchParams(searchParams.toString())

    if (value === "all" || value === "") {
      params.delete(filterType)
    } else {
      params.set(filterType, value)
    }

    params.delete("page") // Reset to first page when changing filters

    // Ajouter un indicateur de chargement
    setTimeout(() => {
      router.push(`/speakers?${params.toString()}`)
      setIsFiltering(false)
    }, 100)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)

    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    // Set new timeout for debounced search
    const timeout = setTimeout(() => {
      setIsFiltering(true)
      const params = new URLSearchParams(searchParams.toString())

      if (value.trim()) {
        params.set("search", value.trim())
      } else {
        params.delete("search")
      }

      params.delete("page")

      router.push(`/speakers?${params.toString()}`)
      setIsFiltering(false)
    }, 500) // 500ms debounce

    setSearchTimeout(timeout)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])

  // ... rest of the component remains the same but add loading states

  const clearAllFilters = () => {
    setSearchQuery("")
    router.push("/speakers")
  }

  const getExpertiseColor = (expertise: string) => {
    const colors = {
      Entrepreneuriat: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      Leadership: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Marketing: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Finance: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      Innovation: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      Digital: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
      RH: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      Stratégie: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      Vente: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
      Management: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
    }
    return colors[expertise as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }

  const getAvailabilityIcon = (availability: string) => {
    switch (availability) {
      case "available":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "busy":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "unavailable":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case "available":
        return "Disponible"
      case "busy":
        return "Occupé"
      case "unavailable":
        return "Indisponible"
      default:
        return "Non spécifié"
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
      {speakers.map((speaker) => (
        <Card key={speaker.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
          <div className="relative">
            {speaker.featuredImage && (
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={speaker.featuredImage.node.sourceUrl || "/placeholder.svg"}
                  alt={speaker.featuredImage.node.altText || speaker.title}
                  fill
                  className="object-contain object-left group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="absolute top-3 right-3 flex gap-2">
              <Badge variant="secondary">
                <Star className="h-3 w-3 mr-1 text-yellow-400 fill-current" />
                {speaker.speakerDetails.rating}
              </Badge>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="space-y-3">
              <Link href={`/speakers/${speaker.slug}`}>
                <h3 className="text-2xl font-regular line-clamp-1 hover:text-primary transition-colors">
                  {speaker.title}
                </h3>
              </Link>

              <p className="text-sm font-medium">{speaker.speakerDetails.jobTitle}</p>

              <div className="flex items-center gap-2 text-sm">
                <Building className="h-4 w-4 text-accent" />
                <span className="line-clamp-1">{speaker.speakerDetails.company}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-accent" />
                <span>{speaker.speakerDetails.location}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-accent" />
                <span>{speaker.speakerDetails.experience} ans d'expérience</span>
              </div>

              <p className="text-muted-foreground text-sm line-clamp-2">{speaker.speakerDetails.bio}</p>

              <div className="flex flex-wrap gap-1">
                {speaker.speakerDetails.expertise.slice(0, 3).map((exp, index) => (
                  <Badge key={index}>
                    {exp}
                  </Badge>
                ))}
                {speaker.speakerDetails.expertise.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{speaker.speakerDetails.expertise.length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between pt-3">
                <div className="flex items-center gap-1">{renderStars(speaker.speakerDetails.rating)}</div>
              </div>

              <div className="flex gap-2 pt-2">
                <Link href={`/speakers/${speaker.slug}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    Voir le profil
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="hover:bg-transparent" asChild>
                  <a href={`mailto:${speaker.speakerDetails.email}`}>
                    <Mail className="h-4 w-4 text-black" />
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderListView = () => (
    <div className="space-y-4">
      {speakers.map((speaker) => (
        <Card key={speaker.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex gap-6">
              {speaker.featuredImage && (
                <div className="flex-shrink-0">
                  <Image
                    src={speaker.featuredImage.node.sourceUrl || "/placeholder.svg"}
                    alt={speaker.featuredImage.node.altText || speaker.title}
                    width={120}
                    height={120}
                    className="object-contain"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="secondary">
                        <Star className="h-3 w-3 mr-1 text-yellow-400 fill-current" />
                        {speaker.speakerDetails.rating}
                      </Badge>
                      {speaker.speakerDetails.expertise.slice(0, 2).map((exp, index) => (
                        <Badge key={index} variant="default">
                          {exp}
                        </Badge>
                      ))}
                    </div>
                    <Link href={`/speakers/${speaker.slug}`}>
                      <h3 className="text-xl font-semibold hover:text-primary transition-colors mb-1">
                        {speaker.title}
                      </h3>
                    </Link>
                    <p className="text-sm font-medium text-muted-foreground mb-2">{speaker.speakerDetails.jobTitle}</p>
                    <p className="text-muted-foreground mb-3 line-clamp-2">{speaker.speakerDetails.bio}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/speakers/${speaker.slug}`}>
                      <Button variant="outline">Voir le profil</Button>
                    </Link>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`mailto:${speaker.speakerDetails.email}`}>
                        <Mail className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <span>{speaker.speakerDetails.company}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{speaker.speakerDetails.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{speaker.speakerDetails.experience} ans d'exp.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    <span>{speaker.speakerDetails.talksGiven} talks donnés</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-1">{renderStars(speaker.speakerDetails.rating)}</div>
                  <div className="flex items-center gap-2">
                    {speaker.speakerDetails.socialLinks.linkedin && (
                      <a
                        href={speaker.speakerDetails.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {speaker.speakerDetails.socialLinks.twitter && (
                      <a
                        href={speaker.speakerDetails.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    )}
                    {speaker.speakerDetails.socialLinks.github && (
                      <a
                        href={speaker.speakerDetails.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {speaker.speakerDetails.socialLinks.website && (
                      <a
                        href={speaker.speakerDetails.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Globe className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const activeFiltersCount = [
    currentExpertise !== "all" ? 1 : 0,
    currentCompany !== "all" ? 1 : 0,
    currentLocation !== "all" ? 1 : 0,
    currentAvailability !== "all" ? 1 : 0,
    currentExperience !== "all" ? 1 : 0,
    searchQuery ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`/speakers?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <div className="flex flex-col gap-4">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent h-4 w-4" />
          <Input
            placeholder="Rechercher un speaker..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
            disabled={isFiltering}
          />
          {isFiltering && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>

        {/* Filters Row with loading states */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-wrap">
            {/* Expertise Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-accent" />
              <Select
                value={currentExpertise}
                onValueChange={(value) => handleFilterChange("expertise", value)}
                disabled={isFiltering}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Expertise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les expertises</SelectItem>
                  {expertiseAreas.map((expertise) => (
                    <SelectItem key={expertise} value={expertise}>
                      {expertise}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Company Filter */}
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-accent" />
              <Select
                value={currentCompany}
                onValueChange={(value) => handleFilterChange("company", value)}
                disabled={isFiltering}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Entreprise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les entreprises</SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location Filter */}
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent" />
              <Select
                value={currentLocation}
                onValueChange={(value) => handleFilterChange("location", value)}
                disabled={isFiltering}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Localisation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les localisations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Availability Filter */}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent" />
              <Select
                value={currentAvailability}
                onValueChange={(value) => handleFilterChange("availability", value)}
                disabled={isFiltering}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Disponibilité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="available">Disponible</SelectItem>
                  <SelectItem value="busy">Occupé</SelectItem>
                  <SelectItem value="unavailable">Indisponible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Experience Filter */}
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-accent" />
              <Select
                value={currentExperience}
                onValueChange={(value) => handleFilterChange("experience", value)}
                disabled={isFiltering}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Expérience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toute expérience</SelectItem>
                  <SelectItem value="0-5">0-5 ans</SelectItem>
                  <SelectItem value="5-10">5-10 ans</SelectItem>
                  <SelectItem value="10-15">10-15 ans</SelectItem>
                  <SelectItem value="15-100">15+ ans</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <Button variant="outline" size="sm" onClick={clearAllFilters} disabled={isFiltering}>
                Effacer les filtres ({activeFiltersCount})
              </Button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-accent text-black" : ""}
              disabled={isFiltering}
            >
              <Grid className="h-4 w-4 mr-1" />
              Grille
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-accent text-black" : ""}
              disabled={isFiltering}
            >
              <List className="h-4 w-4 mr-1" />
              Liste
            </Button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isFiltering && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
            <span>Filtrage en cours...</span>
          </div>
        </div>
      )}

      {/* Rest of the component remains the same */}
      {!isFiltering && (
        <>
          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Filtres actifs :</span>
              {currentExpertise !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Expertise: {currentExpertise}
                  <button
                    onClick={() => handleFilterChange("expertise", "all")}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {currentCompany !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Entreprise: {currentCompany}
                  <button
                    onClick={() => handleFilterChange("company", "all")}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {currentLocation !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Localisation: {currentLocation}
                  <button
                    onClick={() => handleFilterChange("location", "all")}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {currentAvailability !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Disponibilité: {getAvailabilityText(currentAvailability)}
                  <button
                    onClick={() => handleFilterChange("availability", "all")}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {currentExperience !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Expérience: {currentExperience} ans
                  <button
                    onClick={() => handleFilterChange("experience", "all")}
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
                    onClick={() => handleSearchChange("")}
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
            {speakers.length} speaker{speakers.length > 1 ? "s" : ""} trouvé
            {speakers.length > 1 ? "s" : ""}
            {searchQuery && ` pour "${searchQuery}"`}
            {currentExpertise !== "all" && ` avec l'expertise "${currentExpertise}"`}
            {currentCompany !== "all" && ` chez ${currentCompany}`}
            {currentLocation !== "all" && ` à ${currentLocation}`}
          </div>

          {/* Speakers Display */}
          {speakers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun speaker trouvé</h3>
              <p className="text-muted-foreground mb-4">
                Essayez d'ajuster vos filtres ou votre recherche pour trouver des speakers.
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
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
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
        </>
      )}
    </div>
  )
}
