"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Loader2, Check, AlertCircle, Mail, Database, Code, Server, Globe } from "lucide-react"
import WordPressExplorer from "./wordpress-explorer"

export default function DevTools() {
  const [emailStatus, setEmailStatus] = useState<{
    loading: boolean
    success: boolean
    error: string | null
  }>({
    loading: false,
    success: false,
    error: null,
  })

  const [emailForm, setEmailForm] = useState({
    to: "test@example.com",
    subject: "Test Email from Event Portal",
    message: "This is a test email sent from the Event Portal development tools.",
  })

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEmailForm((prev) => ({ ...prev, [name]: value }))
  }

  const sendTestEmail = async () => {
    setEmailStatus({ loading: true, success: false, error: null })

    try {
      const response = await fetch("/api/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: emailForm.to,
          subject: emailForm.subject,
          message: emailForm.message,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi")
      }

      setEmailStatus({
        loading: false,
        success: true,
        error: null,
      })
    } catch (error) {
      setEmailStatus({
        loading: false,
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      })
    }
  }

  return (
    <Tabs defaultValue="wordpress">
      <TabsList className="mb-4">
        <TabsTrigger value="wordpress">
          <Database className="h-4 w-4 mr-2" />
          WordPress
        </TabsTrigger>
        <TabsTrigger value="email">
          <Mail className="h-4 w-4 mr-2" />
          Email
        </TabsTrigger>
        <TabsTrigger value="env">
          <Code className="h-4 w-4 mr-2" />
          Variables d'env
        </TabsTrigger>
        <TabsTrigger value="api">
          <Server className="h-4 w-4 mr-2" />
          API
        </TabsTrigger>
      </TabsList>

      <TabsContent value="wordpress">
        <WordPressExplorer />
      </TabsContent>

      <TabsContent value="email">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Test d'envoi d'email
            </CardTitle>
            <CardDescription>
              Envoyez un email de test pour vérifier la configuration de votre service d'email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="to">Destinataire</Label>
              <Input
                id="to"
                name="to"
                value={emailForm.to}
                onChange={handleEmailChange}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Sujet</Label>
              <Input
                id="subject"
                name="subject"
                value={emailForm.subject}
                onChange={handleEmailChange}
                placeholder="Sujet de l'email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                value={emailForm.message}
                onChange={handleEmailChange}
                placeholder="Contenu de l'email"
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>
              {emailStatus.loading && (
                <Badge variant="outline" className="gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Envoi en cours...
                </Badge>
              )}
              {emailStatus.success && (
                <Badge variant="success" className="gap-1 bg-green-100 text-green-800 hover:bg-green-200">
                  <Check className="h-3 w-3" />
                  Email envoyé
                </Badge>
              )}
              {emailStatus.error && (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Erreur: {emailStatus.error}
                </Badge>
              )}
            </div>
            <Button onClick={sendTestEmail} disabled={emailStatus.loading}>
              Envoyer un email de test
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="env">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Variables d'environnement
            </CardTitle>
            <CardDescription>Vérifiez l'état des variables d'environnement nécessaires pour le portail</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>RESEND_API_KEY</Label>
                    <Badge variant={process.env.RESEND_API_KEY ? "success" : "outline"}>
                      {process.env.RESEND_API_KEY ? "Configuré" : "Non configuré"}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">Clé API pour l'envoi d'emails via Resend</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>PUBLIC_SITE_URL</Label>
                    <Badge variant={process.env.PUBLIC_SITE_URL ? "success" : "outline"}>
                      {process.env.PUBLIC_SITE_URL ? "Configuré" : "Non configuré"}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">URL publique du site pour les liens absolus</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>PREVIEW_SECRET</Label>
                    <Badge variant={process.env.PREVIEW_SECRET ? "success" : "outline"}>
                      {process.env.PREVIEW_SECRET ? "Configuré" : "Non configuré"}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">Secret pour le mode preview</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>SMTP_HOST</Label>
                    <Badge variant={process.env.SMTP_HOST ? "success" : "outline"}>
                      {process.env.SMTP_HOST ? "Configuré" : "Non configuré"}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Hôte SMTP pour l'envoi d'emails (alternative à Resend)
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Environnement actuel</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>NODE_ENV</Label>
                      <Badge variant="outline">{process.env.NODE_ENV || "development"}</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Mode de développement</Label>
                      <Switch checked={process.env.NODE_ENV !== "production"} disabled />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="api">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Endpoints API
            </CardTitle>
            <CardDescription>Explorez les endpoints API disponibles dans le portail</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <code>/api/test-wordpress</code>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-sm">Teste la connexion à l'API WordPress</p>
                  </CardContent>
                  <CardFooter className="py-3">
                    <Badge variant="outline">GET</Badge>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
