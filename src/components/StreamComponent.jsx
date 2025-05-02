import { useState } from "react"
import { FilmIcon, ChevronDown, ChevronUp, Globe, Youtube, Mic, Video } from "lucide-react"

const StreamComponent = ({ platforms, loading, error, eventName }) => {
  const [isOpen, setIsOpen] = useState(true)
  const [activePlatformId, setActivePlatformId] = useState(0)

  const getPlatformIcon = (name) => {
    switch (name?.toLowerCase()) {
      case "youtube":
        return <Youtube size={20} className="platform-icon youtube-icon" />
      case "mixlr":
        return <Mic size={20} className="platform-icon mixlr-icon" />
      case "zoom":
        return <Video size={20} className="platform-icon zoom-icon" />
      default:
        return <Globe size={20} className="platform-icon default-icon" />
    }
  }

  const renderEmbeddedContent = (platform) => {
    if (!platform?.embed_link && !platform?.embed_code) {
      return (
        <div className="no-embed-message">
          <p>No embeddable content available for this platform.</p>
          {platform?.visit_link && (
            <a href={platform.visit_link} target="_blank" rel="noopener noreferrer" className="visit-link">
              <Globe size={16} /> Visit Platform
            </a>
          )}
        </div>
      )
    }

    if (platform.embed_code) {
      return <div className="embed-container" dangerouslySetInnerHTML={{ __html: platform.embed_code }}></div>
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
    )
  }

  if (loading) {
    return (
      <div className="stream-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <span>Loading streams...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="stream-container">
        <div className="error-message">
          <p>Error loading streams: {error}</p>
        </div>
      </div>
    )
  }

  if (!platforms || platforms.length === 0) {
    return (
      <div className="stream-container">
        <div className="no-platforms-message">
          <p>No streams are currently available for this event.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="stream-container">
      <div className="stream-header">
        <h2>
          <FilmIcon size={24} />
          {eventName} - Live Stream
        </h2>
      </div>

      <div className="stream-accordion-wrapper">
        <div className="stream-accordion">
          <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
            <div className="accordion-title">
              <FilmIcon size={20} className="accordion-icon" /> Event Streams
              <span className="stream-count">{platforms.length}</span>
            </div>
            {isOpen ? <ChevronUp className="accordion-chevron" /> : <ChevronDown className="accordion-chevron" />}
          </div>

          {isOpen && (
            <div className="accordion-content">
              <div className="stream-tabs-container">
                <div className="platform-tabs">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      className={`platform-tab ${activePlatformId === platform.id ? "active" : ""}`}
                      onClick={() => setActivePlatformId(platform.id)}
                    >
                      {getPlatformIcon(platform.platform_name)}
                      {platform.platform_name}
                      <span className="view-count">{platform.views ?? 0}</span>
                    </button>
                  ))}
                </div>

                {platforms.map(
                  (platform) =>
                    activePlatformId === platform.id && (
                      <div className="stream-content" key={platform.id}>
                        {renderEmbeddedContent(platform)}
                      </div>
                    ),
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StreamComponent 