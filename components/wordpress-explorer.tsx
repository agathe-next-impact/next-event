"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Check, AlertCircle, Database, FileText, ImageIcon, Tag, User, Calendar } from "lucide-react"

interface ApiEndpoint {
  name: string
  path: string
  description: string
  icon: React.ReactNode
}

interface ApiResponse {
  data: any
  loading: boolean
  error: string | null
}

export default function WordPressExplorer() {
  const [connectionStatus, setConnectionStatus] = useState<{
    checked: boolean
    success: boolean
    message: string
    details?: any
  }>({
    checked: false,
    success: false,
    message: "Vérification de la connexion...",
  })

  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null)
  const [response, setResponse] = useState<ApiResponse>({
    data: null,
    loading: false,
    error: null,
  })

  const API_BASE_URL = "https://mediumseagreen-gazelle-452030.hostingersite.com/wp-json/wp/v2"

  const endpoints: ApiEndpoint[] = [
    {
      name: "Posts",
      path: "/posts",
      description: "Articles du blog",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      name: "Pages",
      path: "/pages",
      description: "Pages statiques",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      name: "Médias",
      path: "/media",
      description: "Images et fichiers",
      icon: <ImageIcon className="h-4 w-4" />,
    },
    {
      name: "Catégories",
      path: "/categories",
      description: "Catégories d'articles",
      icon: <Tag className="h-4 w-4" />,
    },
    {
      name: "Tags",
      path: "/tags",
      description: "Étiquettes d'articles",
      icon: <Tag className="h-4 w-4" />,
    },
    {
      name: "Utilisateurs",
      path: "/users",
      description: "Utilisateurs du site",
      icon: <User className="h-4 w-4" />,
    },
    {
      name: "Types",
      path: "/types",
      description: "Types de contenu",
      icon: <Database className="h-4 w-4" />,
    },
    {
      name: "Taxonomies",
      path: "/taxonomies",
      description: "Taxonomies disponibles",
      icon: <Tag className="h-4 w-4" />,
    },
    {
      name: "Statuts",
      path: "/statuses",
      description: "Statuts de publication",
      icon: <Calendar className="h-4 w-4" />,
    },
  ]

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      const response = await fetch("/api/test-wordpress")
      const data = await response.json()

      setConnectionStatus({
        checked: true,
        success: data.success,
        message: data.success ? data.message : data.error,
        details: data.data || data.details,
      })
    } catch (error) {
      setConnectionStatus({
        checked: true,
        success: false,
        message: "Erreur lors de la vérification de la connexion",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      })
    }
  }

  const fetchEndpoint = async (path: string) => {
    setSelectedEndpoint(path)
    setResponse({
      data: null,
      loading: true,
      error: null,
    })

    try {
      const response = await fetch(`${API_BASE_URL}${path}`)

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      setResponse({
        data,
        loading: false,
        error: null,
      })
    } catch (error) {
      setResponse({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      })
    }
  }

  const renderValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground italic">null</span>
    }

    if (typeof value === "boolean") {
      return value ? "true" : "false"
    }

    if (typeof value === "object") {
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return <span className="text-muted-foreground italic">[]</span>
        }
        return (
          <div className="pl-4 border-l-2 border-gray-200">
            {value.slice(0, 3).map((item, index) => (
              <div key={index} className="mb-2">
                <Badge variant="outline" className="mb-1">
                  {index}
                </Badge>
                {typeof item === "object" ? (
                  <div className="pl-2">
                    {Object.entries(item)
                      .slice(0, 3)
                      .map(([k, v]) => (
                        <div key={k} className="text-sm">
                          <span className="font-medium">{k}:</span> {renderValue(v)}
                        </div>
                      ))}
                    {Object.keys(item).length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        + {Object.keys(item).length - 3} autres propriétés
                      </div>
                    )}
                  </div>
                ) : (
                  renderValue(item)
                )}
              </div>
            ))}
            {value.length > 3 && (
              <div className="text-xs text-muted-foreground">+ {value.length - 3} autres éléments</div>
            )}
          </div>
        )
      }

      return (
        <div className="pl-4 border-l-2 border-gray-200">
          {Object.entries(value)
            .slice(0, 5)
            .map(([key, val]) => (
              <div key={key} className="mb-1">
                <span className="font-medium">{key}:</span> {renderValue(val)}
              </div>
            ))}
          {Object.keys(value).length > 5 && (
            <div className="text-xs text-muted-foreground">+ {Object.keys(value).length - 5} autres propriétés</div>
          )}
        </div>
      )
    }

    return String(value)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Explorateur WordPress
        </CardTitle>
        <CardDescription>Explorez l'API WordPress et visualisez les données disponibles</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold">Statut de connexion:</h3>
            {!connectionStatus.checked ? (
              <Badge variant="outline" className="gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Vérification...
              </Badge>
            ) : connectionStatus.success ? (
              <Badge variant="success" className="gap-1 bg-green-100 text-green-800 hover:bg-green-200">
                <Check className="h-3 w-3" />
                Connecté
              </Badge>
            ) : (
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                Erreur
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{connectionStatus.message}</p>
          {connectionStatus.details && (
            <div className="mt-2 text-xs bg-muted p-2 rounded-md overflow-auto max-h-20">
              <pre>{JSON.stringify(connectionStatus.details, null, 2)}</pre>
            </div>
          )}
        </div>

        <Tabs defaultValue="endpoints">
          <TabsList className="mb-4">
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="response">Réponse</TabsTrigger>
          </TabsList>

          <TabsContent value="endpoints">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {endpoints.map((endpoint) => (
                <Card
                  key={endpoint.path}
                  className={`cursor-pointer transition-all ${selectedEndpoint === endpoint.path ? "ring-2 ring-primary" : "hover:bg-muted/50"}`}
                  onClick={() => fetchEndpoint(endpoint.path)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      {endpoint.icon}
                      <h3 className="font-medium">{endpoint.name}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground">{endpoint.description}</p>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs font-mono">
                        {endpoint.path}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="response">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-mono">
                  {selectedEndpoint ? `${API_BASE_URL}${selectedEndpoint}` : "Sélectionnez un endpoint"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!selectedEndpoint ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Database className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>Sélectionnez un endpoint pour voir les données</p>
                  </div>
                ) : response.loading ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground">Chargement des données...</p>
                  </div>
                ) : response.error ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
                    <p className="text-destructive font-medium">Erreur</p>
                    <p className="text-muted-foreground">{response.error}</p>
                  </div>
                ) : (
                  <div className="overflow-auto max-h-96">
                    {Array.isArray(response.data) ? (
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <Badge>{response.data.length} éléments</Badge>
                        </div>
                        {response.data.slice(0, 5).map((item, index) => (
                          <div key={index} className="mb-4 p-3 bg-muted/50 rounded-md">
                            <div className="mb-2 flex items-center gap-2">
                              <Badge variant="outline">#{index + 1}</Badge>
                              {item.title?.rendered && <span className="font-medium">{item.title.rendered}</span>}
                            </div>
                            {renderValue(item)}
                          </div>
                        ))}
                        {response.data.length > 5 && (
                          <div className="text-center text-muted-foreground py-2">
                            + {response.data.length - 5} autres éléments non affichés
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-3 bg-muted/50 rounded-md">{renderValue(response.data)}</div>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                {response.data && !response.loading && !response.error && (
                  <span>Taille de la réponse: {JSON.stringify(response.data).length} caractères</span>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
