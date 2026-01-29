export const revalidate = 3600; // Revalidate every hour
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Calendar,
  MapPin,
  Award,
  Heart,
  Target,
  Lightbulb,
  Globe,
  Mail,
  Phone,
  MessageCircle,
} from "lucide-react"

export const metadata: Metadata = {
  title: "About Us - Next Event",
  description:
    "Learn about Next Event's mission to connect people through amazing events, workshops, and conferences. Discover our story, team, and values.",
  openGraph: {
    title: "About Us - Next Event",
    description: "Learn about Next Event's mission to connect people through amazing events and conferences.",
    type: "website",
  },
}

export default function AboutPage() {
  const stats = [
    { icon: Calendar, label: "Events Organized", value: "500+" },
    { icon: Users, label: "Happy Attendees", value: "25,000+" },
    { icon: MapPin, label: "Cities Covered", value: "15+" },
    { icon: Award, label: "Years of Experience", value: "8+" },
  ]

  const values = [
    {
      icon: Heart,
      title: "Passion",
      description: "Nous sommes passionnés par la création d'expériences mémorables et enrichissantes.",
    },
    {
      icon: Target,
      title: "Excellence",
      description: "Nous visons l'excellence dans chaque événement que nous organisons.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Nous adoptons les dernières technologies pour améliorer l'expérience utilisateur.",
    },
    {
      icon: Globe,
      title: "Communauté",
      description: "Nous construisons des communautés fortes autour de l'apprentissage et du partage.",
    },
  ]

  const team = [
    {
      name: "Marie Dubois",
      role: "Fondatrice & CEO",
      image: "/images/team-1.jpg?height=300&width=300&query=professional woman ceo",
      bio: "Experte en événementiel avec 10 ans d'expérience dans l'organisation de conférences tech.",
    },
    {
      name: "Thomas Martin",
      role: "Directeur Technique",
      image: "/images/team-2.jpg?height=300&width=300&query=professional man cto developer",
      bio: "Développeur full-stack passionné par les technologies modernes et l'innovation.",
    },
    {
      name: "Sophie Laurent",
      role: "Responsable Communauté",
      image: "/images/team-3.jpg?height=300&width=300&query=professional woman community manager",
      bio: "Spécialiste en engagement communautaire et marketing digital.",
    },
    {
      name: "Alexandre Chen",
      role: "Designer UX/UI",
      image: "/images/team-4.jpg?height=300&width=300&query=professional man designer creative",
      bio: "Designer créatif focalisé sur l'expérience utilisateur et l'accessibilité.",
    },
  ]

  const milestones = [
    {
      year: "2016",
      title: "Création de Next Event",
      description: "Lancement de la plateforme avec notre premier événement tech à Paris.",
    },
    {
      year: "2018",
      title: "Expansion nationale",
      description: "Extension à 5 villes françaises avec plus de 50 événements organisés.",
    },
    {
      year: "2020",
      title: "Pivot digital",
      description: "Adaptation aux événements hybrides et virtuels pendant la pandémie.",
    },
    {
      year: "2022",
      title: "10,000 participants",
      description: "Franchissement du cap des 10,000 participants à nos événements.",
    },
    {
      year: "2024",
      title: "Nouvelle plateforme",
      description: "Lancement de notre nouvelle plateforme Next.js avec des fonctionnalités avancées.",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl mb-6">À propos de Next Event</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Nous connectons les passionnés de technologie à travers des événements exceptionnels. Notre mission est de
          créer des expériences d'apprentissage inoubliables qui inspirent et transforment les carrières.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/events">
            <Button size="lg">
              <Calendar className="mr-2 h-5 w-5" />
              Découvrir nos événements
            </Button>
          </Link>
          <Link href="#contact">
            <Button variant="outline" size="lg">
              <MessageCircle className="mr-2 h-5 w-5" />
              Nous contacter
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center p-6">
            <CardContent className="p-0">
              <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mission Section */}
      <div className="mb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Notre Mission</h2>
            <p className="text-lg text-muted-foreground mb-6">
             Next Event a été créé avec une vision simple : démocratiser l'accès à l'apprentissage et au networking
              dans le domaine de la technologie.
            </p>
            <p className="text-muted-foreground mb-6">
              Nous croyons que chaque développeur, designer, entrepreneur ou passionné de tech mérite d'avoir accès aux
              meilleures opportunités d'apprentissage et de networking. C'est pourquoi nous organisons des événements de
              qualité, accessibles et inclusifs.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Apprentissage</Badge>
              <Badge variant="secondary">Networking</Badge>
              <Badge variant="secondary">Innovation</Badge>
              <Badge variant="secondary">Communauté</Badge>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/images/mission.jpg?height=400&width=600&query=team collaboration tech conference"
              alt="Notre mission"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nos Valeurs</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ces valeurs guident chacune de nos décisions et façonnent l'expérience que nous offrons à notre communauté.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <value.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Timeline Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Notre Histoire</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez les moments clés qui ont façonné Next Event au fil des années.
          </p>
        </div>
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:transform md:-translate-x-px"></div>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="relative flex items-center">
                <div className="absolute left-0 md:left-1/2 w-8 h-8 bg-primary rounded-full border-4 border-background md:transform md:-translate-x-1/2 flex items-center justify-center">
                  <div className="w-2 h-2 bg-background rounded-full"></div>
                </div>
                <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-8" : "md:pl-8 md:ml-auto"}`}>
                  <Card className="p-6">
                    <CardContent className="p-0">
                      <div className="text-sm font-semibold text-primary mb-1">{milestone.year}</div>
                      <h3 className="text-lg font-semibold mb-2">{milestone.title}</h3>
                      <p className="text-muted-foreground text-sm">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Notre Équipe</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Rencontrez les personnes passionnées qui rendent Next Event possible.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <Card key={index} className="text-center overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                <div className="text-primary font-medium text-sm mb-3">{member.role}</div>
                <p className="text-muted-foreground text-sm">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Contactez-nous</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Une question ? Une suggestion ? Nous serions ravis d'échanger avec vous !
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-muted-foreground mb-3">Écrivez-nous directement</p>
              <a href="mailto:contact@next-event.fr" className="text-primary hover:underline">
                contact@next-event.fr
              </a>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <Phone className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Téléphone</h3>
              <p className="text-muted-foreground mb-3">Appelez-nous aux heures ouvrables</p>
              <a href="tel:+33123456789" className="text-primary hover:underline">
                +33 1 23 45 67 89
              </a>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <MessageCircle className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Chat</h3>
              <p className="text-muted-foreground mb-3">Discutez avec notre équipe</p>
              <Button variant="outline" size="sm">
                Ouvrir le chat
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center rounded-lg p-12">
        <h2 className="text-3xl font-bold mb-4">Rejoignez notre communauté</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Ne manquez aucun de nos événements ! Inscrivez-vous à notre newsletter pour recevoir les dernières nouvelles
          et les invitations en avant-première.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <Link href="/events" className="flex-1">
            <Button size="lg" className="w-full">
              <Calendar className="mr-2 h-5 w-5" />
              Voir les événements
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
