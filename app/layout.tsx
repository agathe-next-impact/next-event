import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Event Portal - Découvrez des Événements Exceptionnels",
    template: "%s | Event Portal",
  },
  description:
    "Rejoignez des milliers de participants à nos événements soigneusement sélectionnés. Des ateliers aux conférences, trouvez votre prochaine opportunité d'apprentissage.",
  keywords: ["events", "conferences", "workshops", "networking", "learning"],
  authors: [{ name: "Event Portal Team" }],
  creator: "Event Portal",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Event Portal",
    title: "Event Portal - Découvrez des Événements Exceptionnels",
    description: "Rejoignez des milliers de participants à nos événements soigneusement sélectionnés.",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Event Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Event Portal - Découvrez des Événements Exceptionnels",
    description: "Rejoignez des milliers de participants à nos événements soigneusement sélectionnés.",
    images: ["/og-default.jpg"],
    creator: "@eventportal",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-background antialiased")}>
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
              <div className="text-2xl font-bold">Event Portal</div>
              <div className="flex items-center gap-6">
                <a href="/" className="hover:text-primary transition-colors">
                  Accueil
                </a>
                <a href="/events" className="hover:text-primary transition-colors">
                  Événements
                </a>
                <a href="/about" className="hover:text-primary transition-colors">
                  À propos
                </a>
                <a href="/become-speaker" className="hover:text-primary transition-colors">
                  Devenir Speaker
                </a>
                <a href="/contact" className="hover:text-primary transition-colors">
                  Contact
                </a>
              </div>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="border-t mt-12">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} Event Portal. Tous droits réservés.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
