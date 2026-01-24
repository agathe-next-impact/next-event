import Image from "next/image"
import { draftMode } from "next/headers"
import { notFound } from "next/navigation"
import { getEventBySlug } from "@/lib/graphql"
import { getEventBySlugWithPreview } from "@/lib/wordpress-api"
import { decodeHTMLEntities } from "@/lib/decodeHTMLEntities"

type EventPageProps = {
  params: {
    slug: string
  }
}

const PreviewBanner = () => (
  <div className="bg-amber-200 text-amber-900 px-4 py-2 text-sm font-semibold border-b border-amber-300">
    Mode preview actif : vous consultez un brouillon WordPress.
  </div>
)

const formatEventDate = (value?: string | null) => {
  if (!value) {
    return null
  }

  return new Date(value).toLocaleDateString("fr-FR", {
    dateStyle: "long",
  })
}

export default async function EventPage({ params }: EventPageProps) {
  const { isEnabled } = draftMode()

  // En mode preview, on utilise l'API REST avec authentification pour récupérer les brouillons
  // Sinon, on utilise la fonction standard getEventBySlug
  const event = isEnabled
    ? await getEventBySlugWithPreview(params.slug)
    : await getEventBySlug(params.slug)

  if (!event) {
    notFound()
  }

  const eventDate = formatEventDate(event.date)
  const imageUrl = event.featuredImage?.node?.sourceUrl
  const imageAlt = event.featuredImage?.node?.altText || event.title
  const title = typeof event.title === "string" ? decodeHTMLEntities(event.title.replace(/<[^>]+>/g, "")) : event.title

  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
      {isEnabled && <PreviewBanner />}

      <header className="space-y-2">
        {eventDate && <p className="text-sm text-muted-foreground">{eventDate}</p>}
        <h1 className="text-3xl font-semibold leading-tight">{title}</h1>
      </header>

      {imageUrl ? (
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg border bg-muted">
          <Image src={imageUrl} alt={imageAlt} fill sizes="100vw" className="object-cover" />
        </div>
      ) : null}

      {event.content ? (
        <section
          className="prose prose-neutral dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: event.content }}
        />
      ) : null}
    </div>
  )
}
