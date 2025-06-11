import type { Metadata } from "next/server"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import SpeakerApplicationForm from "@/components/speaker-application-form"
import { Mic, Users, Star, Calendar, Globe, Heart, Lightbulb, Award, MessageSquare, Video, Coffee } from "lucide-react"

export const metadata: Metadata = {
  title: "Devenir Speaker - Event Portal",
  description:
    "Partagez votre expertise avec notre communauté ! Proposez votre talk et inspirez des centaines de développeurs passionnés.",
  openGraph: {
    title: "Become a Speaker - Event Portal",
    description: "Partagez votre expertise avec notre communauté de développeurs passionnés.",
    type: "website",
  },
}

export default function BecomeaSpeakerPage() {
  const benefits = [
    {
      icon: Users,
      title: "Audience engagée",
      description: "Partagez avec une communauté de 500+ développeurs passionnés",
    },
    {
      icon: Globe,
      title: "Visibilité",
      description: "Augmentez votre notoriété dans l'écosystème tech français",
    },
    {
      icon: Video,
      title: "Enregistrement",
      description: "Votre talk sera enregistré et diffusé sur nos plateformes",
    },
    {
      icon: Coffee,
      title: "Networking",
      description: "Rencontrez d'autres experts et élargissez votre réseau",
    },
    {
      icon: Award,
      title: "Reconnaissance",
      description: "Obtenez un certificat de speaker et des goodies exclusifs",
    },
    {
      icon: Heart,
      title: "Impact",
      description: "Contribuez à l'apprentissage et à l'évolution de la communauté",
    },
  ]

  const topics = [
    "JavaScript & TypeScript",
    "React & Next.js",
    "Vue.js & Nuxt",
    "Node.js & Backend",
    "DevOps & Cloud",
    "IA & Machine Learning",
    "UX/UI Design",
    "Mobile Development",
    "Web3 & Blockchain",
    "Cybersécurité",
    "Data Science",
    "Architecture logicielle",
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Senior Developer chez Stripe",
      avatar: "/placeholder.svg?height=60&width=60&query=professional woman developer asian",
      quote:
        "Parler à Event Portal a été une expérience incroyable. L'audience était très engagée et les questions pertinentes !",
      event: "React Advanced Patterns",
    },
    {
      name: "Thomas Dubois",
      role: "CTO chez Scaleway",
      avatar: "/placeholder.svg?height=60&width=60&query=professional man cto french",
      quote:
        "L'organisation était parfaite et l'équipe très professionnelle. Je recommande vivement de proposer un talk !",
      event: "Kubernetes in Production",
    },
    {
      name: "Marie Laurent",
      role: "Lead UX chez Deezer",
      avatar: "/placeholder.svg?height=60&width=60&query=professional woman ux designer",
      quote:
        "Une plateforme idéale pour partager ses connaissances. J'ai reçu de nombreux retours positifs après mon talk.",
      event: "Design Systems at Scale",
    },
  ]

  const process = [
    {
      step: "1",
      title: "Soumettez votre candidature",
      description: "Remplissez le formulaire avec votre proposition de talk",
      icon: MessageSquare,
    },
    {
      step: "2",
      title: "Évaluation par notre équipe",
      description: "Nous étudions votre proposition sous 48h",
      icon: Star,
    },
    {
      step: "3",
      title: "Entretien de sélection",
      description: "Discussion de 30min pour affiner votre présentation",
      icon: Video,
    },
    {
      step: "4",
      title: "Préparation ensemble",
      description: "Nous vous accompagnons dans la préparation",
      icon: Lightbulb,
    },
    {
      step: "5",
      title: "Showtime !",
      description: "Partagez votre expertise avec la communauté",
      icon: Mic,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Mic className="h-8 w-8 text-primary" />
          <h1 className="text-4xl md:text-6xl font-bold">Devenir Speaker</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Partagez votre expertise avec notre communauté de développeurs passionnés ! Que vous soyez expert ou débutant,
          votre expérience peut inspirer et aider d'autres développeurs à grandir.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <a href="#application-form">
              <Mic className="mr-2 h-5 w-5" />
              Proposer un talk
            </a>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/events">
              <Calendar className="mr-2 h-5 w-5" />
              Voir nos événements
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        <div className="text-center p-6 bg-muted/50 rounded-lg">
          <div className="text-3xl font-bold text-primary mb-2">150+</div>
          <div className="text-muted-foreground text-sm">Speakers</div>
        </div>
        <div className="text-center p-6 bg-muted/50 rounded-lg">
          <div className="text-3xl font-bold text-primary mb-2">25k+</div>
          <div className="text-muted-foreground text-sm">Participants</div>
        </div>
        <div className="text-center p-6 bg-muted/50 rounded-lg">
          <div className="text-3xl font-bold text-primary mb-2">500+</div>
          <div className="text-muted-foreground text-sm">Talks donnés</div>
        </div>
        <div className="text-center p-6 bg-muted/50 rounded-lg">
          <div className="text-3xl font-bold text-primary mb-2">95%</div>
          <div className="text-muted-foreground text-sm">Satisfaction</div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Pourquoi devenir speaker ?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Rejoignez une communauté de speakers passionnés et bénéficiez d'une plateforme de qualité pour partager vos
            connaissances.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <benefit.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Topics Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Sujets recherchés</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nous sommes toujours à la recherche de talks sur ces technologies et bien d'autres !
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          {topics.map((topic, index) => (
            <Badge key={index} variant="secondary" className="text-sm py-2 px-4">
              {topic}
            </Badge>
          ))}
        </div>
        <div className="text-center mt-6">
          <p className="text-muted-foreground">
            Votre sujet n'est pas dans la liste ?{" "}
            <span className="font-medium text-primary">Proposez-le quand même !</span> Nous sommes ouverts à toutes les
            idées innovantes.
          </p>
        </div>
      </div>

      {/* Process Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Comment ça marche ?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un processus simple et transparent pour vous accompagner de la candidature jusqu'au jour J.
          </p>
        </div>
        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-border transform -translate-x-px"></div>
          <div className="space-y-8">
            {process.map((item, index) => (
              <div key={index} className="relative flex items-center">
                <div className="hidden md:block absolute left-1/2 w-12 h-12 bg-primary rounded-full border-4 border-background transform -translate-x-1/2 flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? "md:pr-8" : "md:pl-8 md:ml-auto"}`}>
                  <Card className="p-6">
                    <CardContent className="p-0">
                      <div className="flex items-center gap-3 mb-3 md:hidden">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{item.step}</span>
                        </div>
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="hidden md:block text-sm font-semibold text-primary mb-1">Étape {item.step}</div>
                      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ce que disent nos speakers</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez les retours de speakers qui ont déjà partagé leur expertise avec notre communauté.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
                <blockquote className="text-muted-foreground italic mb-3">"{testimonial.quote}"</blockquote>
                <div className="text-sm">
                  <Badge variant="outline">{testimonial.event}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Application Form Section */}
      <div id="application-form" className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Proposez votre talk</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Remplissez le formulaire ci-dessous pour soumettre votre candidature. Nous vous répondrons sous 48h !
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          <SpeakerApplicationForm />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Questions fréquentes</h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dois-je être un expert pour proposer un talk ?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Pas du tout ! Nous valorisons tous les niveaux d'expertise. Parfois, un retour d'expérience de débutant
                peut être plus inspirant qu'un talk d'expert. L'important est d'avoir quelque chose d'intéressant à
                partager.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Combien de temps dure un talk ?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Les formats varient selon l'événement : lightning talks (5-10min), talks courts (20-25min), ou
                conférences longues (45-50min). Nous nous adaptons à votre contenu et à vos préférences.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Y a-t-il une rémunération ?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Nos événements étant gratuits, nous ne proposons pas de rémunération. Cependant, nous couvrons les frais
                de transport pour les speakers venant de loin et offrons des goodies exclusifs.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Puis-je proposer un workshop ?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Absolument ! Nous organisons régulièrement des workshops pratiques. Indiquez-le dans votre candidature
                et décrivez le format que vous envisagez (durée, prérequis, matériel nécessaire).
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-muted/50 rounded-lg p-12">
        <h2 className="text-3xl font-bold mb-4">Prêt à partager votre expertise ?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Rejoignez notre communauté de speakers et contribuez à l'évolution de l'écosystème tech français !
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <a href="#application-form">
              <Mic className="mr-2 h-5 w-5" />
              Proposer un talk maintenant
            </a>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/contact">
              <MessageSquare className="mr-2 h-5 w-5" />
              Nous contacter
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
