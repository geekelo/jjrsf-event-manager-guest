"use client"

// GuestEventCard.js
import { CalendarDays, Clock } from "lucide-react"
import { useNavigate } from "react-router-dom"

const GuestEventCard = ({ event, formatDate }) => {
  const navigate = useNavigate()

  // Add a function to format time
  const formatTime = (dateString) => {
    if (!dateString) return "N/A"
    const options = { hour: "2-digit", minute: "2-digit", hour12: true }
    return new Date(dateString).toLocaleTimeString("en-US", options)
  }

  return (
    <div className="guest-event-card" onClick={() => navigate(`/event/${event.unique_id}`)}>
      <img src={event.image_url || "https://placehold.co/250x150"} alt={event.name} className="guest-event-image" />
      <div className="guest-event-info">
        <h3>{event.name}</h3>
        <p className="guest-event-dates">
          <CalendarDays size={16} className="calendar-icon" />
          {event.start_date === event.end_date
            ? formatDate(event.start_date)
            : `${formatDate(event.start_date)} - ${formatDate(event.end_date)}`}
        </p>
        {event.start_time && (
          <p className="guest-event-times">
            <Clock size={16} className="clock-icon" />
            {formatTime(event.start_time)} - {formatTime(event.end_time)}
          </p>
        )}
      </div>
    </div>
  )
}

export default GuestEventCard
