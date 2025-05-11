"use client";

import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../styles/access.css";
import "../styles/streamView.css";
import { fetchSingleEvent } from "../redux/slices/eventSlice";
import { markAttendee } from "../redux/slices/attendeeSlice";
import {
  fetchStreamingPlatforms,
  clearStreams,
} from "../redux/slices/streamSlice";
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
  FilmIcon,
  ChevronDown,
  ChevronUp,
  Globe,
  Youtube,
  Mic,
  Video,
  Copy,
  Check,
  Code,
  User,
  Phone,
} from "lucide-react";
import QuickRegistrationForm from "../components/forms/QuickRegistrationForm";
import FloatingFeedbackButton from "../components/forms/FloatingFeadbackButton";
import StreamComponent from "../components/StreamComponent";

const GuestEventAccess = () => {
  const { unique_id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Destructure state from useSelector
  const {
    singleEvent: event,
    loading: eventLoading,
    error: eventError,
  } = useSelector((state) => state.events);
  const {
    platforms,
    loading: streamsLoading,
    error: streamsError,
  } = useSelector((state) => state.streams);
  const {
    loading: attendeeLoading,
    error: attendeeError,
    success: attendeeSuccess,
  } = useSelector((state) => state.attendee);
  const accessModes = ["otp", "email", "name", "phone"];

  const [singleInput, setSingleInput] = useState(""); // for email, name, phone
  const [accessMode, setAccessMode] = useState("otp");
  const [input, setInput] = useState(["", "", "", "", "", ""]);
  const [formError, setFormError] = useState("");
  const [countdown, setCountdown] = useState("");
  const [eventStatus, setEventStatus] = useState("");
  const [showQuickRegistration, setShowQuickRegistration] = useState(false);
  const [showStream, setShowStream] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [activePlatformId, setActivePlatformId] = useState(0);
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch event data
  useEffect(() => {
    if (unique_id) {
      dispatch(fetchSingleEvent(unique_id));
    }
  }, [unique_id, dispatch]);

  // Check access and handle stream state
  useEffect(() => {
    const checkAccess = async () => {
      if (event && !accessChecked) {
        try {
          const response = await fetch(
            `/api/v1/event_attendees/check_access?event_id=${event.id}`
          );
          const data = await response.json();
          setHasAccess(data.has_access);
          if (data.has_access) {
            dispatch(fetchStreamingPlatforms(event.id));
            setShowStream(true);
          }
        } catch (error) {
          console.error("Error checking access:", error);
          setHasAccess(false);
        } finally {
          setAccessChecked(true);
        }
      }
    };

    checkAccess();

    return () => {
      dispatch(clearStreams());
      setShowStream(false);
      setHasAccess(false);
      setAccessChecked(false);
    };
  }, [event, dispatch]);

  // Handle successful attendance marking
  useEffect(() => {
    if (attendeeSuccess && event) {
      setHasAccess(true);
      dispatch(fetchStreamingPlatforms(event.id));
      setShowStream(true);
    }
  }, [attendeeSuccess, dispatch, event]);

  useEffect(() => {
    if (event) {
      const interval = setInterval(() => {
        const now = new Date();
        const start = new Date(event.start_date);
        const end = new Date(event.end_date);
        const timeLeft = start - now;

        // Determine event status
        if (now < start) {
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
        } else if (now >= start && now <= end) {
          setEventStatus("ongoing");
          setCountdown("EVENT IS LIVE TODAY!");
        } else if (now > end) {
          setEventStatus("completed");
          setCountdown("REWATCH EVENT");
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [event]);

  // 1. Add a useEffect to show backend errors as feedback and reset loading state
  useEffect(() => {
    if (attendeeError) {
      setFormError(attendeeError || "Invalid OTP or Email. Please try again.");
      // Optionally reset input if you want
      // setInput(accessMode === "otp" ? ["", "", "", "", "", ""] : [""]);
    }
  }, [attendeeError]);

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
    const value = accessMode === "otp" ? input.join("").trim() : singleInput.trim();
  
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
      if (!/^\+?\d{7,15}$/.test(value)) { // Allow phone numbers with optional '+' and 7-15 digits
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

  const getPlatformIcon = (name) => {
    switch (name?.toLowerCase()) {
      case "youtube":
        return <Youtube size={20} className="platform-icon youtube-icon" />;
      case "mixlr":
        return <Mic size={20} className="platform-icon mixlr-icon" />;
      case "zoom":
        return <Video size={20} className="platform-icon zoom-icon" />;
      default:
        return <Globe size={20} className="platform-icon default-icon" />;
    }
  };

  const renderEmbeddedContent = (platform) => {
    if (!platform?.embed_link && !platform?.embed_code) {
      return (
        <div className="no-embed-message">
          <p>No embeddable content available for this platform.</p>
          {platform?.visit_link && (
            <a
              href={platform.visit_link}
              target="_blank"
              rel="noopener noreferrer"
              className="visit-link"
            >
              <Globe size={16} /> Visit Platform
            </a>
          )}
        </div>
      );
    }

    if (platform.embed_code) {
      return (
        <div
          className="embed-container"
          dangerouslySetInnerHTML={{ __html: platform.embed_code }}
        ></div>
      );
    }

    return (
      <div className="embed-container">
        <iframe
          src={platform.embed_link}
          title={`${platform.platform_name} content`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  };

  const renderStreamSection = () => {
    if (streamsLoading) {
      return (
        <div className="stream-container">
          <div className="loading-container">
            <div className="spinner"></div>
            <span>Loading streams...</span>
          </div>
        </div>
      );
    }

    if (streamsError) {
      return (
        <div className="stream-container">
          <div className="error-message">
            <p>Error loading streams: {streamsError}</p>
          </div>
        </div>
      );
    }

    if (!platforms || platforms.length === 0) {
      return (
        <div className="stream-container">
          <div className="no-platforms-message">
            <p>No streams are currently available for this event.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="stream-container">
        <div className="stream-header">
          <h2>
            <FilmIcon size={24} />
            {event.name} - Live Stream
          </h2>
        </div>

        <div className="stream-accordion-wrapper">
          <div className="stream-accordion">
            <div
              className="accordion-header"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="accordion-title">
                <FilmIcon size={20} className="accordion-icon" /> Event Streams
                <span className="stream-count">{platforms.length}</span>
              </div>
              {isOpen ? (
                <ChevronUp className="accordion-chevron" />
              ) : (
                <ChevronDown className="accordion-chevron" />
              )}
            </div>

            {isOpen && (
              <div className="accordion-content">
                <div className="stream-tabs-container">
                  <div className="platform-tabs">
                    {platforms.map((platform) => (
                      <button
                        key={platform.id}
                        className={`platform-tab ${
                          activePlatformId === platform.id ? "active" : ""
                        }`}
                        onClick={() => setActivePlatformId(platform.id)}
                      >
                        {getPlatformIcon(platform.platform_name)}
                        {platform.platform_name}
                        <span className="view-count">
                          {platform.views ?? 0}
                        </span>
                      </button>
                    ))}
                  </div>

                  {platforms.map(
                    (platform) =>
                      activePlatformId === platform.id && (
                        <div className="stream-content" key={platform.id}>
                          {renderEmbeddedContent(platform)}
                        </div>
                      )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (eventLoading) {
    return (
      <div className="event-loading">
        <div className="spinner" />
        <p>Loading event details...</p>
      </div>
    );
  }

  if (eventError || !event) {
    return (
      <div className="event-error">
        <AlertCircle size={50} />
        <h3>Event Not Found</h3>
        <p>{eventError || "We couldn't find the event you're looking for."}</p>
      </div>
    );
  }

  const isRegistrationClosed =
    new Date() > new Date(event.registration_deadline);
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
      {!hasAccess ? (
        <>
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
                    {new Date(event.registration_deadline).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
              </div>
            </div>

            {isRegistrationClosed ? (
              <p className="event-status closed">
                Early-bird Registration Closed
              </p>
            ) : (
              <button
                className="register-btn"
                onClick={() => navigate(`/event/${unique_id}/register`)}
              >
                Register Now
              </button>
            )}

            <div className={`countdown-container ${eventStatus}`}>
              <p className="countdown">
                <Clock size={24} />
                {countdown}
              </p>
            </div>

            {isEventPastOrOngoing && (
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
                    ? "Attend Online"
                    : eventStatus === "ongoing"
                    ? "Join Live Now"
                    : "Watch Recording"}
                </h3>

                <label>{getInputLabel()}</label>
                {renderSelectedInput()}

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
                        ? "Watch Event"
                        : eventStatus === "ongoing"
                        ? "Join Live"
                        : "Watch Recording"}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* 2. Fix the back button to reset hasAccess and accessChecked */}
          <button
            className="back-button"
            onClick={() => {
              setShowStream(false);
              setHasAccess(false);
              setAccessChecked(false);
              setFormError(""); // Optionally clear error
              setInput(accessMode === "otp" ? ["", "", "", "", "", ""] : [""]);
            }}
          >
            ←
          </button>
          <StreamComponent
            platforms={platforms}
            loading={streamsLoading}
            error={streamsError}
            eventName={event.name}
          />
          {event && <FloatingFeedbackButton eventId={event.id} />}
        </>
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

export default GuestEventAccess;
