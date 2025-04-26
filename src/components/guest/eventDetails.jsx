import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/eventDetails.css"; // optional

const EventDetails = () => {
  const { unique_id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${unique_id}`);
        if (!response.ok) throw new Error("Event not found");
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError("Event not found or API issue");
        toast.error("Event not found");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [unique_id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const eventStartDate = new Date(event.start_date);
  const eventEndDate = new Date(event.end_date);
  const registrationDeadline = new Date(event.registration_deadline);
  const today = new Date();

  const isBeforeRegistrationDeadline = today < registrationDeadline;
  const isEventStartedOrLater = today >= eventStartDate;

  return (
    <div className="event-details">
      <ToastContainer autoClose={3000} />

      <h1>{event.name}</h1>

      {event.banner_url && (
        <img
          src={event.banner_url}
          alt={event.name}
          className="event-banner"
        />
      )}

      <p className="event-description">{event.description}</p>

      <p className="event-date">
        <strong>Date:</strong>{" "}
        {eventStartDate.toLocaleDateString()} - {eventEndDate.toLocaleDateString()}
      </p>

      <div className="event-actions">
        {isBeforeRegistrationDeadline && (
          <button className="btn register-btn">Register for Event</button>
        )}

        {isEventStartedOrLater && (
          <button className="btn stream-btn">Watch Online</button>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
