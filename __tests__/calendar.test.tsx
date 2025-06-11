import { render, screen, fireEvent } from "@testing-library/react"
import Calendar from "@/components/calendar"
import type { Event } from "@/lib/graphql"

// Mock data
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Test Event 1",
    slug: "test-event-1",
    content: "Test content",
    excerpt: "Test excerpt",
    date: "2024-01-15T10:00:00Z",
    eventDetails: {
      startDate: "2024-01-15T10:00:00Z",
      endDate: "2024-01-15T12:00:00Z",
      location: "Test Location",
      category: "Workshop",
      maxAttendees: 50,
      registrationDeadline: "2024-01-14T23:59:59Z",
    },
    seo: {
      title: "Test Event 1",
      metaDesc: "Test description",
    },
  },
  {
    id: "2",
    title: "Test Event 2",
    slug: "test-event-2",
    content: "Test content 2",
    excerpt: "Test excerpt 2",
    date: "2024-01-20T14:00:00Z",
    eventDetails: {
      startDate: "2024-01-20T14:00:00Z",
      endDate: "2024-01-20T16:00:00Z",
      location: "Test Location 2",
      category: "Conference",
      maxAttendees: 100,
      registrationDeadline: "2024-01-19T23:59:59Z",
    },
    seo: {
      title: "Test Event 2",
      metaDesc: "Test description 2",
    },
  },
]

const mockCategories = ["Workshop", "Conference"]

describe("Calendar Component", () => {
  it("renders calendar with events", () => {
    render(<Calendar events={mockEvents} categories={mockCategories} />)

    expect(screen.getByText("Test Event 1")).toBeInTheDocument()
    expect(screen.getByText("Test Event 2")).toBeInTheDocument()
  })

  it("switches between list and grid view", () => {
    render(<Calendar events={mockEvents} categories={mockCategories} />)

    const gridButton = screen.getByRole("button", { name: /grid/i })
    const listButton = screen.getByRole("button", { name: /list/i })

    // Should start in list view
    expect(listButton).toHaveClass("bg-primary")

    // Switch to grid view
    fireEvent.click(gridButton)
    expect(gridButton).toHaveClass("bg-primary")
  })

  it("filters events by category", () => {
    render(<Calendar events={mockEvents} categories={mockCategories} />)

    // All events should be visible initially
    expect(screen.getByText("Test Event 1")).toBeInTheDocument()
    expect(screen.getByText("Test Event 2")).toBeInTheDocument()

    // Filter by Workshop category
    const categorySelect = screen.getByRole("combobox")
    fireEvent.click(categorySelect)

    const workshopOption = screen.getByText("Workshop")
    fireEvent.click(workshopOption)

    // Only Workshop event should be visible
    expect(screen.getByText("Test Event 1")).toBeInTheDocument()
    expect(screen.queryByText("Test Event 2")).not.toBeInTheDocument()
  })

  it("shows no events message when filtered results are empty", () => {
    render(<Calendar events={[]} categories={mockCategories} />)

    expect(screen.getByText("No events found")).toBeInTheDocument()
    expect(screen.getByText("Try adjusting your filters or check back later for new events.")).toBeInTheDocument()
  })

  it("displays event details correctly in list view", () => {
    render(<Calendar events={mockEvents} categories={mockCategories} />)

    // Check if event details are displayed
    expect(screen.getByText("Test Location")).toBeInTheDocument()
    expect(screen.getByText("Workshop")).toBeInTheDocument()
    expect(screen.getByText("Test excerpt")).toBeInTheDocument()
  })
})
