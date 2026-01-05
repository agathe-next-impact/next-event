"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, AlertCircle, Mic, Mail, User, Lightbulb } from "lucide-react"

interface FormData {
  // Personal Info
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  jobTitle: string
  bio: string

  // Social Links
  linkedin: string
  twitter: string
  github: string
  website: string

  // Talk Details
  talkTitle: string
  talkDescription: string
  talkDuration: string
  talkLevel: string
  talkCategory: string
  talkFormat: string

  // Experience
  speakingExperience: string
  previousTalks: string

  // Logistics
  availableDates: string
  travelRequired: boolean
  specialRequirements: string

  // Agreements
  agreeTerms: boolean
  agreeRecording: boolean
  agreeMarketing: boolean
}

interface ApplicationResult {
  success: boolean
  applicationId?: string
  message: string
  emailSent?: boolean
}

export default function SpeakerApplicationForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    bio: "",
    linkedin: "",
    twitter: "",
    github: "",
    website: "",
    talkTitle: "",
    talkDescription: "",
    talkDuration: "",
    talkLevel: "",
    talkCategory: "",
    talkFormat: "",
    speakingExperience: "",
    previousTalks: "",
    availableDates: "",
    travelRequired: false,
    specialRequirements: "",
    agreeTerms: false,
    agreeRecording: false,
    agreeMarketing: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [applicationResult, setApplicationResult] = useState<ApplicationResult | null>(null)

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
    setApplicationResult(null)

    try {
      const response = await fetch("/api/speaker-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const contentType = response.headers.get("content-type")
      let result: any = null
      if (contentType && contentType.includes("application/json")) {
        result = await response.json()
      } else {
        const text = await response.text()
        throw new Error(
          "Erreur inattendue du serveur (réponse non JSON) : " + text.slice(0, 200)
        )
      }

      if (!response.ok) {
        throw new Error(result.message || "Erreur lors de la soumission")
      }

      setApplicationResult({
        success: true,
        applicationId: result.applicationId,
        message: "Candidature soumise avec succès !",
        emailSent: result.emailSent,
      })

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        jobTitle: "",
        bio: "",
        linkedin: "",
        twitter: "",
        github: "",
        website: "",
        talkTitle: "",
        talkDescription: "",
        talkDuration: "",
        talkLevel: "",
        talkCategory: "",
        talkFormat: "",
        speakingExperience: "",
        previousTalks: "",
        availableDates: "",
        travelRequired: false,
        specialRequirements: "",
        agreeTerms: false,
        agreeRecording: false,
        agreeMarketing: false,
      })
    } catch (error) {
      setApplicationResult({
        success: false,
        message: error instanceof Error ? error.message : "Une erreur inattendue s'est produite",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (applicationResult?.success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Candidature Soumise avec Succès !
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              <div className="space-y-2">
                <p className="text-sm">
                  Nous étudierons votre candidature et vous répondrons sous 48h. Conservez cet ID pour vos références.
                </p>
              </div>
            </AlertDescription>
          </Alert>

          {applicationResult.emailSent && (
            <Alert>
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">Email de confirmation envoyé</p>
                  <p className="text-sm">
                    Vérifiez votre boîte mail pour retrouver le récapitulatif de votre candidature.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-2">Prochaines étapes :</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✅ Candidature reçue et en cours d'évaluation</li>
              <li>⏳ Réponse de notre équipe sous 48h</li>
              <li>📞 Entretien de sélection si votre profil correspond</li>
              <li>🎯 Préparation du talk ensemble</li>
              <li>🎤 Présentation devant notre communauté !</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Candidature Speaker
        </CardTitle>
        <p className="text-muted-foreground">
          Remplissez ce formulaire pour proposer votre talk. Plus vous donnez de détails, mieux nous pourrons évaluer
          votre candidature !
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {applicationResult && !applicationResult.success && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{applicationResult.message}</AlertDescription>
            </Alert>
          )}

          {/* Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Informations personnelles</h3>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company">Entreprise</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="Nom de votre entreprise"
                />
              </div>
              <div>
                <Label htmlFor="jobTitle">Poste</Label>
                <Input
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="Votre titre de poste"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Bio courte *</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                rows={3}
                placeholder="Présentez-vous en quelques lignes (expérience, expertise, passions...)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="https://linkedin.com/in/votre-profil"
                />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter/X</Label>
                <Input
                  id="twitter"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="@votre_handle"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  name="github"
                  value={formData.github}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="https://github.com/votre-username"
                />
              </div>
              <div>
                <Label htmlFor="website">Site web</Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="https://votre-site.com"
                />
              </div>
            </div>
          </div>

          {/* Talk Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Détails du talk</h3>
            </div>

            <div>
              <Label htmlFor="talkTitle">Titre du talk *</Label>
              <Input
                id="talkTitle"
                name="talkTitle"
                value={formData.talkTitle}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                placeholder="Un titre accrocheur pour votre présentation"
              />
            </div>

            <div>
              <Label htmlFor="talkDescription">Description du talk *</Label>
              <Textarea
                id="talkDescription"
                name="talkDescription"
                value={formData.talkDescription}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                rows={5}
                placeholder="Décrivez votre talk : sujet, objectifs, plan, ce que les participants vont apprendre..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="talkDuration">Durée souhaitée *</Label>
                <Select
                  value={formData.talkDuration}
                  onValueChange={(value) => handleSelectChange("talkDuration", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lightning">Lightning (5-10min)</SelectItem>
                    <SelectItem value="short">Court (20-25min)</SelectItem>
                    <SelectItem value="long">Long (45-50min)</SelectItem>
                    <SelectItem value="workshop">Workshop (2-4h)</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="talkLevel">Niveau *</Label>
                <Select
                  value={formData.talkLevel}
                  onValueChange={(value) => handleSelectChange("talkLevel", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Débutant</SelectItem>
                    <SelectItem value="intermediate">Intermédiaire</SelectItem>
                    <SelectItem value="advanced">Avancé</SelectItem>
                    <SelectItem value="all">Tous niveaux</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="talkCategory">Catégorie *</Label>
                <Select
                  value={formData.talkCategory}
                  onValueChange={(value) => handleSelectChange("talkCategory", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frontend">Frontend</SelectItem>
                    <SelectItem value="backend">Backend</SelectItem>
                    <SelectItem value="fullstack">Full-Stack</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                    <SelectItem value="devops">DevOps</SelectItem>
                    <SelectItem value="ai">IA & ML</SelectItem>
                    <SelectItem value="design">UX/UI</SelectItem>
                    <SelectItem value="security">Sécurité</SelectItem>
                    <SelectItem value="data">Data</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="talkFormat">Format préféré</Label>
              <Select
                value={formData.talkFormat}
                onValueChange={(value) => handleSelectChange("talkFormat", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="presentation">Présentation classique</SelectItem>
                  <SelectItem value="demo">Démo live</SelectItem>
                  <SelectItem value="workshop">Workshop pratique</SelectItem>
                  <SelectItem value="panel">Table ronde</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="lightning">Lightning talk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Expérience</h3>

            <div>
              <Label htmlFor="speakingExperience">Expérience en tant que speaker</Label>
              <Select
                value={formData.speakingExperience}
                onValueChange={(value) => handleSelectChange("speakingExperience", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Votre niveau d'expérience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="first-time">Premier talk</SelectItem>
                  <SelectItem value="beginner">Quelques talks (1-5)</SelectItem>
                  <SelectItem value="experienced">Expérimenté (5-20)</SelectItem>
                  <SelectItem value="expert">Expert (20+)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="previousTalks">Talks précédents (optionnel)</Label>
              <Textarea
                id="previousTalks"
                name="previousTalks"
                value={formData.previousTalks}
                onChange={handleInputChange}
                disabled={isSubmitting}
                rows={3}
                placeholder="Listez vos talks précédents avec les événements/conférences (liens vidéo appréciés)"
              />
            </div>
          </div>

          {/* Logistics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Logistique</h3>

            <div>
              <Label htmlFor="availableDates">Disponibilités</Label>
              <Textarea
                id="availableDates"
                name="availableDates"
                value={formData.availableDates}
                onChange={handleInputChange}
                disabled={isSubmitting}
                rows={2}
                placeholder="Indiquez vos créneaux de disponibilité (ex: weekends, soirées, périodes spécifiques...)"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="travelRequired"
                checked={formData.travelRequired}
                onCheckedChange={(checked) => handleCheckboxChange("travelRequired", checked as boolean)}
                disabled={isSubmitting}
              />
              <Label htmlFor="travelRequired">Je suis disponible pour me déplacer dans d'autres villes</Label>
            </div>

            <div>
              <Label htmlFor="specialRequirements">Besoins spéciaux</Label>
              <Textarea
                id="specialRequirements"
                name="specialRequirements"
                value={formData.specialRequirements}
                onChange={handleInputChange}
                disabled={isSubmitting}
                rows={2}
                placeholder="Matériel spécifique, accessibilité, régime alimentaire..."
              />
            </div>
          </div>

          {/* Agreements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Accords</h3>

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
                  id="agreeRecording"
                  checked={formData.agreeRecording}
                  onCheckedChange={(checked) => handleCheckboxChange("agreeRecording", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="agreeRecording" className="text-sm leading-relaxed">
                  J'autorise l'enregistrement et la diffusion de mon talk sur les plateformes d'Event Portal
                </Label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeMarketing"
                  checked={formData.agreeMarketing}
                  onCheckedChange={(checked) => handleCheckboxChange("agreeMarketing", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="agreeMarketing" className="text-sm leading-relaxed">
                  J'accepte de recevoir des communications marketing d'Event Portal (newsletters, invitations...)
                </Label>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t">
            <Button
              type="submit"
              className="w-full"
              disabled={
                isSubmitting ||
                !formData.agreeTerms ||
                formData.bio.trim().length < 20 ||
                formData.talkTitle.trim().length === 0 ||
                formData.talkDescription.trim().length < 30 ||
                formData.talkDuration.trim().length === 0 ||
                formData.talkLevel.trim().length === 0 ||
                formData.talkCategory.trim().length === 0
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Soumission en cours...
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" />
                  Soumettre ma candidature
                </>
              )}
            </Button>



            {/* Une seule alerte de validation à la fois, critères strictement identiques au schéma Zod */}
            <div className="flex flex-col gap-2 mt-4">
              {!formData.agreeTerms ? (
                <Alert variant="destructive">
                  <AlertDescription>
                    Vous devez accepter les conditions d'utilisation pour soumettre votre candidature.
                  </AlertDescription>
                </Alert>
              ) : formData.firstName.trim().length < 2 ? (
                <Alert variant="destructive">
                  <AlertDescription>
                    Prénom requis (minimum 2 caractères).
                  </AlertDescription>
                </Alert>
              ) : formData.lastName.trim().length < 2 ? (
                <Alert variant="destructive">
                  <AlertDescription>
                    Nom requis (minimum 2 caractères).
                  </AlertDescription>
                </Alert>
              ) : formData.email.trim().length === 0 ? (
                <Alert variant="destructive">
                  <AlertDescription>
                    L'email est obligatoire.
                  </AlertDescription>
                </Alert>
              ) : !/^\S+@\S+\.\S+$/.test(formData.email) ? (
                <Alert variant="destructive">
                  <AlertDescription>
                    Email invalide.
                  </AlertDescription>
                </Alert>
              ) : formData.bio.trim().length < 50 ? (
                <Alert variant="destructive">
                  <AlertDescription>
                    Bio trop courte (minimum 50 caractères).
                  </AlertDescription>
                </Alert>
              ) : formData.talkTitle.trim().length < 5 ? (
                <Alert variant="destructive">
                  <AlertDescription>
                    Titre du talk requis (minimum 5 caractères).
                  </AlertDescription>
                </Alert>
              ) : formData.talkDescription.trim().length < 100 ? (
                <Alert variant="destructive">
                  <AlertDescription>
                    Description trop courte (minimum 100 caractères).
                  </AlertDescription>
                </Alert>
              ) : formData.talkDuration.trim().length < 1 ? (
                <Alert variant="destructive">
                  <AlertDescription>
                    Durée requise.
                  </AlertDescription>
                </Alert>
              ) : formData.talkLevel.trim().length < 1 ? (
                <Alert variant="destructive">
                  <AlertDescription>
                    Niveau requis.
                  </AlertDescription>
                </Alert>
              ) : formData.talkCategory.trim().length < 1 ? (
                <Alert variant="destructive">
                  <AlertDescription>
                    Catégorie requise.
                  </AlertDescription>
                </Alert>
              ) : null}
            </div>

            <p className="text-xs text-muted-foreground mt-3 text-center">
              📧 Vous recevrez un email de confirmation après soumission.
              <br />
              Nous vous répondrons sous 48h pour vous informer de la suite du processus.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
