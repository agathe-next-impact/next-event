import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  MapPin,
  Building,
  Star,
  Calendar,
  Users,
  Award,
  Globe,
  Linkedin,
  Twitter,
  Github,
  Mail,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Euro,
  Plane,
  MessageSquare,
  Youtube,
} from "lucide-react"
import { getSpeakerBySlug, getSpeakerSlugs, getEventsBySpeaker } from "@/lib/wordpress-rest"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate } from "@/lib/utils"

interface SpeakerPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const slugs = await getSpeakerSlugs()
  return slugs.map((slug: string) => ({ slug }))
}

export async function generateMetadata({ params }: SpeakerPageProps): Promise<Metadata> {
  const speaker = await getSpeakerBySlug(params.slug)

  if (!speaker) {
    return {
      title: "Speaker introuvable",
    }
  }

  return {
    title: speaker.seo?.title || `${speaker.title} - Speaker Event Portal`,
    description: speaker.seo?.metaDesc || speaker.speakerDetails.bio,
    openGraph: {
      title: speaker.seo?.title || `${speaker.title} - Speaker Event Portal`,
      description: speaker.seo?.metaDesc || speaker.speakerDetails.bio,
      images: speaker.featuredImage ? [speaker.featuredImage.node.sourceUrl] : [],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: speaker.seo?.title || `${speaker.title} - Speaker Event Portal`,
      description: speaker.seo?.metaDesc || speaker.speakerDetails.bio,
      images: speaker.featuredImage ? [speaker.featuredImage.node.sourceUrl] : [],
    },
  }
}

