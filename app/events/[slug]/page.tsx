import Image from "next/image"
import { draftMode } from "next/headers"
import { notFound } from "next/navigation"
import { getWPData } from "@/lib/graphql"

type EventPageProps = {
  params: {
    slug: string
  }
}

type EventNode = {
  databaseId: number
  slug: string
  title: string
  content: string
  date: string
  featuredImage?: {
    node?: {
      sourceUrl: string
      altText?: string | null
    } | null
  } | null
}

type EventQueryResponse = {
  data?: {
    event?: EventNode | null
  }
  errors?: { message: string }[]
}

const EVENT_QUERY = `
  query EventById($id: ID!, $idType: EventIdTypeEnum!, $asPreview: Boolean = false) {
    event(id: $id, idType: $idType, asPreview: $asPreview) {
      databaseId
      slug
      title
      content
      date
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`

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

  // On utilise toujours SLUG car WordPress envoie le slug en preview
  // asPreview permet de récupérer le brouillon même non publié
  const variables = {
    id: params.slug,
    idType: "SLUG",
    asPreview: isEnabled,
  }

  const response: EventQueryResponse = await getWPData(EVENT_QUERY, variables)
  const event = response?.data?.event

  if (!event) {
    notFound()
  }

  const eventDate = formatEventDate(event.date)
  const imageUrl = event.featuredImage?.node?.sourceUrl
  const imageAlt = event.featuredImage?.node?.altText || event.title

  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
      {isEnabled && <PreviewBanner />}

      <header className="space-y-2">
        {eventDate && <p className="text-sm text-muted-foreground">{eventDate}</p>}
        <h1 className="text-3xl font-semibold leading-tight">{event.title}</h1>
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
