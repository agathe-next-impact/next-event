"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, AlertCircle, Send, Mail, User, MessageSquare } from "lucide-react"

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  subject: string
  category: string
  message: string
  priority: string
  agreeNewsletter: boolean
  agreeTerms: boolean
}

interface ContactResult {
  success: boolean
  messageId?: string
  message: string
  emailSent?: boolean
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    category: "",
    message: "",
    priority: "normal",
    agreeNewsletter: false,
    agreeTerms: false,
  })

  const titleRef = React.useRef<HTMLHeadingElement>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contactResult, setContactResult] = useState<ContactResult | null>(null)
    // Scroll au titre après affichage d'une alerte ou d'un message
    React.useEffect(() => {
      if (contactResult) {
        const formEl = document.getElementById("contact-form")
        if (formEl) {
          formEl.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }
    }, [contactResult])

  const categories = [
    { value: "general", label: "Question générale" },
    { value: "event", label: "À propos d'un événement" },
    { value: "speaker", label: "Candidature speaker" },
    { value: "partnership", label: "Partenariat" },
    { value: "technical", label: "Problème technique" },
    { value: "feedback", label: "Feedback / Suggestion" },
    { value: "media", label: "Demande média" },
    { value: "other", label: "Autre" },
  ]

  const priorities = [
    { value: "low", label: "Faible - Réponse sous 72h" },
    { value: "normal", label: "Normal - Réponse sous 24h" },
    { value: "high", label: "Urgent - Réponse sous 4h" },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setContactResult(null)


    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Erreur lors de l'envoi du message")
      }

      setContactResult({
        success: true,
        messageId: result.messageId,
        message: "Message envoyé avec succès !",
        emailSent: result.emailSent,
      })

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        category: "",
        message: "",
        priority: "normal",
        agreeNewsletter: false,
        agreeTerms: false,
      })
    } catch (error) {
      setContactResult({
        success: false,
        message: error instanceof Error ? error.message : "Une erreur inattendue s'est produite",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (contactResult?.success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Message Envoyé
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
             <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">{contactResult.message}</p>
                <p className="text-sm">
                  Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.
                </p>
              </div>
            </AlertDescription>
          </Alert>

          {contactResult.emailSent && (
            <Alert>
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">Email de confirmation envoyé</p>
                  <p className="text-sm">Vérifiez votre boîte mail pour retrouver la confirmation de votre message.</p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-2">Temps de réponse estimé :</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                📧 <strong>Email :</strong> Sous 24h en moyenne
              </li>
              <li>
                📞 <strong>Téléphone :</strong> 9h-18h du lundi au vendredi
              </li>
              <li>
                💬 <strong>Chat :</strong> Réponse immédiate aux heures ouvrables
              </li>
            </ul>
          </div>

          <div className="pt-4">
            <Button variant="outline" onClick={() => setContactResult(null)} className="w-full">
              Envoyer un autre message
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card id="contact-form">
      <CardHeader>
        <CardTitle
          id="contact-form-title"
          ref={titleRef}
          className="flex items-center gap-2"
        >
          <MessageSquare className="h-5 w-5" />
          Formulaire de Contact
        </CardTitle>
        <p className="text-muted-foreground">
          Remplissez ce formulaire et nous vous répondrons rapidement selon la priorité de votre demande.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {contactResult && !contactResult.success && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{contactResult.message}</AlertDescription>
            </Alert>
          )}

          {/* Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Vos informations</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Prénom *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Nom *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  placeholder="votre@email.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="company">Entreprise / Organisation</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                disabled={isSubmitting}
                placeholder="Nom de votre entreprise (optionnel)"
              />
            </div>
          </div>

          {/* Message Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Votre message</h3>
            </div>

            <div>
              <Label htmlFor="subject">Sujet *</Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                placeholder="Résumez votre demande en quelques mots"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Catégorie *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priorité</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleSelectChange("priority", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                rows={6}
                placeholder="Décrivez votre demande en détail. Plus vous donnez d'informations, mieux nous pourrons vous aider !"
              />
              <p className="text-xs text-muted-foreground mt-1">Minimum 20 caractères - {formData.message.length}/20</p>
            </div>
          </div>

          {/* Agreements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Préférences</h3>

            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeTerms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) => handleCheckboxChange("agreeTerms", checked as boolean)}
                  disabled={isSubmitting}
                  required
                />
                <Label htmlFor="agreeTerms" className="text-sm leading-relaxed">
                  J'accepte les{" "}
                  <a href="/terms" className="text-primary hover:underline">
                    conditions d'utilisation
                  </a>{" "}
                  et la{" "}
                  <a href="/privacy" className="text-primary hover:underline">
                    politique de confidentialité
                  </a>{" "}
                  d'Event Portal *
                </Label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeNewsletter"
                  checked={formData.agreeNewsletter}
                  onCheckedChange={(checked) => handleCheckboxChange("agreeNewsletter", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="agreeNewsletter" className="text-sm leading-relaxed">
                  Je souhaite recevoir la newsletter Event Portal avec les dernières actualités et événements
                </Label>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t">
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !formData.agreeTerms || formData.message.length < 20}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Envoyer le message
                </>
              )}
            </Button>


            {/* Une seule alerte de validation à la fois, infos personnelles incluses */}
            <div className="flex flex-col gap-2 mt-4">
              {!formData.agreeTerms ? (
                <p className="text-sm text-red-600 text-center">
                  Vous devez accepter les conditions d'utilisation pour envoyer le message.
                </p>
              ) : formData.firstName.trim().length === 0 ? (
                <p className="text-sm text-red-600 text-center">
                  Le prénom est obligatoire.
                </p>
              ) : formData.lastName.trim().length === 0 ? (
                <p className="text-sm text-red-600 text-center">
                  Le nom est obligatoire.
                </p>
              ) : formData.email.trim().length === 0 ? (
                <p className="text-sm text-red-600 text-center">
                  L'email est obligatoire.
                </p>
              ) : !/^\S+@\S+\.\S+$/.test(formData.email) ? (
                <p className="text-sm text-red-600 text-center">
                  L'email n'est pas valide.
                </p>
              ) : formData.message.length > 0 && formData.message.length < 20 ? (
                <p className="text-sm text-red-600 text-center">
                  Le message doit contenir au moins 20 caractères.
                </p>
              ) : null}
            </div>

            <p className="text-xs text-muted-foreground mt-3 text-center">
              📧 Vous recevrez une confirmation par email après envoi.
              <br />
              Nous nous engageons à vous répondre selon la priorité sélectionnée.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
