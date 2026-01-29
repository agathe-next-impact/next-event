import React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import Image from "next/image"
import AnimatedCursorWrapper from "@/components/animated-cursor-wrapper"
import Link from "next/link"
import dynamic from "next/dynamic"
const MobileMenu = dynamic(() => import("@/components/mobile-menu"), { ssr: false });

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
    url: process.env.PUBLIC_SITE_URL,
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
      <link rel="icon" href="/images/logo-next-event.png" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    </head>
      <body className={cn(inter.className, "min-h-screen bg-background antialiased")}>
        <AnimatedCursorWrapper />
        <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex justify-between items-center">
              <Link href="/">
                <Image
                  src="/images/logo-next-event.png"
                  alt="Next Event Portal Logo"
                  width={150}
                  height={50}
                  className="h-12 w-max object-contain"
                />
              </Link>
              {/* Menu desktop */}
              <div className="hidden md:flex items-center gap-6">
                <Link href="/events" className="hover:text-accent transition-colors">Événements</Link>
                <Link href="/speakers" className="hover:text-accent transition-colors">Speakers</Link>
                <Link href="/about" className="hover:text-accent transition-colors">À propos</Link>
                <Link href="/become-speaker" className="hover:text-accent transition-colors">Devenir Speaker</Link>
                <Link href="/contact" className="hover:text-accent transition-colors">Contact</Link>
              </div>
              {/* Menu mobile/tablette */}
              <div className="md:hidden">
                <MobileMenu />
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
