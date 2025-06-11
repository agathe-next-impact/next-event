import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"
import { getEventBySlug } from "@/lib/graphql"
import React from "react"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("slug")

    if (!slug) {
      return new Response("Missing slug parameter", { status: 400 })
    }

    const event = await getEventBySlug(slug)

    if (!event) {
      return new Response("Event not found", { status: 404 })
    }

    const { title, eventDetails } = event
    const { startDate, location, category } = eventDetails

    return new ImageResponse(
      React.createElement(
        "div",
        {
          style: {
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffffff",
            backgroundImage: "linear-gradient(45deg, #f0f9ff 0%, #e0f2fe 100%)",
          },
        },
        React.createElement(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px",
              maxWidth: "800px",
              textAlign: "center",
            },
          },
          React.createElement(
            "div",
            {
              style: {
                fontSize: "24px",
                fontWeight: "bold",
                color: "#3b82f6",
                marginBottom: "20px",
                padding: "8px 16px",
                backgroundColor: "#dbeafe",
                borderRadius: "8px",
              },
            },
            category
          ),
          React.createElement(
            "h1",
            {
              style: {
                fontSize: "48px",
                fontWeight: "bold",
                color: "#1f2937",
                marginBottom: "20px",
                lineHeight: "1.2",
              },
            },
            title
          ),
          React.createElement(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "30px",
                fontSize: "20px",
                color: "#6b7280",
                marginBottom: "20px",
              },
            },
            React.createElement(
              "div",
              { style: { display: "flex", alignItems: "center", gap: "8px" } },
              "📅 ",
              new Date(startDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            ),
            React.createElement(
              "div",
              { style: { display: "flex", alignItems: "center", gap: "8px" } },
              "📍 ",
              location
            )
          ),
          React.createElement(
            "div",
            {
              style: {
                fontSize: "18px",
                color: "#9ca3af",
                fontWeight: "500",
              },
            },
            "Event Portal"
          )
        )
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error("Error generating OG image:", error)
    return new Response("Failed to generate image", { status: 500 })
  }
}