export default async function SpeakerPage({ params }: SpeakerPageProps) {
  const speaker = await getSpeakerBySlug(params.slug)

  if (!speaker) {
    notFound()
  }

  // Get events where this speaker has spoken
  const speakerEvents = await getEventsBySpeaker(speaker.id)

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
      "Transformation digitale": "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300",
      Croissance: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
      International: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300",
      "Levée de fonds": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    }
    return colors[expertise as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }

  const getAvailabilityIcon = (availability: string) => {
    switch (availability) {
      case "disponible":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "occupe":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "indisponible":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case "disponible":
        return "Disponible pour interventions"
      case "occupe":
        return "Agenda chargé"
      case "indisponible":
        return "Indisponible actuellement"
      default:
        return "Disponibilité non spécifiée"
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

  const getSkillLevelColor = (level: string) => {
    const colors = {
      debutant: "bg-gray-100 text-gray-800",
      intermediaire: "bg-blue-100 text-blue-800",
      avance: "bg-green-100 text-green-800",
      expert: "bg-purple-100 text-purple-800",
    }
    return colors[level as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getLanguageLevelColor = (level: string) => {
    const colors = {
      A1: "bg-red-100 text-red-800",
      A2: "bg-orange-100 text-orange-800",
      B1: "bg-yellow-100 text-yellow-800",
      B2: "bg-blue-100 text-blue-800",
      C1: "bg-green-100 text-green-800",
      C2: "bg-purple-100 text-purple-800",
      natif: "bg-emerald-100 text-emerald-800",
    }
    return colors[level as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getTalkLevelColor = (level: string) => {
    const colors = {
      debutant: "bg-green-100 text-green-800",
      intermediaire: "bg-blue-100 text-blue-800",
      avance: "bg-purple-100 text-purple-800",
      "tous-niveaux": "bg-gray-100 text-gray-800",
    }
    return colors[level as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back Navigation */}
      <div className="mb-6">
        <Link href="/speakers">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux speakers
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Speaker Photo and Basic Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              {speaker.featuredImage && (
                <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
                  <Image
                    src={speaker.featuredImage.node.sourceUrl || "/placeholder.svg"}
                    alt={speaker.featuredImage.node.altText || speaker.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold mb-2">{speaker.title}</h1>
                {speaker.speakerDetails.jobTitle && (
                  <p className="text-lg text-muted-foreground mb-2">{speaker.speakerDetails.jobTitle}</p>
                )}
                {speaker.speakerDetails.company && (
                  <p className="text-md font-medium text-primary mb-4">{speaker.speakerDetails.company}</p>
                )}

                <div className="flex items-center justify-center gap-2 mb-4">
                  {getAvailabilityIcon(speaker.speakerDetails.availability)}
                  <span className="text-sm">{getAvailabilityText(speaker.speakerDetails.availability)}</span>
                </div>

                {speaker.speakerDetails.rating && (
                  <>
                    <div className="flex items-center justify-center gap-1 mb-4">
                      {renderStars(speaker.speakerDetails.rating)}
                    </div>
                    <Badge variant="secondary" className="mb-4">
                      <Star className="h-3 w-3 mr-1 text-yellow-400 fill-current" />
                      {speaker.speakerDetails.rating}/5 ({speaker.speakerDetails.reviewsCount || 0} avis)
                    </Badge>
                  </>
                )}
              </div>

              <div className="space-y-3 mb-6">
                {speaker.speakerDetails.company && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{speaker.speakerDetails.company}</span>
                  </div>
                )}
                {speaker.speakerDetails.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{speaker.speakerDetails.location}</span>
                  </div>
                )}
                {speaker.speakerDetails.experience && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{speaker.speakerDetails.experience} ans d'expérience</span>
                  </div>
                )}
                {speaker.speakerDetails.talksGiven && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{speaker.speakerDetails.talksGiven} talks donnés</span>
                  </div>
                )}
                {speaker.speakerDetails.hourlyRate && (
                  <div className="flex items-center gap-2 text-sm">
                    <Euro className="h-4 w-4 text-muted-foreground" />
                    <span>{speaker.speakerDetails.hourlyRate}€/heure</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Plane className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {speaker.speakerDetails.travelWillingness
                      ? "Accepte les déplacements"
                      : "Interventions locales uniquement"}
                  </span>
                </div>
              </div>

              {/* Social Links */}
              {speaker.socialLinks && (
                <div className="flex justify-center gap-4 mb-6">
                  {speaker.socialLinks.linkedin && (
                    <a
                      href={speaker.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                  {speaker.socialLinks.twitter && (
                    <a
                      href={speaker.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                  {speaker.socialLinks.github && (
                    <a
                      href={speaker.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  {speaker.socialLinks.website && (
                    <a
                      href={speaker.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Globe className="h-5 w-5" />
                    </a>
                  )}
                  {speaker.socialLinks.youtube && (
                    <a
                      href={speaker.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Youtube className="h-5 w-5" />
                    </a>
                  )}
                </div>
              )}

              {/* Contact Buttons */}
              <div className="space-y-2">
                {speaker.speakerDetails.email && (
                  <Button className="w-full" asChild>
                    <a href={`mailto:${speaker.speakerDetails.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Contacter par email
                    </a>
                  </Button>
                )}
                {speaker.speakerDetails.phone && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={`tel:${speaker.speakerDetails.phone}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Appeler
                    </a>
                  </Button>
                )}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/contact">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Demande via Event Portal
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="about">À propos</TabsTrigger>
              <TabsTrigger value="expertise">Expertise</TabsTrigger>
              <TabsTrigger value="talks">Talks</TabsTrigger>
              <TabsTrigger value="events">Événements</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Biographie</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-gray dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: speaker.content }}
                  />
                </CardContent>
              </Card>

              {speaker.skillsAndAchievements?.achievements && speaker.skillsAndAchievements.achievements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Réalisations notables
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {speaker.skillsAndAchievements.achievements.map((achievement, index) => (
                        <div key={index} className="border-l-4 border-primary pl-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold">{achievement.title}</h4>
                            {achievement.year && (
                              <Badge variant="outline" className="text-xs">
                                {achievement.year}
                              </Badge>
                            )}
                          </div>
                          {achievement.description && (
                            <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                          )}
                          {achievement.url && (
                            <a
                              href={achievement.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Voir plus
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {speaker.skillsAndAchievements?.languages && speaker.skillsAndAchievements.languages.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Langues parlées
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {speaker.skillsAndAchievements.languages.map((language, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Badge variant="outline">{language.language}</Badge>
                          <Badge className={getLanguageLevelColor(language.level)} variant="secondary">
                            {language.level}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="expertise" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Domaines d'expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {speaker.speakerDetails.expertises?.map((expertise, index) => (
                      <Badge key={index} className={getExpertiseColor(expertise.name)}>
                        {expertise.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {speaker.skillsAndAchievements?.skills && speaker.skillsAndAchievements.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Compétences techniques
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {speaker.skillsAndAchievements.skills.map((skill, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="font-medium">{skill.name}</span>
                          <Badge className={getSkillLevelColor(skill.level)} variant="secondary">
                            {skill.level}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {speaker.skillsAndAchievements?.certifications &&
                speaker.skillsAndAchievements.certifications.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Certifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {speaker.skillsAndAchievements.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">{cert.name}</div>
                              <div className="text-sm text-muted-foreground">{cert.issuer}</div>
                            </div>
                            <div className="text-right">
                              {cert.year && <div className="text-sm text-muted-foreground">{cert.year}</div>}
                              {cert.url && (
                                <a
                                  href={cert.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline text-xs flex items-center gap-1"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  Vérifier
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
            </TabsContent>

            <TabsContent value="talks" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Talks populaires</CardTitle>
                </CardHeader>
                <CardContent>
                  {speaker.skillsAndAchievements?.popularTalks &&
                  speaker.skillsAndAchievements.popularTalks.length > 0 ? (
                    <div className="space-y-4">
                      {speaker.skillsAndAchievements.popularTalks.map((talk, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold">{talk.title}</h4>
                            <div className="flex gap-2">
                              {talk.category && <Badge variant="outline">{talk.category}</Badge>}
                              {talk.level && (
                                <Badge className={getTalkLevelColor(talk.level)} variant="secondary">
                                  {talk.level}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {talk.description && (
                            <div
                              className="text-muted-foreground text-sm mb-3 prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{ __html: talk.description }}
                            />
                          )}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {talk.duration && <span>Durée: {talk.duration}</span>}
                            {talk.videoUrl && (
                              <a
                                href={talk.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline flex items-center gap-1"
                              >
                                <ExternalLink className="h-3 w-3" />
                                Voir la vidéo
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Aucun talk populaire répertorié pour le moment.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Événements Event Portal</CardTitle>
                </CardHeader>
                <CardContent>
                  {speakerEvents && speakerEvents.length > 0 ? (
                    <div className="space-y-4">
                      {speakerEvents.map((event) => (
                        <div key={event.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <Link href={`/events/${event.slug}`}>
                              <h4 className="font-semibold hover:text-primary transition-colors">{event.title}</h4>
                            </Link>
                            <Badge variant="outline">
                              {typeof event.eventDetails.category === "object"
                                ? event.eventDetails.category.name
                                : event.eventDetails.category}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm mb-3">{event.excerpt}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{formatDate(event.eventDetails.startDate)}</span>
                            <span>{event.eventDetails.location}</span>
                            <span>
                              {typeof event.eventDetails.city === "object"
                                ? event.eventDetails.city.name
                                : event.eventDetails.city}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Ce speaker n'a pas encore participé à nos événements Event Portal.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Call to Action */}
      <Card className="bg-primary/5">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Inviter {speaker.title.split(" ")[0]} à votre événement</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Vous organisez un événement et souhaitez inviter {speaker.title.split(" ")[0]} comme speaker ?
            Contactez-nous pour discuter des modalités et disponibilités.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {speaker.speakerDetails.email && (
              <Button size="lg" asChild>
                <a href={`mailto:${speaker.speakerDetails.email}`}>
                  <Mail className="h-5 w-5 mr-2" />
                  Contacter directement
                </a>
              </Button>
            )}
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">
                <Users className="h-5 w-5 mr-2" />
                Passer par Event Portal
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const revalidate = 3600 // Revalidate every hour
