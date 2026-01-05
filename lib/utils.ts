import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, format: "short" | "long" = "short") {
  const dateObj = typeof date === "string" ? new Date(date) : date

  if (format === "long") {
    return dateObj.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return dateObj.toLocaleDateString("fr-FR", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function generateOGImageUrl(slug: string) {
  const baseUrl = process.env.PUBLIC_SITE_URL || "http://localhost:3000"
  return `${baseUrl}/api/og?slug=${encodeURIComponent(slug)}`
}
