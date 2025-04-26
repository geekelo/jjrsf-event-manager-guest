import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../styles/access.css";
import { fetchSingleEvent } from "../redux/slices/eventSlice";
const GuestEventAccess = () => {
    const { unique_id } = useParams(); 
    const navigate = useNavigate();
    const dispatch = useDispatch();
  console.log(unique_id)
    // Destructure state from useSelector
    const { singleEvent: event, loading, error } = useSelector((state) => state.events);
  
    const [accessMode, setAccessMode] = useState("otp");
    const [input, setInput] = useState(["", "", "", "", ""]);
    const [formError, setFormError] = useState("");
    const [countdown, setCountdown] = useState("");
  
    useEffect(() => {
      if (unique_id) {
        dispatch(fetchSingleEvent(unique_id)); 
      }
    }, [unique_id, dispatch]);
  
    useEffect(() => {
      if (event) {
        const interval = setInterval(() => {
          const now = new Date();
          const start = new Date(event.start_date);
          const timeLeft = start - now;
  
          if (timeLeft <= 0) {
            clearInterval(interval);
            setCountdown("Event is live!");
          } else {
            const hrs = Math.floor(timeLeft / 1000 / 60 / 60);
            const mins = Math.floor((timeLeft / 1000 / 60) % 60);
            const secs = Math.floor((timeLeft / 1000) % 60);
            setCountdown(`${hrs}h ${mins}m ${secs}s`);
          }
        }, 1000);
  
        return () => clearInterval(interval);
      }
    }, [event]);
  
    const toggleMode = () => {
      setAccessMode((prev) => (prev === "otp" ? "email" : "otp"));
      setInput(["", "", "", "", ""]);
      setFormError("");
    };
  
    const handleValidation = () => {
      if (accessMode === "otp" && input.join("").length !== 5) {
        setFormError("Please enter a valid 5-digit OTP.");
      } else if (accessMode === "email" && !/\S+@\S+\.\S+/.test(input.join(""))) {
        setFormError("Please enter a valid email address.");
      } else {
        setFormError("");  
        console.log("Proceeding to event stream with:", input.join(""));
      }
    };
  console.log(event)
    if (loading) {
      return (
        <div className="event-loading">
          <div className="spinner" />
          <p>Loading event...</p>
        </div>
      );
    }
  
    if (error || !event) {
      return <div className="event-error">{error || "Event not found."}</div>;
    }
  
    const isRegistrationClosed = new Date() > new Date(event.registration_deadline);
    const showAttend =
      new Date(event.start_date).toDateString() === new Date().toDateString() &&
      (event.online || event.onsite);
  
    return (
      <div className="event-access-wrapper">
        <h1 className="event-title">{event.name}</h1>
        {event.image_url && (
        <img
          src={event.image_url}
          alt={event.name}
          className="event-banner"
        />
      )}
        <p className="event-date">Date: {new Date(event.start_date).toDateString()}</p>
        <p className="event-description">{event.description}</p>

<p className="event-location">
        <strong>Location:</strong> {event.location}
      </p>

      <p className="event-type">
        <strong>Type:</strong>{" "}
        {event.online && event.onsite
          ? "Hybrid"
          : event.online
          ? "Online"
          : "Onsite"}
      </p>

      <p className="event-status">
        <strong>Status:</strong> {event.status}
        </p>
        {isRegistrationClosed ? (
          <p className="event-status closed">Registration Closed</p>
        ) : (
          <button className="register-btn">Register Now</button>
        )}
  
        <p className="countdown">⏳ {countdown}</p>
        <p  onClick={() => navigate(`/event/frontdesk/${event.unique_id}`)} >feedback</p>
  
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
                      const newInput = [...input];
                      newInput[idx] = e.target.value;
                      setInput(newInput);
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
              />
            )}
  
            {formError && <p className="error-msg">{formError}</p>}
            <button onClick={handleValidation} className="watch-btn">
              Watch
            </button>
            <p onClick={toggleMode} className="toggle-mode">
              {accessMode === "otp"
                ? "Forgot your OTP? Use email instead"
                : "Use 5-digit OTP instead"}
            </p>
          </div>
        )}
      </div>
    );
  };
  
  export default GuestEventAccess;
  