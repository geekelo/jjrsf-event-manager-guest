import { CalendarDays } from "lucide-react"
import { useNavigate } from "react-router-dom"

const GuestEventCard = ({ event, formatDate }) => {
  const navigate = useNavigate()

  return (
    <div className="guest-event-card" onClick={() => navigate(`/events/${event.id}`)}>
      <img
        src={event.image_url || "https://placehold.co/250x150"}
        alt={event.name}
        className="guest-event-image"
      />
      <div className="guest-event-info">
        <h3>{event.name}</h3>
        <p className="guest-event-dates">
          <CalendarDays size={16} className="calendar-icon" />
          {event.start_date === event.end_date
            ? formatDate(event.start_date)
            : `${formatDate(event.start_date)} - ${formatDate(event.end_date)}`}
        </p>
      </div>
    </div>
  )
}

export default GuestEventCard
