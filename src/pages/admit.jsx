"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../styles/access.css";
import { fetchSingleEvent } from "../redux/slices/eventSlice";
import {
  markAttendee,
  resetAttendanceStatus,
} from "../redux/slices/attendeeSlice";
import {
  CalendarDays,
  Clock,
  AlertCircle,
  Mail,
  Key,
  Eye,
  MapPin,
  Tag,
  Calendar,
  Users,
  User,
  Phone,
  X,
  CheckCircle,
} from "lucide-react";
import { formatDescription } from "../utils/formatDescription";
import QuickRegistrationForm from "../components/forms/QuickRegistrationForm";

const Admit = () => {
  const { unique_id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Destructure state from useSelector
  const {
    singleEvent: event,
    loading,
    error,
  } = useSelector((state) => state.events);
  // Add attendee state from reducer
  const {
    loading: attendeeLoading,
    error: attendeeError,
    success: attendeeSuccess,
    attendeeData,
  } = useSelector((state) => state.attendee);

  const [singleInput, setSingleInput] = useState(""); // for email, name, phone
  const [accessMode, setAccessMode] = useState("otp");
  const [input, setInput] = useState(["", "", "", "", "", ""]); // Updated to 6 digits
  const [formError, setFormError] = useState("");
  const [countdown, setCountdown] = useState("");
  const [eventStatus, setEventStatus] = useState(""); // "upcoming", "ongoing", or "completed"
  const [showQuickRegistration, setShowQuickRegistration] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  useEffect(() => {
    if (unique_id) {
      dispatch(fetchSingleEvent(unique_id));
    }
  }, [unique_id, dispatch]);

  // Update when attendance marking is successful or has error
  useEffect(() => {
    if (attendeeSuccess || attendeeError) {
      setShowResultModal(true);
    }
  }, [attendeeSuccess, attendeeError]);

  useEffect(() => {
    if (event) {
      const interval = setInterval(() => {
        const now = new Date();
        const start = new Date(event.start_date);
        const end = new Date(event.end_date);
        const timeLeft = start - now;

        // Determine event status
        if (event.status === "upcoming") {
          setEventStatus("upcoming");
          // Calculate countdown for upcoming events
          const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
          const hrs = Math.floor(
            (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const mins = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          const secs = Math.floor((timeLeft % (1000 * 60)) / 1000);

          if (days > 0) {
            setCountdown(`${days}d ${hrs}h ${mins}m ${secs}s`);
          } else {
            setCountdown(`${hrs}h ${mins}m ${secs}s`);
          }
        } else if (event.status === "ongoing") {
          setEventStatus("ongoing");
          setCountdown("EVENT IS LIVE TODAY!");
        } else if (event.status === "completed") {
          setEventStatus("completed");
          setCountdown("REWATCH EVENT");
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [event]);


const getInputLabel = () => {
  switch (accessMode) {
    case "otp":
      return "Enter 6-digit OTP";
    case "email":
      return "Enter your Email Address";
    case "name":
      return "Enter your Full Name";
    case "phone":
      return "Enter your Phone Number";
    default:
      return "";
  }
};

// 2. Handle toggling modes
const toggleToMode = (mode) => {
  setAccessMode(mode);
  setSingleInput("");
  setInput(mode === "otp" ? ["", "", "", "", "", ""] : [""]);
  setFormError("");
};

// 3. Render all <p> toggle options
const renderModeOptions = () => {
  const modes = [
    { key: "otp", label: "Use 6-digit OTP", icon: <Key size={14} /> },
    { key: "email", label: "Use email instead", icon: <Mail size={14} /> },
    { key: "name", label: "Use name instead", icon: <User size={14} /> },
    {
      key: "phone",
      label: "Use phone number instead",
      icon: <Phone size={14} />,
    },
  ];

  return (
    <div className="mode-options">
      {modes.map((mode) => (
        <p
          key={mode.key}
          onClick={() => toggleToMode(mode.key)}
          className={accessMode === mode.key ? "active-mode" : ""}
          style={{ cursor: "pointer", marginBottom: "8px" }}
        >
          {mode.icon}
          <span style={{ marginLeft: "5px" }}>{mode.label}</span>
        </p>
      ))}
    </div>
  );
};

  // 4. Render the selected input
  const renderSelectedInput = () => {
    if (accessMode === "otp") {
      return (
        <div className="otp-input-container">
          {input.map((char, idx) => (
            <input
              key={idx}
              type="text"
              maxLength="1"
              value={char}
              onChange={(e) => {
                const newInput = [...input];
                newInput[idx] = e.target.value;
                setInput(newInput);

                if (e.target.value && idx < 5) {
                  const nextInput = e.target.nextElementSibling;
                  if (nextInput) {
                    nextInput.focus();
                  }
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !char && idx > 0) {
                  const prevInput = e.target.previousElementSibling;
                  if (prevInput) {
                    prevInput.focus();
                  }
                }
              }}
              className="otp-input"
            />
          ))}
        </div>
      );
    }

    let type = "text";
    let placeholder = "";
    if (accessMode === "email") {
      type = "email";
      placeholder = "Enter your email address";
    } else if (accessMode === "name") {
      placeholder = "Enter your full name";
    } else if (accessMode === "phone") {
      type = "tel";
      placeholder = "Enter your phone number";
    }

    return (
      <input
        type={type}
        value={singleInput}
        inputMode={accessMode === "phone" ? "numeric" : undefined}
        onChange={(e) => {
          const val =
            accessMode === "phone"
              ? e.target.value.replace(/[^\d+]/g, "")
              : e.target.value;
          setSingleInput(val);
        }}
        className="access-input"
        placeholder={placeholder}
      />
    );
  };

  const handleValidation = () => {
    // Use the appropriate value based on the accessMode
    const value =
      accessMode === "otp" ? input.join("").trim() : singleInput.trim();

    // Validation logic for each mode
    if (accessMode === "otp") {
      if (value.length !== 6) {
        setFormError("Please enter a valid 6-digit OTP.");
        return;
      }
    } else if (accessMode === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation
      if (!emailRegex.test(value)) {
        setFormError("Please enter a valid email address.");
        return;
      }
    } else if (accessMode === "name") {
      if (value.length < 2) {
        setFormError("Please enter your full name.");
        return;
      }
    } else if (accessMode === "phone") {
      if (!/^\+?\d{7,15}$/.test(value)) {
        // Allow phone numbers with optional '+' and 7-15 digits
        setFormError("Please enter a valid phone number.");
        return;
      }
    }

    // Clear any existing errors
    setFormError("");

    // Prepare the payload
    const payload = {
      event_id: event.id,
      mode: "online",
    };

    // Add the appropriate field to the payload based on the accessMode
    if (accessMode === "otp") {
      payload.otp = value;
    } else if (accessMode === "email") {
      payload.email = value;
    } else if (accessMode === "name") {
      payload.name = value;
    } else if (accessMode === "phone") {
      payload.phone = value;
    }

    // Dispatch the action with the payload
    dispatch(markAttendee(payload));
  };

  const handleQuickRegistration = () => {
    setShowQuickRegistration(true);
  };

  const closeQuickRegistration = () => {
    setShowQuickRegistration(false);
  };

  const closeResultModal = () => {
    setShowResultModal(false);
    // Reset the attendance status in Redux
    dispatch(resetAttendanceStatus());
    // Clear input fields after closing modal
    setInput(accessMode === "otp" ? ["", "", "", "", "", ""] : [""]);
  };

  if (loading) {
    return (
      <div className="event-loading">
        <div className="spinner" />
        <p>Loading event details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="event-error">
        <AlertCircle size={50} />
        <h3>Event Not Found</h3>
        <p>{error || "We couldn't find the event you're looking for."}</p>
      </div>
    );
  }

  const isRegistrationClosed =
    event.registration_deadline_status === "closed" ? true : false;
  const isEventPastOrOngoing = new Date() >= new Date(event.start_date);
  const showAttend =
    new Date(event.start_date).toDateString() === new Date().toDateString() ||
    eventStatus === "ongoing" ||
    eventStatus === "completed";

  // Determine event type tag
  let eventTypeTag = "";
  if (event.online && event.onsite) {
    eventTypeTag = "Hybrid (Online & Onsite)";
  } else if (event.online) {
    eventTypeTag = "Online";
  } else if (event.onsite) {
    eventTypeTag = "Onsite";
  }

  return (
    <div className="event-access-wrapper">
      <h1 className="event-title">{event.name}</h1>
      <p className="event-date">
        <CalendarDays size={18} />
        {new Date(`${event.start_date}T${event.start_time}`).toLocaleDateString(
          "en-US",
          {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false, // Use 24-hour format
          }
        )} 
        {" "}
        (GMT+1)
      </p>

      <div className="event-card">
        {event.image_url && (
          <div className="event-image-container">
            <img
              src={event.image_url || "/featured.jpeg"}
              alt={event.name}
              className="event-image"
            />
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
              <p>{formatDescription(event.description)}</p>
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
                {new Date(
                  `${event.registration_deadline}T${event.registration_deadline_time}`
                ).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false, // Use 24-hour format
                })}
                {" "}
                (GMT+1)
              </span>
            </div>
          </div>
        </div>

        {isRegistrationClosed ? (
          <p className="event-status closed">Early-bird Registration Closed</p>
        ) : (
          <button
            className="register-btn"
            onClick={() => navigate(`/event/${unique_id}/register`)}
          >
            Register Now
          </button>
        )}

        <div className={`countdown-container ongoing`}>
          <p className="countdown">Admit Guest</p>
        </div>

        {isRegistrationClosed && (
          <div className="quick-registration-section">
            <button
              onClick={handleQuickRegistration}
              className="quick-register-btn"
            >
              <Users size={18} />
              Quick Registration
            </button>
            <p className="quick-reg-note">
              Not yet Registered? Register quickly with minimal information.
            </p>
          </div>
        )}

        {showAttend && (
          <div className="access-section">
            <h3>
              {eventStatus === "upcoming"
                ? "Attend Onsite"
                : eventStatus === "ongoing"
                ? "Join Live Now"
                : "Watch Recording"}
            </h3>
            <label>{getInputLabel()}</label>
            {/* {renderSelectedInput()} */}

            {/* {accessMode === "email" && (
              <input
                type="email"
                value={input.join("")}
                onChange={(e) => setInput([e.target.value])}
                className="access-input"
                placeholder="Enter your email address"
              />
            )} */}

            {formError && (
              <p className="error-msg">
                <AlertCircle size={16} style={{ marginRight: "8px" }} />
                {formError}
              </p>
            )}
            
            {renderModeOptions()}
            
            <button
              onClick={handleValidation}
              className="watch-btn"
              disabled={attendeeLoading}
            >
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

            <label>{getInputLabel()}</label>
            {renderSelectedInput()}
          </div>
        )}
      </div>

      {/* Success/Error Modal */}
      {showResultModal && (
        <div className="result-modal-overlay">
          <div
            className={`result-modal ${attendeeSuccess ? "success" : "error"}`}
          >
            <button className="close-modal" onClick={closeResultModal}>
              <X size={24} />
            </button>

            <div className="modal-icon">
              {attendeeSuccess ? (
                <CheckCircle size={50} color="#4CAF50" />
              ) : (
                <AlertCircle size={50} color="#F44336" />
              )}
            </div>

            <h3 className="modal-title">
              {attendeeSuccess ? "Success" : "Error"}
            </h3>

            <p className="modal-message">
              {attendeeSuccess
                ? `${
                    attendeeData?.attendee?.name || "Guest"
                  } has been successfully marked as attended. Kindly admit and grant access.`
                : `The OTP or Email entered was unrecognized. Please retry or Quick Register the guest to receive an OTP.`}
            </p>

            {!attendeeSuccess && (
              <button
                className="quick-register-modal-btn"
                onClick={() => {
                  closeResultModal();
                  handleQuickRegistration();
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

      {showQuickRegistration && event && (
        <QuickRegistrationForm
          eventId={event.id}
          onClose={closeQuickRegistration}
        />
      )}
    </div>
  );
};

export default Admit;
