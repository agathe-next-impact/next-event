import { type NextRequest, NextResponse } from "next/server"
import { getEventBySlug } from "@/lib/graphql"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get("slug")
  const secret = searchParams.get("secret")

  // Check for secret and slug
  if (!secret || !slug) {
    return NextResponse.json({ message: "Missing parameters" }, { status: 401 })
  }

  // Verify the secret
  if (secret !== process.env.PREVIEW_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 })
  }

  // Check if the event exists
  const event = await getEventBySlug(slug, true)
  if (!event) {
    return NextResponse.json({ message: "Event not found" }, { status: 404 })
  }

  // Enable Preview Mode
  const response = NextResponse.redirect(new URL(`/events/${slug}?preview=true`, request.url))
  response.cookies.set("__prerender_bypass", "1", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  })

  return response
}
