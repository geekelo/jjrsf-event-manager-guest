"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchSingleEvent, registerForEvent, resetRegistration } from "../redux/slices/eventSlice"
import { CalendarDays, User, MapPin, Mail, Phone, Check, X, Loader2, Heart, ChevronRight } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../styles/registration.css"

const EventRegistration = () => {
  const { unique_id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    singleEvent: event,
    loading: eventLoading,
    error: eventError,
    registrationLoading,
    registrationError,
    registrationSuccess,
    registeredAttendee,
  } = useSelector((state) => state.events)
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    whatsapp: "",
    phone: "",
    gender: "",
    member: false,
    preferred_attendance: event?.onsite && event?.online ? "" : event?.onsite ? "onsite" : "online",
    family: false,
    family_members: "", 
  })

  // Form validation state
  const [validationErrors, setValidationErrors] = useState({})
  const [formTouched, setFormTouched] = useState(false)

  useEffect(() => {
    if (unique_id) {
      dispatch(fetchSingleEvent(unique_id))
    }

    // Reset registration state when component unmounts
    return () => {
      dispatch(resetRegistration())
    }
  }, [unique_id, dispatch])

  // Show error toast when registration error occurs
  useEffect(() => {
    if (registrationError) {
      toast.error(registrationError)
    }
  }, [registrationError])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })

    // Mark form as touched
    if (!formTouched) {
      setFormTouched(true)
    }

    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: null,
      })
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.name.trim()) {
      errors.name = "Name is required"
    }

    if (!formData.gender) {
      errors.gender = "Gender is required"
    }

    if (!formData.preferred_attendance) {
      errors.preferred_attendance = "Preferred attendance mode is required"
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (formData.family && !formData.family_members.trim()) {
      errors.family_members = "Please enter the names of family members, separated by commas"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      // Show toast for validation errors
      toast.error("Please fill all required fields correctly")
      return
    }

    const formattedFamilyMembers = formData.family_members
    .split(",")
    .map((name) => name.trim())

  dispatch(
    registerForEvent({
      eventId: event.id,
      formData: { ...formData, family_members: formattedFamilyMembers },
    }),
  )
}  

  useEffect(() => {
    if (registrationSuccess) {
      toast.success(`Successfully registered for ${event.name}! Kindly copy your OTP or check your email.`)
      // Redirect after successful registration
      const timer = setTimeout(() => {
        navigate(`/event/${unique_id}`)
      }, 13000)

      return () => clearTimeout(timer)
    }
  }, [registrationSuccess, navigate, unique_id, event])

  if (eventLoading) {
    return (
      <div className="registration-loading">
        <div className="spinner"></div>
        <p>Loading event details...</p>
      </div>
    )
  }

  if (eventError || !event) {
    return (
      <div className="registration-error">
        <X size={50} />
        <h3>Event Not Found</h3>
        <p>{eventError || "We couldn't find the event you're looking for."}</p>
        <button onClick={() => navigate("/")} className="back-button">
          Back to Events
        </button>
      </div>
    )
  }

  const isRegistrationClosed = event.registration_deadline_status === "closed" ? true : false;

  if (isRegistrationClosed) {
    return (
      <div className="registration-closed">
        <div className="registration-closed-content">
          <X size={50} className="closed-icon" />
          <h2>Early-bird Registration Closed</h2>
          <p>The registration period for this event has ended.</p>
          <button onClick={() => navigate(`/event/${unique_id}`)} className="back-button">
            Back to Event
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="registration-wrapper">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />

      {registrationSuccess ? (
        <div className="registration-success">
          <div className="success-content">
            <div className="success-icon">
              <Check size={50} />
            </div>
            <h2>Registration Successful!</h2>
            <p>Thank you for registering for {event.name}.</p>
            <p> Kindly copy your OTP to access the event</p>
            <h1 className="otp-background">{registeredAttendee.attendee.otp}</h1>
            <p>You will be redirected to the event page shortly.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="registration-header">
            <h1>Register for Event</h1>
            <div className="event-info">
              <h2>{event.name}</h2>
              <p className="event-date">
                <CalendarDays size={18} />
                {new Date(event.start_date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="registration-card">
            <form onSubmit={handleSubmit} className="registration-form">
              <div className="form-section">
                <h3 className="form-section-title">
                  <User size={18} />
                  Personal Information
                </h3>

                <div className="form-group">
                  <label htmlFor="name">
                    Full Name <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <User size={18} className="input-icon" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={`register-input ${validationErrors.name} ? "error" : ""`}
                    />
                  </div>
                  {validationErrors.name && (
                    <p className="error-message">{validationErrors.name}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <div className="input-wrapper">
                    <MapPin size={18} className="input-icon" />
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="register-input"
                      placeholder="Enter your address "
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <div className="input-wrapper">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className={`register-input ${validationErrors.email} ? "error" : ""`}
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="error-message">{validationErrors.email}</p>
                  )}
                </div>
              </div>

              <div className="form-section">
                <h3 className="form-section-title">
                  <Phone size={18} />
                  Contact Information
                </h3>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="whatsapp">WhatsApp</label>
                    <div className="input-wrapper">
                      <Phone size={18} className="input-icon" />
                      <input
                        type="text"
                        id="whatsapp"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        className="register-input"
                        placeholder="E.g +2347035524042"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <div className="input-wrapper">
                      <Phone size={18} className="input-icon" />
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="register-input"
                        placeholder="E.g +2347035524042"
                      />
                    </div>
                    <div className="checkbox-row">
                    <input
                      type="checkbox"
                      id="phone"
                      name="phone"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData((prev) => ({
                            ...prev,
                            phone: prev.whatsapp,
                          }));
                        }
                      }}
                    />
                    <label htmlFor="phone">Same as WhatsApp number</label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="form-section-title">
                  <Heart size={18} />
                  Preferences
                </h3>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="gender">
                      Gender <span className="required">*</span>
                    </label>
                    <div className="select-wrapper">
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={validationErrors.gender ? "error" : ""}
                      >
                        <option value="">Select gender</option>
                        <option value="f">Female</option>
                        <option value="m">Male</option>
                      </select>
                    </div>
                    {validationErrors.gender && (
                      <p className="error-message">{validationErrors.gender}</p>
                    )}
                  </div>

                  {(event?.onsite && event?.online) && (
                    <div className="form-group">
                      <label htmlFor="preferred_attendance">
                        Preferred Attendance <span className="required">*</span>
                      </label>
                      <div className="select-wrapper">
                        <select
                          id="preferred_attendance"
                          name="preferred_attendance"
                          value={formData.preferred_attendance}
                          onChange={handleChange}
                          className={
                            validationErrors.preferred_attendance ? "error" : ""
                          }
                        >
                          <option value="">Select attendance mode</option>
                          <option value="online">Online</option>
                          <option value="onsite">Offline</option>
                        </select>
                      </div>
                      {validationErrors.preferred_attendance && (
                        <p className="error-message">
                          {validationErrors.preferred_attendance}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                {/* Family Registration Section */}
                <div className="form-group">
                  <label>Are you registering for your family?</label>
                  <div>
                    <label className="radio-container">
                      <input
                        type="radio"
                        name="family"
                        value="true"
                        checked={formData.family === true}
                        onChange={handleChange}
                      />
                      Yes
                    </label>
                    <label className="radio-container">
                      <input
                        type="radio"
                        name="family"
                        value="false"
                        checked={formData.family === false}
                        onChange={handleChange}
                      />
                      Just Me Alone
                    </label>
                  </div>
                </div>

                {formData.family && (
                  <div className="form-group">
                    <label htmlFor="family_members">
                      Family Member Names (separate with commas)
                    </label>
                    <input
                      type="text"
                      id="family_members"
                      name="family_members"
                      value={formData.family_members}
                      onChange={handleChange}
                      placeholder="Enter family member names"
                      className={validationErrors.family_members ? "error" : ""}
                    />
                    {validationErrors.family_members && (
                      <p className="error-message">
                        {validationErrors.family_members}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    name="member"
                    checked={formData.member}
                    onChange={handleChange}
                  />
                  <span className="checkmark"></span>I am a member of JJRS
                  Foundation
                </label>
              </div>

              <div className="form-note">
                <Heart size={16} className="note-icon" />
                <p>
                  Thank you for your interest in our event. We look forward to
                  seeing you!
                </p>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => navigate(`/event/${unique_id}`)}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={registrationLoading}
                >
                  {registrationLoading ? (
                    <>
                      <Loader2 size={18} className="spinner-icon" />
                      Registering...
                    </>
                  ) : (
                    <>
                      Register Now
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default EventRegistration
