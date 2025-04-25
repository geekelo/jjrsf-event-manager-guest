"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CalendarDays, MapPin, CalendarCheck, ChevronRight, Star } from "lucide-react"

const EventsSection = ({ events, loading }) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("upcoming")

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  const today = new Date()

  const upcomingEvents = events
    .filter((event) => new Date(event.end_date) >= today)
    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))

  const pastEvents = events
    .filter((event) => new Date(event.end_date) < today)
    .sort((a, b) => new Date(b.end_date) - new Date(a.end_date))

  const eventsToShow = activeTab === "upcoming" ? upcomingEvents : pastEvents

  const handleViewEvent = (eventId) => {
    navigate(`/event/${eventId}`)
  }

  return (
    <section className="premium-events-section" id="events">
      <div className="premium-container">
        <div className="premium-section-intro">
          <div className="premium-section-header">
            <span className="section-kicker">Discover Our</span>
            <h2>{activeTab === "upcoming" ? "Upcoming Events" : "Past Events"}</h2>
          </div>
          <div className="section-decorator">
            <span></span>
            <Star className="decorator-icon" size={14} />
            <span></span>
          </div>
        </div>

        <div className="premium-events-tabs">
          <button
            className={`premium-tab-button ${activeTab === "upcoming" ? "active" : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            <CalendarCheck size={18} />
            Upcoming Events
          </button>
          <button
            className={`premium-tab-button ${activeTab === "past" ? "active" : ""}`}
            onClick={() => setActiveTab("past")}
          >
            <CalendarDays size={18} />
            Past Events
          </button>
        </div>

        {loading ? (
          <div className="premium-loading">
            <div className="loader-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <p>Loading events...</p>
          </div>
        ) : eventsToShow.length > 0 ? (
          <div className="premium-events-grid">
            {eventsToShow.map((event) => (
              <div className="premium-event-card" key={event.id} onClick={() => handleViewEvent(event.unique_id)}>
                <div className="premium-event-image">
                
                    <img src="/featured.jpeg" alt={event.name} className="event-placeholder-logo" />
           
                  <div className="event-date-badge">
                    <span className="date-day">{new Date(event.start_date).getDate()}</span>
                    <span className="date-month">
                      {new Date(event.start_date).toLocaleString("default", { month: "short" })}
                    </span>
                  </div>
                </div>
                <div className="premium-event-content">
                  <div className="event-status-badge">
                    <span className={`status-indicator ${activeTab === "upcoming" ? "upcoming" : "ongoing"}`}></span>
                    {activeTab === "upcoming" ? "Upcoming" : "Past"}
                  </div>
                  <h3>{event.name}</h3>
                  <div className="premium-event-meta">
                    <div className="meta-item">
                      <div className="meta-icon">
                        <CalendarDays size={14} />
                      </div>
                      <span>
                        {event.start_date === event.end_date
                          ? formatDate(event.start_date)
                          : `${formatDate(event.start_date)} - ${formatDate(event.end_date)}`}
                      </span>
                    </div>
                    {event.location && (
                      <div className="meta-item">
                        <div className="meta-icon">
                          <MapPin size={14} />
                        </div>
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                  <button className="premium-event-button">
                    View Details <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="premium-no-events">
            <CalendarDays size={50} className="no-events-icon" />
            <h3>No {activeTab} events found</h3>
            <p>Check back later for updates on our upcoming events and activities.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default EventsSection
