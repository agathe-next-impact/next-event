export const revalidate = 3600; // Revalidate every hour
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ContactForm from "@/components/contact-form"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Users,
  Calendar,
  Headphones,
  Building,
  Globe,
  Twitter,
  Linkedin,
  Github,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Contact - Next Event",
  description:
    "Contactez l'équipe Next Event. Nous sommes là pour répondre à vos questions sur nos événements, partenariats et opportunités de speaking.",
  openGraph: {
    title: "Contact - Next Event",
    description: "Contactez l'équipe Next Event pour toutes vos questions.",
    type: "website",
  },
}

export default function ContactPage() {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      description: "Écrivez-nous pour toute question",
      value: "contact@next-event.fr",
      action: "mailto:contact@next-event.fr",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      icon: Phone,
      title: "Téléphone",
      description: "Appelez-nous aux heures ouvrables",
      value: "+33 1 23 45 67 89",
      action: "tel:+33123456789",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      icon: MessageSquare,
      title: "Chat en direct",
      description: "Discutez avec notre équipe",
      value: "Disponible 9h-18h",
      action: "#chat",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      icon: MapPin,
      title: "Adresse",
      description: "Venez nous rendre visite",
      value: "15 rue de la Paix, 75001 Paris",
      action: "https://maps.google.com/?q=15+rue+de+la+Paix+Paris",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
    },
  ]

  const departments = [
    {
      icon: Calendar,
      title: "Événements",
      description: "Questions sur nos événements, inscriptions, programmes",
      email: "next-events@next-event.fr",
      team: "Équipe Événements",
    },
    {
      icon: Users,
      title: "Speakers",
      description: "Candidatures speaker, partenariats, collaborations",
      email: "speakers@next-event.fr",
      team: "Équipe Speakers",
    },
    {
      icon: Building,
      title: "Partenariats",
      description: "Sponsoring, partenariats entreprise, locations",
      email: "partnerships@next-event.fr",
      team: "Équipe Business",
    },
    {
      icon: Headphones,
      title: "Support",
      description: "Problèmes techniques, assistance, réclamations",
      email: "support@next-event.fr",
      team: "Équipe Support",
    },
  ]

  const socialLinks = [
    {
      icon: Twitter,
      name: "Twitter",
      handle: "@next-EventFR",
      url: "https://twitter.com/next-event.fr",
      color: "text-blue-400",
    },
    {
      icon: Linkedin,
      name: "LinkedIn",
      handle: "next-Event",
      url: "https://linkedin.com/company/next-event",
      color: "text-blue-600",
    },
  ]

  const officeHours = [
    { day: "Lundi - Vendredi", hours: "9h00 - 18h00" },
    { day: "Samedi", hours: "10h00 - 16h00" },
    { day: "Dimanche", hours: "Fermé" },
  ]

  const faqs = [
    {
      question: "Comment puis-je m'inscrire à un événement ?",
      answer:
        "Vous pouvez vous inscrire directement sur la page de l'événement en remplissant le formulaire de réservation. C'est gratuit et vous recevrez une confirmation par email.",
    },
    {
      question: "Puis-je annuler ma réservation ?",
      answer:
        "Oui, vous pouvez annuler votre réservation jusqu'à 24h avant l'événement en nous contactant avec votre code de confirmation.",
    },
    {
      question: "Comment devenir speaker ?",
      answer:
        "Visitez notre page 'Become a Speaker' et soumettez votre candidature. Notre équipe étudie chaque proposition et vous répond sous 48h.",
    },
    {
      question: "Organisez-vous des événements privés ?",
      answer:
        "Oui, nous organisons des événements sur mesure pour les entreprises. Contactez notre équipe partenariats pour discuter de vos besoins.",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-2 mb-6">
          <h1 className="text-4xl md:text-5xl">Contactez-nous</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Notre équipe est là pour répondre à toutes vos questions. Que vous souhaitiez participer à un événement,
          devenir speaker ou explorer des partenariats, nous sommes à votre écoute !
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <a href="#contact-form">
              <MessageSquare className="mr-2 h-5 w-5" />
              Envoyer un message
            </a>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="tel:+33123456789">
              <Phone className="mr-2 h-5 w-5" />
              Nous appeler
            </a>
          </Button>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Plusieurs façons de nous contacter</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choisissez le moyen de contact qui vous convient le mieux. Nous nous engageons à vous répondre rapidement.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactMethods.map((method, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow group cursor-pointer">
              <a href={method.action} target={method.action.startsWith("http") ? "_blank" : "_self"}>
                <CardContent className="p-6">
                  <div
                    className={`w-16 h-16 ${method.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <method.icon className={`h-8 w-8 ${method.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{method.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{method.description}</p>
                  <p className={`font-medium ${method.color}`}>{method.value}</p>
                </CardContent>
              </a>
            </Card>
          ))}
        </div>
      </div>

      {/* Departments */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Contactez le bon département</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pour une réponse plus rapide et précise, contactez directement l'équipe spécialisée dans votre domaine.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {departments.map((dept, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <dept.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-lg">{dept.title}</div>
                    <div className="text-sm text-muted-foreground font-normal">{dept.team}</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{dept.description}</p>
                <a
                  href={`mailto:${dept.email}`}
                  className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                >
                  <Mail className="h-4 w-4" />
                  {dept.email}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Contact Form */}
        <div id="contact-form">
          <div className="mb-8">
            <h2 className="text-3xl mb-4">Envoyez-nous un message</h2>
            <p className="text-lg text-muted-foreground">
              Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
            </p>
          </div>
          <ContactForm />
        </div>

        {/* Office Info */}
        <div className="space-y-8">
          {/* Office Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Heures d'ouverture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {officeHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="font-medium">{schedule.day}</span>
                    <span className="text-muted-foreground">{schedule.hours}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note :</strong> Nous répondons aux emails 7j/7, même en dehors des heures d'ouverture !
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Suivez-nous
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:transition-colors group"
                  >
                    <social.icon className={`h-5 w-5 ${social.color} group-hover:scale-110 transition-transform`} />
                    <div>
                      <div className="font-medium">{social.name}</div>
                      <div className="text-sm text-muted-foreground">{social.handle}</div>
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Notre bureau
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Next Event</p>
                  <p className="text-muted-foreground">15 rue de la Paix</p>
                  <p className="text-muted-foreground">75001 Paris, France</p>
                </div>
                <div className="relative h-48 bg-muted rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=200&width=400&query=paris office building map"
                    alt="Localisation du bureau Next Event"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Button variant="secondary" asChild>
                      <a
                        href="https://maps.google.com/?q=15+rue+de+la+Paix+Paris"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        Voir sur Google Maps
                      </a>
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>
                    🚇 <strong>Métro :</strong> Opéra (lignes 3, 7, 8)
                  </p>
                  <p>
                    🚌 <strong>Bus :</strong> Lignes 21, 27, 29, 95
                  </p>
                  <p>
                    🚗 <strong>Parking :</strong> Parking Vendôme (2 min à pied)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Questions fréquentes</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trouvez rapidement les réponses aux questions les plus courantes.
          </p>
        </div>
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <p className="text-muted-foreground mb-4">Vous ne trouvez pas la réponse à votre question ?</p>
          <Button variant="outline" asChild>
            <a href="#contact-form">
              <MessageSquare className="mr-2 h-4 w-4" />
              Posez votre question
            </a>
          </Button>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="rounded-lg p-8 mb-16">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-4">Contact d'urgence</h3>
          <p className="text-muted-foreground mb-6">
            Pour les urgences le jour d'un événement ou les situations critiques :
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="destructive" asChild>
              <a href="tel:+33123456789">
                <Phone className="mr-2 h-5 w-5" />
                Urgence : +33 1 23 45 67 89
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="mailto:urgence@next-event.fr">
                <Mail className="mr-2 h-5 w-5" />
                urgence@next-event.fr
              </a>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">Disponible 24h/24 pendant nos événements</p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center rounded-lg p-12">
        <h2 className="text-3xl font-bold mb-4">Nous avons hâte de vous entendre !</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Que vous ayez une question, une idée de collaboration ou que vous souhaitiez simplement dire bonjour, notre
          équipe est là pour vous accompagner.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <a href="#contact-form">
              <MessageSquare className="mr-2 h-5 w-5" />
              Envoyer un message
            </a>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/events">
              <Calendar className="mr-2 h-5 w-5" />
              Découvrir nos événements
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
