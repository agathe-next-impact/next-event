import { decodeHTMLEntities } from "@/lib/decodeHTMLEntities"
import { sanitizeHtml } from "@/lib/sanitizeHtml"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { draftMode } from "next/headers"
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
import { getSpeakerBySlug, getSpeakerSlugs, getEventsBySpeakerSlug } from "@/lib/wordpress-rest"
import { getSpeakerBySlugWithPreview } from "@/lib/wordpress-api"
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

  // Utilise meta_title/meta_description si présents, sinon fallback
  const metaTitle = speaker.speakerDetails?.meta_title || `${speaker.title} - Speaker Event Portal`;
  const metaDescription = speaker.speakerDetails?.meta_description || speaker.speakerDetails.bio;
  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: speaker.featuredImage ? [speaker.featuredImage.node.sourceUrl] : [],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: speaker.featuredImage ? [speaker.featuredImage.node.sourceUrl] : [],
    },
  }
}

const PreviewBanner = () => (
  <div className="bg-amber-200 text-amber-900 px-4 py-2 text-sm font-semibold border-b border-amber-300">
    Mode preview actif : vous consultez un brouillon WordPress.
  </div>
)

export default async function SpeakerPage({ params }: SpeakerPageProps) {
  const { isEnabled } = draftMode()
  
  // En mode preview, on utilise l'API REST avec authentification pour récupérer les brouillons
  const speaker = isEnabled
    ? await getSpeakerBySlugWithPreview(params.slug)
    : await getSpeakerBySlug(params.slug);
  const speakerEvents = await getEventsBySpeakerSlug(params.slug);
  if (!speaker) {
    notFound();
  }

  // Récupération des champs ACF selon le schéma fourni
  const { speakerDetails = {}, socialLinks = {}, skillsAndAchievements = {}, seoData = {} } = speaker;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Preview Banner */}
      {isEnabled && <PreviewBanner />}
      
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
                <div className="relative h-64 mb-6 overflow-hidden">
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
                <h1 className="text-2xl font-bold mb-2">{typeof speaker.title === 'string' ? decodeHTMLEntities(speaker.title.replace(/<[^>]+>/g, '')) : speaker.title}</h1>
                {speakerDetails.jobTitle && (
                  <p className="text-lg text-muted-foreground mb-2">{decodeHTMLEntities(speakerDetails.jobTitle.replace(/<[^>]+>/g, ''))}</p>
                )}
                {speakerDetails.company && (
                  <p className="text-md font-medium text-primary mb-4">{decodeHTMLEntities(speakerDetails.company.replace(/<[^>]+>/g, ''))}</p>
                )}
                {speakerDetails.years_of_experience && (
                  <p className="text-sm text-muted-foreground">{speakerDetails.years_of_experience} ans d'expérience</p>
                )}
              </div>

              <div className="space-y-3 mb-6">
                {speakerDetails.company && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{speakerDetails.company}</span>
                  </div>
                )}
                {speakerDetails.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{speakerDetails.location}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="flex justify-center gap-4 mb-6">
                {socialLinks.linkedin && (
                  <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {socialLinks.twitter && (
                  <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                {socialLinks.github && (
                  <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Github className="h-5 w-5" />
                  </a>
                )}
                {socialLinks.website && (
                  <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Globe className="h-5 w-5" />
                  </a>
                )}
              </div>

              {/* Contact Buttons */}
              <div className="space-y-2">
                {speakerDetails.email && (
                  <Button className="w-full" asChild>
                    <a href={`mailto:${speakerDetails.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Contacter par email
                    </a>
                  </Button>
                )}
                {speakerDetails.phone && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={`tel:${speakerDetails.phone}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Appeler
                    </a>
                  </Button>
                )}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/contact">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Demande via Next Event
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
              <TabsTrigger value="achievements">Réalisations</TabsTrigger>
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
                    dangerouslySetInnerHTML={{
                      __html: speakerDetails.bio && typeof speakerDetails.bio === 'string' ? sanitizeHtml(speakerDetails.bio) : ''
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="expertise" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-gray dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: skillsAndAchievements.skills && skillsAndAchievements.skills[0]?.name ? skillsAndAchievements.skills[0].name : '' }} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-gray dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: skillsAndAchievements.certifications && skillsAndAchievements.certifications[0]?.name ? skillsAndAchievements.certifications[0].name : '' }} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Réalisations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-gray dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: skillsAndAchievements.achievements && skillsAndAchievements.achievements[0]?.title ? skillsAndAchievements.achievements[0].title : '' }} />
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
                              <h4 className="font-semibold hover:text-primary transition-colors">{typeof event.title === 'string' ? decodeHTMLEntities(event.title.replace(/<[^>]+>/g, '')) : event.title}</h4>
                            </Link>
                            {event.eventDetails && event.eventDetails.category && (
                              <Badge variant="outline">
                                {typeof event.eventDetails.category === "object"
                                  ? event.eventDetails.category.name
                                  : event.eventDetails.category}
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {event.eventDetails && event.eventDetails.startDate ? formatDate(event.eventDetails.startDate) : ''}
                                {event.eventDetails && event.eventDetails.endDate ? ` - ${formatDate(event.eventDetails.endDate)}` : ''}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{event.eventDetails && event.eventDetails.location}</span>
                              {event.eventDetails && event.eventDetails.city && (
                                <span>({typeof event.eventDetails.city === 'object' ? event.eventDetails.city.name : event.eventDetails.city})</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>Places : {event.eventDetails && event.eventDetails.currentAttendees} / {event.eventDetails && event.eventDetails.maxAttendees}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>Clôture inscription : {event.eventDetails && event.eventDetails.registrationDeadline ? formatDate(event.eventDetails.registrationDeadline) : '—'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Euro className="h-4 w-4 text-muted-foreground" />
                              <span>{event.eventDetails && event.eventDetails.isFree ? 'Gratuit' : `${event.eventDetails && event.eventDetails.price} €`}</span>
                            </div>
                          </div>
                          {event.eventDetails && event.eventDetails.prerequisites && (
                            <div className="text-xs text-muted-foreground mb-1">Pré-requis : {event.eventDetails.prerequisites}</div>
                          )}
                          {event.eventDetails && event.eventDetails.materialProvided && (
                            <div className="text-xs text-muted-foreground mb-1">Matériel fourni : {event.eventDetails.materialProvided}</div>
                          )}
                          <p className="text-muted-foreground text-sm mb-1">{typeof event.excerpt === 'string' ? decodeHTMLEntities(event.excerpt.replace(/<[^>]+>/g, '')) : event.excerpt}</p>
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

          {/* Call to Action */}
          <div className="mt-10">
            <Card className="bg-primary/5">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Inviter {speaker.title.split(" ")[0]} à votre événement</h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Vous organisez un événement et souhaitez inviter {speaker.title.split(" ")[0]} comme speaker ?<br />
                  Contactez-nous pour discuter des modalités et disponibilités.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {speakerDetails.email && (
                    <Button size="lg" asChild>
                      <a href={`mailto:${speakerDetails.email}`}>
                        <Mail className="h-5 w-5 mr-2" />
                        Contacter directement
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/contact">
                      <Users className="h-5 w-5 mr-2" />
                      Passer par Next Event
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export const revalidate = 3600; // Revalidate every hour