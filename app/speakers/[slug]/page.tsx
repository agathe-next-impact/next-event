import { decodeHTMLEntities } from "@/lib/decodeHTMLEntities"
import { sanitizeHtml } from "@/lib/sanitizeHtml"
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
import { getSpeakerBySlug, getSpeakerSlugs, getEventsBySpeakerSlug } from "@/lib/wordpress-rest"
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
export default async function SpeakerPage({ params }: SpeakerPageProps) {
  const speaker = await getSpeakerBySlug(params.slug);
  const speakerEvents = await getEventsBySpeakerSlug(params.slug);
  if (!speaker) {
    notFound();
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
                {speaker.speakerDetails.jobTitle && (
                  <p className="text-lg text-muted-foreground mb-2">{typeof speaker.speakerDetails.jobTitle === 'string' ? decodeHTMLEntities(speaker.speakerDetails.jobTitle.replace(/<[^>]+>/g, '')) : speaker.speakerDetails.jobTitle}</p>
                )}
                {speaker.speakerDetails.company && (
                  <p className="text-md font-medium text-primary mb-4">{typeof speaker.speakerDetails.company === 'string' ? decodeHTMLEntities(speaker.speakerDetails.company.replace(/<[^>]+>/g, '')) : speaker.speakerDetails.company}</p>
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
              </div>

              {/* Social Links */}
              {speaker.speakerDetails.socialLinks && (
                <div className="flex justify-center gap-4 mb-6">
                  {speaker.speakerDetails.socialLinks.linkedin && (
                    <a
                      href={speaker.speakerDetails.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                  {speaker.speakerDetails.socialLinks.twitter && (
                    <a
                      href={speaker.speakerDetails.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                  {speaker.speakerDetails.socialLinks.github && (
                    <a
                      href={speaker.speakerDetails.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  {speaker.speakerDetails.socialLinks.website && (
                    <a
                      href={speaker.speakerDetails.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Globe className="h-5 w-5" />
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
                  <div className="prose prose-gray dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: speaker.speakerDetails.bio || '' }} />
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
                            <div
                              className="text-sm text-muted-foreground mb-2 prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{ __html: sanitizeHtml(achievement.description || '') }}
                            />
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

            </TabsContent>

            <TabsContent value="expertise" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Domaines d'expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {speaker.speakerDetails.expertises?.map((expertise, index) => (
                      <Badge key={index}>
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
                          <Badge variant="secondary">
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
                              <div className="font-medium prose prose-gray dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: cert.name || '' }} />
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

            <TabsContent value="achievements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Réalisations</CardTitle>
                </CardHeader>
                <CardContent>
                  {speaker.skillsAndAchievements?.achievements &&
                  speaker.skillsAndAchievements.achievements.length > 0 ? (
                    <div className="space-y-4">
                      {speaker.skillsAndAchievements.achievements.map((achievement, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold">{achievement.title}</h4>
                            {achievement.year && (
                              <Badge variant="outline">{achievement.year}</Badge>
                            )}
                          </div>
                          {achievement.description && (
                            <div className="text-muted-foreground text-sm mb-3 prose prose-sm max-w-none whitespace-pre-line">
                              {achievement.description && typeof achievement.description === 'string'
                                ? decodeHTMLEntities(achievement.description.replace(/<[^>]+>/g, ''))
                                : ''}
                            </div>
                          )}
                          {achievement.url && (
                            <a
                              href={achievement.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Voir plus
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Aucune réalisation répertoriée pour le moment.</p>
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
                              <h4 className="font-semibold hover:text-primary transition-colors">{typeof event.title === 'string' ? decodeHTMLEntities(event.title.replace(/<[^>]+>/g, '')) : event.title}</h4>
                            </Link>
                            <Badge variant="outline">
                              {typeof event.eventDetails.category === "object"
                                ? event.eventDetails.category.name
                                : event.eventDetails.category}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm mb-3">{typeof event.excerpt === 'string' ? decodeHTMLEntities(event.excerpt.replace(/<[^>]+>/g, '')) : event.excerpt}</p>
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