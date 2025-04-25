"use client"

import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import { useDispatch, useSelector } from "react-redux"
import { fetchSingleEvent } from "../../redux/slices/eventSlice"
import { CalendarDays, MapPin, Users, ArrowRight } from "lucide-react"
import "react-toastify/dist/ReactToastify.css"
import "../../styles/eventDetails.css"

const EventDetails = () => {
  const { unique_id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { singleEvent: event, loading, error } = useSelector((state) => state.events)

  useEffect(() => {
    if (unique_id) {
      dispatch(fetchSingleEvent(unique_id))
    }
  }, [unique_id, dispatch])

  // Explicitly define the handleRegister function to navigate to registration page
  const handleRegister = () => {
    navigate(`/event/${unique_id}/register`)
  }

  if (loading)
    return (
      <div className="event-loading">
        <div className="spinner"></div>
        <p>Loading event details...</p>
      </div>
    )

  if (error) {
    toast.error(error)
    return (
      <div className="event-error">
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    )
  }

  if (!event) return <div className="event-not-found">Event not found</div>

  // Event date comparison logic
  const eventStartDate = new Date(event.start_date)
  const today = new Date()

  const isBeforeRegistrationDeadline = today < new Date(event.registration_deadline)
  const isEventStartedOrLater = today >= eventStartDate

  return (
    <div className="event-details">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover />

      <div className="event-details-container">
        <h1 className="event-title">{event.name}</h1>

        <div className="event-meta">
          <div className="meta-item">
            <CalendarDays size={18} />
            <span>
              {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
            </span>
          </div>

          {event.location && (
            <div className="meta-item">
              <MapPin size={18} />
              <span>{event.location}</span>
            </div>
          )}

          <div className="meta-item">
            <Users size={18} />
            <span>Limited Seats Available</span>
          </div>
        </div>

        <div className="event-image">
          <img src={event.banner_url || "/featured.jpeg"} alt={event.name} />
        </div>

        <div className="event-description">
          <h3>About This Event</h3>
          <p>{event.description || "Join us for this amazing event organized by JJRSF Foundation."}</p>
        </div>

        <div className="event-actions">
          {isBeforeRegistrationDeadline && (
            <button onClick={handleRegister} className="register-button">
              Register for Event <ArrowRight size={16} />
            </button>
          )}

          {isEventStartedOrLater && (
            <button className="watch-button">
              Watch Online <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventDetails
