"use client"

import { useState, useEffect } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from "date-fns"
import { CalendarIcon, Grid, List, ChevronLeft, ChevronRight, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Event } from "@/lib/graphql"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"

interface CalendarProps {
  events: Event[]
  categories: string[]
}

type ViewMode = "list" | "grid"

export default function Calendar({ events, categories }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events)

  useEffect(() => {
    let filtered = events

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((event) => event.eventDetails.category === selectedCategory)
    }

    // Filter by current month in grid view
    if (viewMode === "grid") {
      const monthStart = startOfMonth(currentDate)
      const monthEnd = endOfMonth(currentDate)
      filtered = filtered.filter((event) => {
        const eventDate = parseISO(event.eventDetails.startDate)
        return eventDate >= monthStart && eventDate <= monthEnd
      })
    }

    setFilteredEvents(filtered)
  }, [events, selectedCategory, currentDate, viewMode])

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter((event) => isSameDay(parseISO(event.eventDetails.startDate), date))
  }

  const renderGridView = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

    return (
      <div className="grid grid-cols-7 gap-1">
        {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day) => (
          <div key={day} className="p-2 text-center font-semibold text-sm text-muted-foreground">
            {day}
          </div>
        ))}
        {days.map((day) => {
          const dayEvents = getEventsForDate(day)
          const isCurrentMonth = isSameMonth(day, currentDate)

          return (
            <div
              key={day.toISOString()}
              className={`min-h-[100px] p-1 border border-border ${isCurrentMonth ? "bg-background" : "bg-muted/50"}`}
            >
              <div className="text-sm font-medium mb-1">{format(day, "d")}</div>
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map((event) => (
                  <Link key={event.id} href={`/events/${event.slug}`} className="block">
                    <div className="text-xs p-1 bg-accent/10 text-black rounded truncate hover:bg-accent/20 transition-colors">
                      {event.title}
                    </div>
                  </Link>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-muted-foreground">+{dayEvents.length - 2} de plus</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderListView = () => (
    <div className="space-y-1">
      {filteredEvents.map((event) => (
        <Card key={event.id}>
          <CardContent className="p-6">
            <div className="flex gap-4">
              {event.featuredImage && (
                <div className="flex-shrink-0">
                  <Image
                    src={event.featuredImage.node.sourceUrl || "/placeholder.svg"}
                    alt={event.featuredImage.node.altText || event.title}
                    width={120}
                    height={80}
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <Link href={`/events/${event.slug}`}>
                      <h3 className="text-lg font-semibold hover:text-destructive transition-colors">{event.title}</h3>
                    </Link>
                    <p className="text-muted-foreground text-sm mt-1">{event.excerpt}</p>
                  </div>
                  <Badge variant="secondary">{event.eventDetails.category}</Badge>
                </div>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    {formatDate(event.eventDetails.startDate, "long")}
                  </div>
                  <div>📍 {event.eventDetails.location}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-accent text-black" : ""}
          >
            <List className="h-4 w-4 mr-1" />
            Liste
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-accent text-black" : ""}
          >
            <Grid className="h-4 w-4 mr-1" />
            Grille
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Month Navigation (Grid View Only) */}
      {viewMode === "grid" && (
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">{format(currentDate, "MMMM yyyy")}</h2>
          <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Calendar Content */}
      {viewMode === "grid" ? renderGridView() : renderListView()}

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucun événement trouvé</h3>
          <p className="text-muted-foreground">
            Essayez d'ajuster vos filtres ou revenez plus tard pour de nouveaux événements.
          </p>
        </div>
      )}
    </div>
  )
}
