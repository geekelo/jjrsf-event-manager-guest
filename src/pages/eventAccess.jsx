"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import "../styles/access.css"
import { fetchSingleEvent } from "../redux/slices/eventSlice"
import { CalendarDays, Clock, AlertCircle, Mail, Key, Eye } from "lucide-react"

const GuestEventAccess = () => {
  const { unique_id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Destructure state from useSelector
  const { singleEvent: event, loading, error } = useSelector((state) => state.events)

  const [accessMode, setAccessMode] = useState("otp")
  const [input, setInput] = useState(["", "", "", "", ""])
  const [formError, setFormError] = useState("")
  const [countdown, setCountdown] = useState("")

  useEffect(() => {
    if (unique_id) {
      dispatch(fetchSingleEvent(unique_id))
    }
  }, [unique_id, dispatch])

  useEffect(() => {
    if (event) {
      const interval = setInterval(() => {
        const now = new Date()
        const start = new Date(event.start_date)
        const timeLeft = start - now

        if (timeLeft <= 0) {
          clearInterval(interval)
          setCountdown("Event is live!")
        } else {
          const hrs = Math.floor(timeLeft / 1000 / 60 / 60)
          const mins = Math.floor((timeLeft / 1000 / 60) % 60)
          const secs = Math.floor((timeLeft / 1000) % 60)
          setCountdown(`${hrs}h ${mins}m ${secs}s`)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [event])

  const toggleMode = () => {
    setAccessMode((prev) => (prev === "otp" ? "email" : "otp"))
    setInput(["", "", "", "", ""])
    setFormError("")
  }

  const handleValidation = () => {
    if (accessMode === "otp" && input.join("").length !== 5) {
      setFormError("Please enter a valid 5-digit OTP.")
    } else if (accessMode === "email" && !/\S+@\S+\.\S+/.test(input.join(""))) {
      setFormError("Please enter a valid email address.")
    } else {
      setFormError("")
      console.log("Proceeding to event stream with:", input.join(""))
    }
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

  const isRegistrationClosed = new Date() > new Date(event.registration_deadline)
  const showAttend =
    new Date(event.start_date).toDateString() === new Date().toDateString() && (event.online || event.onsite)

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
      </p>

      <div className="event-card">
        {isRegistrationClosed ? (
          <p className="event-status closed">Registration Closed</p>
        ) : (
          <button className="register-btn">Register Now</button>
        )}

        <div className="countdown-container">
          <p className="countdown">
            <Clock size={24} />
            {countdown}
          </p>
        </div>

        {showAttend && (
          <div className="access-section">
            <h3>Attend Online</h3>
            <label>{accessMode === "otp" ? "Enter 5-digit OTP" : "Enter your Email"}</label>

            {/* OTP Input as 5 separate boxes */}
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
                      if (e.target.value && idx < 4) {
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

            <button onClick={handleValidation} className="watch-btn">
              <Eye size={18} style={{ marginRight: "8px" }} />
              Watch Event
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
                  Use 5-digit OTP instead
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default GuestEventAccess
