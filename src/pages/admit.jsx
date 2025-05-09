"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import "../styles/access.css"
import { fetchSingleEvent } from "../redux/slices/eventSlice"
import { markAttendee, resetAttendanceStatus } from "../redux/slices/attendeeSlice"
import {
  CalendarDays,
  AlertCircle,
  Mail,
  Key,
  Eye,
  MapPin,
  Tag,
  Calendar,
  Users,
  X,
  CheckCircle,
  Clock,
} from "lucide-react"
import QuickRegistrationForm from "../components/forms/QuickRegistrationForm"

const Admit = () => {
  const { unique_id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Destructure state from useSelector
  const { singleEvent: event, loading, error } = useSelector((state) => state.events)
  // Add attendee state from reducer
  const {
    loading: attendeeLoading,
    error: attendeeError,
    success: attendeeSuccess,
    attendeeData,
  } = useSelector((state) => state.attendee)

  const [accessMode, setAccessMode] = useState("otp")
  const [input, setInput] = useState(["", "", "", "", "", ""]) // Updated to 6 digits
  const [formError, setFormError] = useState("")
  const [countdown, setCountdown] = useState("")
  const [eventStatus, setEventStatus] = useState("") // "upcoming", "ongoing", or "completed"
  const [showQuickRegistration, setShowQuickRegistration] = useState(false)
  const [showResultModal, setShowResultModal] = useState(false)

  useEffect(() => {
    if (unique_id) {
      dispatch(fetchSingleEvent(unique_id))
    }
  }, [unique_id, dispatch])

  // Update when attendance marking is successful or has error
  useEffect(() => {
    if (attendeeSuccess || attendeeError) {
      setShowResultModal(true)
    }
  }, [attendeeSuccess, attendeeError])

  useEffect(() => {
    if (event) {
      const interval = setInterval(() => {
        const now = new Date()
        const start = new Date(event.start_date)
        const end = new Date(event.end_date)
        const timeLeft = start - now

        // Determine event status
        if (now < start) {
          setEventStatus("upcoming")
          // Calculate countdown for upcoming events
          const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
          const hrs = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const mins = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
          const secs = Math.floor((timeLeft % (1000 * 60)) / 1000)

          if (days > 0) {
            setCountdown(`${days}d ${hrs}h ${mins}m ${secs}s`)
          } else {
            setCountdown(`${hrs}h ${mins}m ${secs}s`)
          }
        } else if (now >= start && now <= end) {
          setEventStatus("ongoing")
          setCountdown("EVENT IS LIVE TODAY!")
        } else if (now > end) {
          setEventStatus("completed")
          setCountdown("REWATCH EVENT")
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [event])

  const toggleMode = () => {
    setAccessMode((prev) => (prev === "otp" ? "email" : "otp"))
    setInput(accessMode === "otp" ? [""] : ["", "", "", "", "", ""])
    setFormError("")
  }

  const handleValidation = () => {
    if (accessMode === "otp" && input.join("").length !== 6) {
      setFormError("Please enter a valid 6-digit OTP.")
    } else if (accessMode === "email" && !/\S+@\S+\.\S+/.test(input.join(""))) {
      setFormError("Please enter a valid email address.")
    } else {
      setFormError("")

      // Convert OTP to lowercase before sending
      const accessValue = accessMode === "otp" ? input.join("").toLowerCase() : input.join("")

      // Create payload based on access mode
      const payload = {
        event_id: event.id,
        mode: "offline", // Using offline mode for admit page
      }

      if (accessMode === "otp") {
        payload.otp = accessValue
      } else {
        payload.email = accessValue
      }

      // Dispatch the markAttendee action
      dispatch(markAttendee(payload))
    }
  }

  const handleQuickRegistration = () => {
    setShowQuickRegistration(true)
  }

  const closeQuickRegistration = () => {
    setShowQuickRegistration(false)
  }

  const closeResultModal = () => {
    setShowResultModal(false)
    // Reset the attendance status in Redux
    dispatch(resetAttendanceStatus())
    // Clear input fields after closing modal
    setInput(accessMode === "otp" ? ["", "", "", "", "", ""] : [""])
  }

  if (loading) {
    return (
      <div className="event-loading">
        <div className="spinner" />
        <p>Loading event details...</p>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="event-error">
        <AlertCircle size={50} />
        <h3>Event Not Found</h3>
        <p>{error || "We couldn't find the event you're looking for."}</p>
      </div>
    )
  }

  const isRegistrationClosed = event.registration_deadline_status === "closed"
  const isEventPastOrOngoing = event.event_status === "ongoing" || event.event_status === "completed"
  const showAttend = event.event_status === "ongoing" || event.event_status === "completed"

  // Determine event type tag
  let eventTypeTag = ""
  if (event.online && event.onsite) {
    eventTypeTag = "Hybrid (Online & Onsite)"
  } else if (event.online) {
    eventTypeTag = "Online"
  } else if (event.onsite) {
    eventTypeTag = "Onsite"
  }

  // Add formatTime function after the component declaration
  const formatTime = (timeString) => {
    if (!timeString) return "N/A"
    const options = { hour: "2-digit", minute: "2-digit", hour12: true }
    return new Date(timeString).toLocaleTimeString("en-US", options)
  }

  return (
    <div className="event-access-wrapper">
      <h1 className="event-title">{event.name}</h1>
      <p className="event-date">
        <CalendarDays size={18} />
        {new Date(event.start_date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
        {event.start_time && (
          <span className="event-time">
            <Clock size={18} style={{ marginLeft: "15px", marginRight: "5px" }} />
            {formatTime(event.start_time)} - {formatTime(event.end_time)}
          </span>
        )}
      </p>

      <div className="event-card">
        {event.image_url && (
          <div className="event-image-container">
            <img src={event.image_url || "/featured.jpeg"} alt={event.name} className="event-image" />
          </div>
        )}

        <div className="event-type-tag">
          <Tag size={16} />
          <span>{eventTypeTag}</span>
        </div>

        <div className="event-details-section">
          {event.description && (
            <div className="event-description">
              <h3>About This Event</h3>
              <p>{event.description}</p>
            </div>
          )}

          <div className="event-meta-info">
            {event.location && (
              <div className="meta-detail">
                <MapPin size={18} />
                <span>Location: {event.location}</span>
              </div>
            )}

            <div className="meta-detail">
              <Calendar size={18} />
              <span>
                Registration Deadline:{" "}
                {new Date(event.registration_deadline).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                {event.registration_deadline_time && <span> at {formatTime(event.registration_deadline_time)}</span>}
              </span>
            </div>
          </div>
        </div>

        {isRegistrationClosed ? (
          <p className="event-status closed">Early-bird Registration Closed</p>
        ) : (
          <button className="register-btn" onClick={() => navigate(`/event/${unique_id}/register`)}>
            Register Now
          </button>
        )}

        <div className={`countdown-container ${event.event_status}`}>
          <p className="countdown">Admit Guest</p>
        </div>

        {isEventPastOrOngoing && (
          <div className="quick-registration-section">
            <button onClick={handleQuickRegistration} className="quick-register-btn">
              <Users size={18} />
              Quick Registration
            </button>
            <p className="quick-reg-note">Not yet Registered? Register quickly with minimal information.</p>
          </div>
        )}

        {showAttend && (
          <div className="access-section">
            <h3>
              {eventStatus === "upcoming"
                ? "Attend Online"
                : eventStatus === "ongoing"
                  ? "Join Live Now"
                  : "Watch Recording"}
            </h3>
            <label>{accessMode === "otp" ? "Enter 6-digit OTP" : "Enter your Email"}</label>

            {/* OTP Input as 6 separate boxes */}
            {accessMode === "otp" && (
              <div className="otp-input-container">
                {input.map((char, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength="1"
                    value={char}
                    onChange={(e) => {
                      const newInput = [...input]
                      newInput[idx] = e.target.value
                      setInput(newInput)

                      // Auto-focus next input field after entry
                      if (e.target.value && idx < 5) {
                        const nextInput = e.target.nextElementSibling
                        if (nextInput) {
                          nextInput.focus()
                        }
                      }
                    }}
                    onKeyDown={(e) => {
                      // Handle backspace to go to previous input
                      if (e.key === "Backspace" && !char && idx > 0) {
                        const prevInput = e.target.previousElementSibling
                        if (prevInput) {
                          prevInput.focus()
                        }
                      }
                    }}
                    className="otp-input"
                  />
                ))}
              </div>
            )}

            {accessMode === "email" && (
              <input
                type="email"
                value={input.join("")}
                onChange={(e) => setInput([e.target.value])}
                className="access-input"
                placeholder="Enter your email address"
              />
            )}

            {formError && (
              <p className="error-msg">
                <AlertCircle size={16} style={{ marginRight: "8px" }} />
                {formError}
              </p>
            )}

            <button onClick={handleValidation} className="watch-btn" disabled={attendeeLoading}>
              {attendeeLoading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <Eye size={18} style={{ marginRight: "8px" }} />
                  {eventStatus === "upcoming"
                    ? "Admit Guest"
                    : eventStatus === "ongoing"
                      ? "Admit Guest"
                      : "Admit Guest"}
                </>
              )}
            </button>

            <p onClick={toggleMode} className="toggle-mode">
              {accessMode === "otp" ? (
                <>
                  <Mail size={14} style={{ marginRight: "5px", verticalAlign: "middle" }} />
                  Forgot your OTP? Use email instead
                </>
              ) : (
                <>
                  <Key size={14} style={{ marginRight: "5px", verticalAlign: "middle" }} />
                  Use 6-digit OTP instead
                </>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Success/Error Modal */}
      {showResultModal && (
        <div className="result-modal-overlay">
          <div className={`result-modal ${attendeeSuccess ? "success" : "error"}`}>
            <button className="close-modal" onClick={closeResultModal}>
              <X size={24} />
            </button>

            <div className="modal-icon">
              {attendeeSuccess ? <CheckCircle size={50} color="#4CAF50" /> : <AlertCircle size={50} color="#F44336" />}
            </div>

            <h3 className="modal-title">{attendeeSuccess ? "Success" : "Error"}</h3>

            <p className="modal-message">
              {attendeeSuccess
                ? `${attendeeData?.attendee?.name || "Guest"} has been successfully marked as attended. Kindly admit and grant access.`
                : `The OTP or Email entered was unrecognized. Please retry or Quick Register the guest to receive an OTP.`}
            </p>

            {!attendeeSuccess && (
              <button
                className="quick-register-modal-btn"
                onClick={() => {
                  closeResultModal()
                  handleQuickRegistration()
                }}
              >
                <Users size={18} style={{ marginRight: "8px" }} />
                Quick Register Guest
              </button>
            )}

            <button className="close-modal-btn" onClick={closeResultModal}>
              Close
            </button>
          </div>
        </div>
      )}

      {showQuickRegistration && event && <QuickRegistrationForm eventId={event.id} onClose={closeQuickRegistration} />}
    </div>
  )
}

export default Admit
