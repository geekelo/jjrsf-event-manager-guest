import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../redux/slices/eventSlice";
import GuestEventCard from "../components/guest/guestCard";
import "../styles/guest.css";

const GuestEventsPage = () => {
  const dispatch = useDispatch();
  const { filteredEvents = [], loading } = useSelector((state) => state.events);
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
   const res = dispatch(fetchEvents());
  }, [dispatch]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const today = new Date();

  const upcomingEvents = filteredEvents
    .filter((event) => new Date(event.end_date) >= today)
    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

  const pastEvents = filteredEvents
    .filter((event) => new Date(event.end_date) < today)
    .sort((a, b) => new Date(b.end_date) - new Date(a.end_date));

  const eventsToShow = activeTab === "upcoming" ? upcomingEvents : pastEvents;

  return (
    <div className="guest-events-container">
      <div className="guest-tabs">
        <button
          className={`guest-tab ${activeTab === "upcoming" ? "active" : ""}`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming Events
        </button>
        <button
          className={`guest-tab ${activeTab === "past" ? "active" : ""}`}
          onClick={() => setActiveTab("past")}
        >
          Past Events
        </button>
      </div>

      <div className="guest-events-list">
        {loading ? (
          <p className="guest-loading-text">Loading events...</p>
        ) : eventsToShow.length > 0 ? (
          eventsToShow.map((event) => (
            <GuestEventCard key={event.id} event={event} formatDate={formatDate} />
          ))
        ) : (
          <p className="guest-no-events-text">No {activeTab} events</p>
        )}
      </div>
    </div>
  );
};

export default GuestEventsPage;
