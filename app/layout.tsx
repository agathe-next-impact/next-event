import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import Image from "next/image"
import AnimatedCursor from "react-animated-cursor"

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
    <html lang="fr" suppressHydrationWarning>
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com"/>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Manrope:wght@200..800&&family=Urbanist:ital,wght@0,100..900;1,100..900" rel="stylesheet" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    </head>
      <body className={cn(inter.className, "min-h-screen bg-background antialiased")}>
        <AnimatedCursor
          innerSize={8}
          outerSize={15}
          color="255, 219, 0"
          outerAlpha={0.2}
          innerScale={0.7}
          outerScale={5}
          trailingSpeed={5}
          showSystemCursor={false}
          clickables={[
            "a",
            "button",
            ".cursor-pointer",
            ".cursor-default",
            ".cursor-move",
            ".cursor-grab",
          ]}
        />
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex justify-between">
              <Image
                src="/images/logo-next-event.png"
                alt="Next Event Portal Logo"
                width={150}
                height={50}
                className="h-12 w-max object-contain"
              />
              <div className="flex items-center gap-6">
                <a href="/" className="hover:text-accent transition-colors">
                  Accueil
                </a>
                <a href="/events" className="hover:text-accent transition-colors">
                  Événements
                </a>
                <a href="/speakers" className="hover:text-accent transition-colors">
                  Speakers
                </a>
                <a href="/about" className="hover:text-accent transition-colors">
                  À propos
                </a>
                <a href="/become-speaker" className="hover:text-accent transition-colors">
                  Devenir Speaker
                </a>
                <a href="/contact" className="hover:text-accent transition-colors">
                  Contact
                </a>
              </div>
            </nav>
          </div>
        </header>

        <main>
          <div className="relative py-12">
            <div
              className={cn(
                "absolute top- inset-0 pointer-events-none -z-10",
                "[background-size:20px_20px] opacity-65",
                "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
                "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
              )}
            />
          {children}          
          </div>
          </main>

        <footer className="border-t">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} Next Event. Tous droits réservés.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
