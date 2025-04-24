import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const EventDetails = () => {
  const { unique_id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${unique_id}`)
        if (!response.ok) throw new Error("Event not found")
        const data = await response.json()
        setEvent(data)
      } catch (err) {
        setError("Event not found or API issue")
        toast.error("Event not found")
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [unique_id])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  // Event date comparison logic
  const eventStartDate = new Date(event.start_date)
  const eventEndDate = new Date(event.end_date)
  const today = new Date()

  const isBeforeRegistrationDeadline = today < new Date(event.registration_deadline)
  const isEventStartedOrLater = today >= eventStartDate

  return (
    <div className="event-details">
      <ToastContainer autoClose={3000} />

      {event ? (
        <div>
          <h1>{event.name}</h1>
          <img src={event.banner_url} alt={event.name} />
          <p>{event.description}</p>
          <p>Date: {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}</p>

          {/* Conditional UI Buttons */}
          {isBeforeRegistrationDeadline && (
            <button>Register for Event</button>
          )}

          {isEventStartedOrLater && (
            <button>Watch Online</button>
          )}
        </div>
      ) : (
        <p>Event not found</p>
      )}
    </div>
  )
}

export default EventDetails
